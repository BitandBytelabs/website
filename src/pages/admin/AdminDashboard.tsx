import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Project, TeamMember, ResearchEntry, MediaItem, ActivityLog, SystemStats } from '../../types';
import { ProjectEditorModal } from './ProjectEditorPage';
import { StatusBadge } from '../../components/common/Badge';
import {
  Shield, LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Layers, Users, FileText, Image, Activity,
  Database, RefreshCw, CheckCircle2, AlertCircle, Search, Server, Radio, X
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'team' | 'research' | 'media' | 'logs'>('overview');

  // CMS Data State
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [research, setResearch] = useState<ResearchEntry[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Editor Modal state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null | undefined>(undefined);

  // Team Form Modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('Electronics');

  // Research Form Modal state
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('Hardware');
  const [resSummary, setResSummary] = useState('');
  const [resContent, setResContent] = useState('');

  // Media Upload state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statRes, projRes, teamRes, resRes, medRes, logRes] = await Promise.all([
        ApiService.getStats(),
        ApiService.getProjects({ includeDrafts: true }),
        ApiService.getTeam(true),
        ApiService.getResearch(true),
        ApiService.getMedia(),
        ApiService.getActivityLogs().catch(() => []),
      ]);

      setStats(statRes);
      setProjects(projRes);
      setTeam(teamRes);
      setResearch(resRes);
      setMedia(medRes);
      setLogs(logRes);
    } catch (err) {
      console.error('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="p-16 text-center font-mono text-[var(--text-muted)] space-y-2">
        <div className="w-6 h-6 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Verifying admin permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    onNavigate('/admin/login');
    return null;
  }

  // Action Handlers
  const handleTogglePublish = async (id: string, currentState: boolean) => {
    try {
      await ApiService.toggleProjectPublish(id, !currentState);
      loadAllData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this project?')) {
      try {
        await ApiService.deleteProject(id);
        loadAllData();
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (projectData.id) {
      await ApiService.updateProject(projectData.id, projectData);
    } else {
      await ApiService.createProject(projectData);
    }
    loadAllData();
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createTeamMember({
        name: newTeamName,
        role: newTeamRole,
        department: newTeamDept as any,
        shortBio: 'Engineering contributor',
        detailedBio: 'Contributor to BIT // VOLT engineering projects.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        skills: ['ECE', 'Circuit Design'],
        technologies: ['C++', 'KiCad'],
        expertise: ['Hardware'],
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        isFounder: false,
        projectCount: 1,
      });
      setShowTeamModal(false);
      setNewTeamName('');
      setNewTeamRole('');
      loadAllData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member from the roster?')) {
      try {
        await ApiService.deleteTeamMember(id);
        loadAllData();
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  const handleCreateResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createResearch({
        title: resTitle,
        category: resCategory,
        summary: resSummary,
        content: resContent || '# ' + resTitle + '\n\nResearch content draft.',
        author: user?.name || 'Lead Engineer',
        date: new Date().toISOString().split('T')[0],
        status: 'Published',
        tags: ['ECE', 'Research'],
      });
      setShowResearchModal(false);
      setResTitle('');
      setResSummary('');
      setResContent('');
      loadAllData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteResearch = async (id: string) => {
    if (confirm('Are you sure you want to delete this research paper?')) {
      try {
        await ApiService.deleteResearch(id);
        loadAllData();
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) return;
    try {
      await ApiService.uploadMedia({ title: newMediaTitle, url: newMediaUrl, category: 'General' });
      setNewMediaTitle('');
      setNewMediaUrl('');
      loadAllData();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (confirm('Are you sure you want to delete this media asset?')) {
      try {
        await ApiService.deleteMedia(id);
        loadAllData();
      } catch (err) {
        alert((err as Error).message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-xs text-[var(--text-primary)]">
      {/* CMS HEADER BAR */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl rounded-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--accent-glow)] border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shrink-0 rounded-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-wider">BIT // VOLT CMS Portal</h1>
              <span className="px-2 py-0.5 bg-[var(--accent-glow)] text-[var(--accent-color)] border border-[var(--accent-color)]/40 text-[10px] font-bold uppercase rounded-sm">
                [{user?.role || 'Super Admin'}]
              </span>
            </div>
            <p className="text-[var(--text-muted)] font-sans text-xs">
              Logged in as <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAllData}
            className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-color)] rounded-sm"
            title="Refresh CMS Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-950/30 border border-red-500/40 text-red-400 hover:bg-red-900/40 font-bold flex items-center space-x-2 uppercase rounded-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">TOTAL PROJECTS</span>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.totalProjects}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">PUBLISHED</span>
            <span className="text-xl font-bold text-[var(--accent-color)]">{stats.publishedProjects}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">IN DEVELOPMENT</span>
            <span className="text-xl font-bold text-amber-500">{stats.inDevelopmentProjects}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">TEAM MEMBERS</span>
            <span className="text-xl font-bold text-[var(--text-primary)]">{stats.totalTeamMembers}</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">DATABASE</span>
            <span className="text-xs font-bold text-[var(--accent-color)] truncate block uppercase">
              {stats.databaseConnected ? 'MongoDB Atlas' : 'In-Memory DB'}
            </span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-1 rounded-sm shadow-sm">
            <span className="text-[var(--text-muted)] text-[10px] block uppercase font-bold">UPTIME</span>
            <span className="text-xl font-bold text-sky-400">{stats.systemUptimeSeconds}s</span>
          </div>
        </div>
      )}

      {/* CMS TAB NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold rounded-sm ${
            activeTab === 'overview' ? 'bg-[var(--accent-color)] text-black' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold rounded-sm ${
            activeTab === 'projects' ? 'bg-[var(--accent-color)] text-black' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold rounded-sm ${
            activeTab === 'team' ? 'bg-[var(--accent-color)] text-black' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team ({team.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('research')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold rounded-sm ${
            activeTab === 'research' ? 'bg-[var(--accent-color)] text-black' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Research ({research.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold rounded-sm ${
            activeTab === 'media' ? 'bg-[var(--accent-color)] text-black' : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Media Assets</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase">Projects Repository CMS</h2>
            <button
              onClick={() => setEditingProject({})}
              className="px-4 py-2 bg-[var(--accent-color)] text-black font-bold uppercase flex items-center space-x-2 rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-x-auto rounded-sm shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Visibility</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="p-3 font-bold text-[var(--accent-color)]">PRJ-{p.projectNumber}</td>
                    <td className="p-3 font-bold text-[var(--text-primary)]">{p.title}</td>
                    <td className="p-3 text-[var(--text-muted)]">{p.category}</td>
                    <td className="p-3"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="p-3">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.published)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                          p.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft / Private'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingProject(p)}
                        className="p-1.5 bg-[var(--bg-surface)] text-[var(--text-primary)] hover:text-[var(--accent-color)] border border-[var(--border-color)] rounded-sm"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1.5 bg-red-950/30 text-red-400 hover:text-red-300 border border-red-500/30 rounded-sm"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAM TAB */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase">Team Roster CMS</h2>
            <button
              onClick={() => setShowTeamModal(true)}
              className="px-4 py-2 bg-[var(--accent-color)] text-black font-bold uppercase flex items-center space-x-2 rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-x-auto rounded-sm shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-[var(--bg-surface)]">
                    <td className="p-3 font-bold text-[var(--text-primary)] flex items-center space-x-2">
                      <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-sm object-cover" />
                      <span>{m.name}</span>
                    </td>
                    <td className="p-3 text-[var(--accent-color)]">{m.role}</td>
                    <td className="p-3 text-[var(--text-muted)]">{m.department}</td>
                    <td className="p-3 font-bold">{m.status}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteTeamMember(m.id)}
                        className="p-1.5 bg-red-950/30 text-red-400 border border-red-500/30 rounded-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESEARCH TAB */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--text-primary)] uppercase">Research Papers CMS</h2>
            <button
              onClick={() => setShowResearchModal(true)}
              className="px-4 py-2 bg-[var(--accent-color)] text-black font-bold uppercase flex items-center space-x-2 rounded-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Research Entry</span>
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-x-auto rounded-sm shadow-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {research.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--bg-surface)]">
                    <td className="p-3 font-bold text-[var(--text-primary)]">{r.title}</td>
                    <td className="p-3 text-[var(--accent-color)]">{r.category}</td>
                    <td className="p-3 text-[var(--text-muted)]">{r.author}</td>
                    <td className="p-3 text-[var(--text-muted)]">{r.date}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteResearch(r.id)}
                        className="p-1.5 bg-red-950/30 text-red-400 border border-red-500/30 rounded-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEDIA TAB */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4 rounded-sm shadow-md">
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase">Register Cloudinary / External Media Asset</h3>
            <form onSubmit={handleUploadMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Asset Title (e.g. PCB Oscilloscope Trace)"
                value={newMediaTitle}
                onChange={(e) => setNewMediaTitle(e.target.value)}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] rounded-sm"
              />
              <input
                type="url"
                placeholder="Cloudinary Asset URL"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] rounded-sm"
              />
              <button
                type="submit"
                className="bg-[var(--accent-color)] text-black font-bold uppercase rounded-sm"
              >
                Save Media Link
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((med) => (
              <div key={med.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-3 space-y-2 rounded-sm relative group">
                <img src={med.url} alt={med.title} className="w-full h-32 object-cover rounded-sm" />
                <p className="font-bold text-[11px] truncate text-[var(--text-primary)]">{med.title}</p>
                <button
                  onClick={() => handleDeleteMedia(med.id)}
                  className="absolute top-2 right-2 p-1 bg-red-950/80 text-red-300 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW TAB DEFAULT */}
      {activeTab === 'overview' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center space-y-3 rounded-sm">
          <Radio className="w-10 h-10 text-[var(--accent-color)] mx-auto animate-pulse" />
          <h2 className="text-xl font-bold uppercase text-[var(--text-primary)]">BIT // VOLT Management Operational</h2>
          <p className="text-[var(--text-muted)] text-xs font-sans max-w-xl mx-auto">
            Use the navigation tabs above to manage project specs, assign team members, publish research notes, and register Cloudinary media URLs.
          </p>
        </div>
      )}

      {/* PROJECT EDITOR MODAL */}
      {editingProject !== undefined && (
        <ProjectEditorModal
          project={editingProject}
          onClose={() => setEditingProject(undefined)}
          onSave={handleSaveProject}
        />
      )}

      {/* TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-md p-6 space-y-4 rounded-sm">
            <h3 className="font-bold uppercase text-[var(--text-primary)]">Add Team Member</h3>
            <form onSubmit={handleCreateTeamMember} className="space-y-3">
              <input
                type="text"
                placeholder="Member Name"
                required
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              />
              <input
                type="text"
                placeholder="Role / Title"
                required
                value={newTeamRole}
                onChange={(e) => setNewTeamRole(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              />
              <select
                value={newTeamDept}
                onChange={(e) => setNewTeamDept(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              >
                <option value="Electronics">Electronics</option>
                <option value="Communication">Communication</option>
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="Software">Software</option>
                <option value="AI/ML">AI/ML</option>
              </select>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-3 py-1.5 border border-[var(--border-color)] text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 bg-[var(--accent-color)] text-black font-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESEARCH MODAL */}
      {showResearchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-lg p-6 space-y-4 rounded-sm">
            <h3 className="font-bold uppercase text-[var(--text-primary)]">New Research Paper Entry</h3>
            <form onSubmit={handleCreateResearch} className="space-y-3">
              <input
                type="text"
                placeholder="Paper Title"
                required
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              />
              <select
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              >
                <option value="Hardware">Hardware</option>
                <option value="Communication">Communication</option>
                <option value="Firmware">Firmware</option>
                <option value="Software">Software</option>
              </select>
              <textarea
                placeholder="Summary / Abstract"
                required
                rows={3}
                value={resSummary}
                onChange={(e) => setResSummary(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-2 text-[var(--text-primary)] rounded-sm"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResearchModal(false)}
                  className="px-3 py-1.5 border border-[var(--border-color)] text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 bg-[var(--accent-color)] text-black font-bold">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
