import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  INITIAL_PROJECTS,
  INITIAL_TEAM,
  INITIAL_RESEARCH,
  INITIAL_MEDIA,
  INITIAL_ADMIN_USERS,
  INITIAL_ACTIVITY_LOGS,
} from '../src/data/initialData';
import { Project, TeamMember, ResearchEntry, MediaItem, AdminUser, ActivityLog, SystemStats } from '../src/types';

// State flags
let isMongoConnected = false;
let startTime = Date.now();

// In-Memory Fallback Collections
let projectsStore: Project[] = [...INITIAL_PROJECTS];
let teamStore: TeamMember[] = [...INITIAL_TEAM];
let researchStore: ResearchEntry[] = [...INITIAL_RESEARCH];
let mediaStore: MediaItem[] = [...INITIAL_MEDIA];
let adminUsersStore: AdminUser[] = [...INITIAL_ADMIN_USERS];
let activityLogsStore: ActivityLog[] = [...INITIAL_ACTIVITY_LOGS];

// Admin password hashes for in-memory mode
// Default admin: admin@bitandvolt.org / Admin@BITVOLT2026!
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Admin@BITVOLT2026!', 10);
const adminPasswordMap: Record<string, string> = {
  'admin@bitandvolt.org': DEFAULT_PASSWORD_HASH,
};

// Mongo Mongoose Schemas (if MONGODB_URI is provided)
const ProjectSchema = new mongoose.Schema<Project>({
  id: { type: String, required: true, unique: true },
  projectNumber: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  technologies: [String],
  hardware: [String],
  software: [String],
  teamMemberIds: [String],
  startDate: { type: String, required: true },
  endDate: String,
  thumbnail: { type: String, required: true },
  gallery: [String],
  videos: [String],
  documentation: { type: String, required: true },
  docSections: [{ title: String, content: String }],
  githubUrl: String,
  demoUrl: String,
  specs: [{ label: String, value: String, unit: String }],
  keyAchievements: [String],
  challenges: [{ challenge: String, solution: String }],
  futureImprovements: [String],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { timestamps: true });

const TeamSchema = new mongoose.Schema<TeamMember>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  shortBio: { type: String, required: true },
  detailedBio: { type: String, required: true },
  profileImage: { type: String, required: true },
  skills: [String],
  technologies: [String],
  expertise: [String],
  github: String,
  linkedin: String,
  portfolio: String,
  email: String,
  joinDate: { type: String, required: true },
  status: { type: String, required: true },
  isFounder: { type: Boolean, default: false },
  projectCount: { type: Number, default: 0 },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { timestamps: true });

const ResearchSchema = new mongoose.Schema<ResearchEntry>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: String,
  date: { type: String, required: true },
  thumbnail: String,
  references: [String],
  tags: [String],
  status: { type: String, required: true, default: 'Published' },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
}, { timestamps: true });

const MediaSchema = new mongoose.Schema<MediaItem>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  secureUrl: String,
  cloudinaryPublicId: { type: String, required: true },
  publicId: String,
  format: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  width: Number,
  height: Number,
  folder: { type: String, default: 'bitvolt/general' },
  category: { type: String, required: true, default: 'General' },
  uploadedBy: { type: String, required: true, default: 'Admin' },
  createdAt: { type: String, required: true },
}, { timestamps: true });

const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const TeamModel = mongoose.models.Team || mongoose.model('Team', TeamSchema);
const ResearchModel = mongoose.models.Research || mongoose.model('Research', ResearchSchema);
const MediaModel = mongoose.models.Media || mongoose.model('Media', MediaSchema);

export async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim().length > 0) {
    console.log('MongoDB URI configured: true');
    console.log('Connecting to MongoDB Atlas...');
    try {
      await mongoose.connect(uri, {
        dbName: 'bitvolt',
        serverSelectionTimeoutMS: 5000,
      });
      isMongoConnected = true;
      console.log('MongoDB Atlas connected successfully.');
    } catch (err) {
      console.log(`MongoDB Atlas connection failed: ${(err as Error).message}`);
      console.log('Operating in high-performance reactive in-memory mode.');
      isMongoConnected = false;
    }
  } else {
    console.log('MongoDB URI configured: false');
    console.log('MONGODB_URI not configured. Using in-memory database.');
    isMongoConnected = false;
  }
}

// helper log
export function addActivityLog(
  userId: string,
  userName: string,
  userRole: any,
  action: string,
  targetType: any,
  targetId: string | undefined,
  details: string,
  ip = '127.0.0.1'
) {
  const log: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    userName,
    userRole,
    action,
    targetType,
    targetId,
    details,
    timestamp: new Date().toISOString(),
    ip,
  };
  activityLogsStore.unshift(log);
  if (activityLogsStore.length > 200) {
    activityLogsStore.pop();
  }
}

// Data Services Interface
export const DbService = {
  isMongoConnected: () => isMongoConnected,
  getUptimeSeconds: () => Math.floor((Date.now() - startTime) / 1000),

  // PROJECTS
  async getProjects(filters?: { category?: string; status?: string; publishedOnly?: boolean; search?: string }): Promise<Project[]> {
    let result: Project[] = [];
    if (isMongoConnected) {
      const query: any = {};
      if (filters?.publishedOnly) query.published = true;
      if (filters?.category && filters.category !== 'All') query.category = filters.category;
      if (filters?.status && filters.status !== 'All') query.status = filters.status;
      result = await ProjectModel.find(query).lean();
    } else {
      result = [...projectsStore];
      if (filters?.publishedOnly) {
        result = result.filter(p => p.published);
      }
      if (filters?.category && filters.category !== 'All') {
        result = result.filter(p => p.category === filters.category);
      }
      if (filters?.status && filters.status !== 'All') {
        result = result.filter(p => p.status === filters.status);
      }
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.projectNumber.includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q)) ||
        p.hardware.some(h => h.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => a.projectNumber.localeCompare(b.projectNumber));
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (isMongoConnected) {
      return await (ProjectModel as any).findOne({ slug }).lean();
    }
    return projectsStore.find(p => p.slug === slug) || null;
  },

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date().toISOString();
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      ...projectData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (isMongoConnected) {
      await (ProjectModel as any).create(newProj);
    } else {
      projectsStore.unshift(newProj);
    }

    return newProj;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const now = new Date().toISOString();
    if (isMongoConnected) {
      return await (ProjectModel as any).findOneAndUpdate({ id }, { ...updates, updatedAt: now }, { new: true }).lean();
    } else {
      const idx = projectsStore.findIndex(p => p.id === id);
      if (idx === -1) return null;
      projectsStore[idx] = { ...projectsStore[idx], ...updates, updatedAt: now };
      return projectsStore[idx];
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await (ProjectModel as any).deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initial = projectsStore.length;
      projectsStore = projectsStore.filter(p => p.id !== id);
      return projectsStore.length < initial;
    }
  },

  // TEAM
  async getTeam(includeAll = false): Promise<TeamMember[]> {
    if (isMongoConnected) {
      const query = includeAll ? {} : { status: 'Active' };
      return await (TeamModel as any).find(query).lean();
    } else {
      return includeAll ? [...teamStore] : teamStore.filter(t => t.status === 'Active');
    }
  },

  async getTeamMemberById(id: string): Promise<TeamMember | null> {
    if (isMongoConnected) {
      return await (TeamModel as any).findOne({ id }).lean();
    }
    return teamStore.find(t => t.id === id) || null;
  },

  async createTeamMember(memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    const now = new Date().toISOString();
    const id = `team-${Date.now()}`;
    const newMember: TeamMember = {
      ...memberData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (isMongoConnected) {
      await (TeamModel as any).create(newMember);
    } else {
      teamStore.push(newMember);
    }
    return newMember;
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    const now = new Date().toISOString();
    if (isMongoConnected) {
      return await (TeamModel as any).findOneAndUpdate({ id }, { ...updates, updatedAt: now }, { new: true }).lean();
    } else {
      const idx = teamStore.findIndex(t => t.id === id);
      if (idx === -1) return null;
      teamStore[idx] = { ...teamStore[idx], ...updates, updatedAt: now };
      return teamStore[idx];
    }
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await (TeamModel as any).deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initial = teamStore.length;
      teamStore = teamStore.filter(t => t.id !== id);
      return teamStore.length < initial;
    }
  },

  // RESEARCH
  async getResearch(publishedOnly = true): Promise<ResearchEntry[]> {
    if (isMongoConnected) {
      const query = publishedOnly ? { status: 'Published' } : {};
      return await (ResearchModel as any).find(query).lean();
    } else {
      return publishedOnly ? researchStore.filter(r => r.status === 'Published') : [...researchStore];
    }
  },

  async getResearchBySlug(slug: string): Promise<ResearchEntry | null> {
    if (isMongoConnected) {
      return await (ResearchModel as any).findOne({ slug }).lean();
    }
    return researchStore.find(r => r.slug === slug) || null;
  },

  async createResearch(data: Omit<ResearchEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchEntry> {
    const now = new Date().toISOString();
    const id = `res-${Date.now()}`;
    const newRes: ResearchEntry = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isMongoConnected) {
      await ResearchModel.create(newRes);
    } else {
      researchStore.unshift(newRes);
    }
    return newRes;
  },

  async deleteResearch(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await (ResearchModel as any).deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initial = researchStore.length;
      researchStore = researchStore.filter(r => r.id !== id);
      return researchStore.length < initial;
    }
  },

  // MEDIA
  async getMedia(): Promise<MediaItem[]> {
    if (isMongoConnected) {
      return await (MediaModel as any).find({}).sort({ createdAt: -1 }).lean();
    }
    return [...mediaStore];
  },

  async getMediaById(id: string): Promise<MediaItem | null> {
    if (isMongoConnected) {
      return await (MediaModel as any).findOne({ id }).lean();
    }
    return mediaStore.find(m => m.id === id) || null;
  },

  async addMedia(data: Omit<MediaItem, 'id' | 'createdAt'>): Promise<MediaItem> {
    const item: MediaItem = {
      ...data,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    if (isMongoConnected) {
      await (MediaModel as any).create(item);
    } else {
      mediaStore.unshift(item);
    }
    return item;
  },

  async deleteMedia(id: string): Promise<boolean> {
    if (isMongoConnected) {
      const res = await (MediaModel as any).deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const initial = mediaStore.length;
      mediaStore = mediaStore.filter(m => m.id !== id);
      return mediaStore.length < initial;
    }
  },

  async checkMediaInUse(mediaItem: MediaItem): Promise<{ inUse: boolean; usedBy: string[] }> {
    const projects = await this.getProjects();
    const team = await this.getTeam(true);
    const research = await this.getResearch(false);

    const usedBy: string[] = [];
    const url = mediaItem.url;
    const secureUrl = mediaItem.secureUrl;
    const publicId = mediaItem.cloudinaryPublicId || mediaItem.publicId;

    // Helper match function
    const matches = (targetUrl?: string | null) => {
      if (!targetUrl) return false;
      if (targetUrl === url || (secureUrl && targetUrl === secureUrl)) return true;
      if (publicId && targetUrl.includes(publicId)) return true;
      return false;
    };

    // Check Projects
    projects.forEach(p => {
      let isUsed = matches(p.thumbnail);
      if (!isUsed && p.gallery) {
        isUsed = p.gallery.some(g => matches(g));
      }
      if (isUsed) {
        usedBy.push(`Project: ${p.title}`);
      }
    });

    // Check Team Members
    team.forEach(t => {
      if (matches(t.profileImage)) {
        usedBy.push(`Team Member: ${t.name}`);
      }
    });

    // Check Research Articles
    research.forEach(r => {
      let isUsed = matches(r.thumbnail);
      if (!isUsed && r.content) {
        if (url && r.content.includes(url)) isUsed = true;
        if (secureUrl && r.content.includes(secureUrl)) isUsed = true;
        if (publicId && r.content.includes(publicId)) isUsed = true;
      }
      if (isUsed) {
        usedBy.push(`Research Entry: ${r.title}`);
      }
    });

    return {
      inUse: usedBy.length > 0,
      usedBy,
    };
  },

  // ADMIN AUTH & USERS
  async getAdminByEmail(email: string): Promise<AdminUser | null> {
    return adminUsersStore.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async verifyAdminPassword(email: string, plainPass: string): Promise<boolean> {
    const hash = adminPasswordMap[email.toLowerCase()];
    if (!hash) return false;
    return bcrypt.compare(plainPass, hash);
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    return [...adminUsersStore];
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    return [...activityLogsStore];
  },

  // STATS
  async getStats(): Promise<SystemStats> {
    const projects = await this.getProjects();
    const team = await this.getTeam(true);
    const research = await this.getResearch(false);

    return {
      totalProjects: projects.length,
      publishedProjects: projects.filter(p => p.published).length,
      inDevelopmentProjects: projects.filter(p => p.status === 'In Development' || p.status === 'Prototyping').length,
      totalTeamMembers: team.length,
      activeTeamMembers: team.filter(t => t.status === 'Active').length,
      totalResearchArticles: research.length,
      totalMediaAssets: mediaStore.length,
      databaseConnected: isMongoConnected,
      cloudinaryConnected: !!process.env.CLOUDINARY_CLOUD_NAME,
      systemUptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    };
  }
};
