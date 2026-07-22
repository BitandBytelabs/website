import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DbService, addActivityLog } from './db';
import { AdminRole, AdminUser } from '../src/types';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'bit_and_volt_super_secret_jwt_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

// Authentication Middleware
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.bit_volt_auth) {
    token = req.cookies.bit_volt_auth;
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized. Authentication token required.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication session.' });
    return;
  }
}

// Role-Based Authorization Middleware
export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${req.user.role}' lacks permissions for this operation. Required: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
}

export const router = Router();

// --- PUBLIC APIS ---

// Health Status
router.get('/health', async (req, res) => {
  const stats = await DbService.getStats();
  res.json({
    status: 'ok',
    brand: 'BIT // VOLT',
    tagline: 'Bits. Signals. Systems.',
    timestamp: new Date().toISOString(),
  });
});

// Overall Platform Metrics
router.get('/stats', async (req, res) => {
  const stats = await DbService.getStats();
  res.json({ success: true, data: stats });
});

// GET Public Projects
router.get('/projects', async (req, res) => {
  try {
    const category = req.query.category as string;
    const status = req.query.status as string;
    const search = req.query.search as string;
    const includeDrafts = req.query.includeDrafts === 'true';

    const projects = await DbService.getProjects({
      category,
      status,
      search,
      publishedOnly: !includeDrafts,
    });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET Project Details by Slug
router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await DbService.getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET Public Team Members
router.get('/team', async (req, res) => {
  try {
    const includeAll = req.query.all === 'true';
    const team = await DbService.getTeam(includeAll);
    res.json({ success: true, count: team.length, data: team });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET Public Research
router.get('/research', async (req, res) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';
    const research = await DbService.getResearch(!includeDrafts);
    res.json({ success: true, count: research.length, data: research });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET Single Research Article by Slug
router.get('/research/:slug', async (req, res) => {
  try {
    const article = await DbService.getResearchBySlug(req.params.slug);
    if (!article) {
      res.status(404).json({ success: false, error: 'Research article not found' });
      return;
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// --- ADMIN AUTHENTICATION APIS ---

router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    const admin = await DbService.getAdminByEmail(email);
    if (!admin) {
      addActivityLog('anonymous', email, 'Editor', 'FAILED_LOGIN', 'AUTH', undefined, `Invalid login attempt for email: ${email}`, req.ip);
      res.status(401).json({ success: false, error: 'Invalid credentials.' });
      return;
    }

    const validPassword = await DbService.verifyAdminPassword(email, password);
    if (!validPassword) {
      addActivityLog(admin.id, admin.name, admin.role, 'FAILED_LOGIN', 'AUTH', admin.id, 'Invalid password attempt.', req.ip);
      res.status(401).json({ success: false, error: 'Invalid credentials.' });
      return;
    }

    admin.lastLogin = new Date().toISOString();

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('bit_volt_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    addActivityLog(admin.id, admin.name, admin.role, 'ADMIN_LOGIN', 'AUTH', admin.id, 'Successful admin authentication session initiated.', req.ip);

    res.json({
      success: true,
      token,
      user: admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.post('/admin/logout', (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    addActivityLog(req.user.id, req.user.name, req.user.role, 'ADMIN_LOGOUT', 'AUTH', req.user.id, 'Logged out successfully.', req.ip);
  }
  res.clearCookie('bit_volt_auth');
  res.json({ success: true, message: 'Logged out successfully.' });
});

router.get('/admin/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

router.get('/admin/logs', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  const logs = await DbService.getActivityLogs();
  res.json({ success: true, count: logs.length, data: logs });
});

// --- PROTECTED CMS PROJECT MANAGEMENT APIS ---

router.post('/admin/projects', requireAuth, requireRole('Super Admin', 'Admin', 'Editor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectData = req.body;
    if (!projectData.title || !projectData.projectNumber || !projectData.category) {
      res.status(400).json({ success: false, error: 'Title, project number, and category are required.' });
      return;
    }

    // Auto-generate slug if missing
    if (!projectData.slug) {
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const existing = await DbService.getProjectBySlug(projectData.slug);
    if (existing) {
      projectData.slug = `${projectData.slug}-${Date.now()}`;
    }

    const created = await DbService.createProject(projectData);

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'CREATE_PROJECT', 'PROJECT', created.id, `Created project #${created.projectNumber}: ${created.title}`, req.ip);
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.put('/admin/projects/:id', requireAuth, requireRole('Super Admin', 'Admin', 'Editor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await DbService.updateProject(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Project not found.' });
      return;
    }

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'UPDATE_PROJECT', 'PROJECT', updated.id, `Updated project #${updated.projectNumber}: ${updated.title}`, req.ip);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.patch('/admin/projects/:id/publish', requireAuth, requireRole('Super Admin', 'Admin', 'Editor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { published } = req.body;
    const updated = await DbService.updateProject(req.params.id, { published: Boolean(published) });
    if (!updated) {
      res.status(404).json({ success: false, error: 'Project not found.' });
      return;
    }

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, published ? 'PUBLISH_PROJECT' : 'UNPUBLISH_PROJECT', 'PROJECT', updated.id, `${published ? 'Published' : 'Unpublished'} project #${updated.projectNumber}`, req.ip);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/admin/projects/:id', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await DbService.deleteProject(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Project not found.' });
      return;
    }

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'DELETE_PROJECT', 'PROJECT', req.params.id, `Deleted project ID ${req.params.id}`, req.ip);
    }

    res.json({ success: true, message: 'Project removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// --- PROTECTED TEAM MANAGEMENT APIS ---

router.post('/admin/team', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memberData = req.body;
    if (!memberData.name || !memberData.role || !memberData.department) {
      res.status(400).json({ success: false, error: 'Name, role, and department are required.' });
      return;
    }

    const created = await DbService.createTeamMember(memberData);
    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'CREATE_TEAM_MEMBER', 'TEAM', created.id, `Added team member: ${created.name} (${created.role})`, req.ip);
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.put('/admin/team/:id', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await DbService.updateTeamMember(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Team member not found.' });
      return;
    }

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'UPDATE_TEAM_MEMBER', 'TEAM', updated.id, `Updated team member: ${updated.name}`, req.ip);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/admin/team/:id', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await DbService.deleteTeamMember(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Team member not found.' });
      return;
    }

    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'DELETE_TEAM_MEMBER', 'TEAM', req.params.id, `Removed team member ID ${req.params.id}`, req.ip);
    }

    res.json({ success: true, message: 'Team member removed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// --- RESEARCH CMS APIS ---

router.post('/admin/research', requireAuth, requireRole('Super Admin', 'Admin', 'Editor'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.content || !data.author) {
      res.status(400).json({ success: false, error: 'Title, content, and author are required.' });
      return;
    }
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const created = await DbService.createResearch(data);
    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'CREATE_RESEARCH', 'RESEARCH', created.id, `Published research: ${created.title}`, req.ip);
    }
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

router.delete('/admin/research/:id', requireAuth, requireRole('Super Admin', 'Admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await DbService.deleteResearch(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Research article not found.' });
      return;
    }
    if (req.user) {
      addActivityLog(req.user.id, req.user.name, req.user.role, 'DELETE_RESEARCH', 'RESEARCH', req.params.id, `Deleted research paper ID ${req.params.id}`, req.ip);
    }
    res.json({ success: true, message: 'Research paper deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// --- MEDIA LIBRARY APIS ---

async function handleGetMedia(req: AuthenticatedRequest, res: Response) {
  try {
    const media = await DbService.getMedia();
    res.json({ success: true, count: media.length, data: media });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
}

async function handleUploadMedia(req: AuthenticatedRequest, res: Response) {
  try {
    const { file, fileDataUrl, dataUrl, url, title, category, folder } = req.body;
    const payload = file || fileDataUrl || dataUrl || url;

    if (!payload || typeof payload !== 'string') {
      res.status(400).json({ success: false, error: 'File image payload or data URL is required.' });
      return;
    }

    // Validate image format (JPG/JPEG, PNG, WEBP or valid http/https image URL)
    const isDataUrl = payload.startsWith('data:');
    if (isDataUrl) {
      const mimeMatch = payload.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
      if (!mimeMatch) {
        res.status(400).json({ success: false, error: 'Invalid image format. Must be JPEG, PNG, or WEBP image file.' });
        return;
      }
      const mime = mimeMatch[1].toLowerCase();
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mime)) {
        res.status(400).json({ success: false, error: 'Unsupported file format. Allowed formats: JPG, PNG, WEBP.' });
        return;
      }

      // Check max size 10MB (base64 length limit approx 14MB)
      if (payload.length > 14 * 1024 * 1024) {
        res.status(400).json({ success: false, error: 'File size exceeds maximum 10MB limit.' });
        return;
      }
    }

    // Normalize folder selection (Requirement 4)
    let targetFolder = folder || 'bitvolt/general';
    if (!targetFolder.startsWith('bitvolt/')) {
      targetFolder = `bitvolt/${targetFolder.replace(/^\/+/, '')}`;
    }

    // Upload to Cloudinary
    const cloudRes = await uploadImageToCloudinary(payload, targetFolder);

    // Save Cloudinary metadata to DB (Requirement 3)
    const item = await DbService.addMedia({
      title: title || `Asset_${Date.now()}`,
      url: cloudRes.secureUrl,
      secureUrl: cloudRes.secureUrl,
      cloudinaryPublicId: cloudRes.publicId,
      publicId: cloudRes.publicId,
      format: cloudRes.format.toUpperCase(),
      sizeBytes: cloudRes.sizeBytes,
      width: cloudRes.width,
      height: cloudRes.height,
      folder: cloudRes.folder,
      category: category || 'General',
      uploadedBy: req.user?.name || 'Admin',
    });

    if (req.user) {
      addActivityLog(
        req.user.id,
        req.user.name,
        req.user.role,
        'UPLOAD_MEDIA',
        'MEDIA',
        item.id,
        `Uploaded media asset '${item.title}' to ${cloudRes.folder}`,
        req.ip
      );
    }

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
}

async function handleDeleteMedia(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.params.id;
    const item = await DbService.getMediaById(id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Media asset not found.' });
      return;
    }

    // Requirement 9: Check whether image is referenced by any Project, Team Member, or Research entry
    const usage = await DbService.checkMediaInUse(item);
    if (usage.inUse) {
      res.status(400).json({
        success: false,
        error: `Cannot delete image because it is currently in use by: ${usage.usedBy.join(', ')}. Please remove references before deleting.`,
        usedBy: usage.usedBy,
      });
      return;
    }

    // Delete from Cloudinary if publicId exists
    const publicId = item.cloudinaryPublicId || item.publicId;
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }

    // Delete metadata from DB
    await DbService.deleteMedia(id);

    if (req.user) {
      addActivityLog(
        req.user.id,
        req.user.name,
        req.user.role,
        'DELETE_MEDIA',
        'MEDIA',
        id,
        `Deleted media asset '${item.title}'`,
        req.ip
      );
    }

    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// Support both /api/media and /api/admin/media
router.get('/media', requireAuth, handleGetMedia);
router.get('/admin/media', requireAuth, handleGetMedia);

router.post('/media/upload', requireAuth, handleUploadMedia);
router.post('/admin/media/upload', requireAuth, handleUploadMedia);
router.post('/admin/media', requireAuth, handleUploadMedia);

router.delete('/media/:id', requireAuth, requireRole('Super Admin', 'Admin'), handleDeleteMedia);
router.delete('/admin/media/:id', requireAuth, requireRole('Super Admin', 'Admin'), handleDeleteMedia);
