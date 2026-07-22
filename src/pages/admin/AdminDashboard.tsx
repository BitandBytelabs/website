import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';
import { Project, TeamMember, ResearchEntry, MediaItem, ActivityLog, SystemStats } from '../../types';
import { ProjectEditorModal } from './ProjectEditorPage';
import { StatusBadge } from '../../components/common/Badge';
import {
  Shield, LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Layers, Users, FileText, Image, Activity,
  Database, RefreshCw, CheckCircle2, AlertCircle, Search, Server, Radio
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
    } fontFinally: {
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
      <div className="p-16 text-center font-mono text-slate-400 space-y-2">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
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
    if (confirm('Are you sure you want to delete this project?')) {
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
        detailedBio: 'Contributor to BIT & VOLT engineering projects.',
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
    if (confirm('Delete this team member from the roster?')) {
      try {
        await ApiService.deleteTeamMember(id);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-xs text-[#E0E0E0]">
      {/* CMS HEADER BAR */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white uppercase tracking-wider">BIT // VOLT CMS Portal</h1>
              <span className="px-2 py-0.5 bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 text-[10px] font-bold uppercase">
                [{user?.role || 'Super Admin'}]
              </span>
            </div>
            <p className="text-[#888] font-sans text-xs">
              Logged in as <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAllData}
            className="p-2 bg-[#0A0A0A] border border-[#222] text-[#AAA] hover:text-[#00FF41]"
            title="Refresh CMS Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/60 font-bold flex items-center space-x-2 uppercase"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">TOTAL PROJECTS</span>
            <span className="text-xl font-bold text-white">{stats.totalProjects}</span>
          </div>
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">PUBLISHED</span>
            <span className="text-xl font-bold text-[#00FF41]">{stats.publishedProjects}</span>
          </div>
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">IN DEVELOPMENT</span>
            <span className="text-xl font-bold text-[#FFB800]">{stats.inDevelopmentProjects}</span>
          </div>
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">TEAM MEMBERS</span>
            <span className="text-xl font-bold text-white">{stats.totalTeamMembers}</span>
          </div>
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">DATABASE</span>
            <span className="text-xs font-bold text-[#00FF41] truncate block uppercase">
              {stats.databaseConnected ? 'MongoDB Atlas' : 'In-Memory DB'}
            </span>
          </div>
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-1">
            <span className="text-[#666] text-[10px] block uppercase font-bold">UPTIME</span>
            <span className="text-xl font-bold text-sky-400">{stats.systemUptimeSeconds}s</span>
          </div>
        </div>
      )}

      {/* CMS TAB NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1A1A1A] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold ${
            activeTab === 'overview' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold ${
            activeTab === 'projects' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold ${
            activeTab === 'team' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team ({team.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold ${
            activeTab === 'media' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Media Assets ({media.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 transition-colors flex items-center space-x-1.5 uppercase font-bold ${
            activeTab === 'logs' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Logs ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <Server className="w-4 h-4 text-[#00FF41]" />
              <span>Production Infrastructure Status</span>
            </h3>

            <div className="space-y-3 font-sans text-xs text-[#AAA]">
              <div className="bg-[#0A0A0A] p-3 border border-[#222] flex items-center justify-between font-mono">
                <span className="uppercase font-bold text-[#888]">Database Engine</span>
                <span className="text-[#00FF41] font-bold uppercase">
                  {stats?.databaseConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Reactive Store (Active)'}
                </span>
              </div>
              <div className="bg-[#0A0A0A] p-3 border border-[#222] flex items-center justify-between font-mono">
                <span className="uppercase font-bold text-[#888]">Media Cloud</span>
                <span className="text-sky-400 font-bold uppercase">Cloudinary Free Tier Ready</span>
              </div>
              <div className="bg-[#0A0A0A] p-3 border border-[#222] flex items-center justify-between font-mono">
                <span className="uppercase font-bold text-[#888]">Keep-Alive Monitor</span>
                <span className="text-purple-400 font-bold uppercase">UptimeRobot Registered</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <Activity className="w-4 h-4 text-[#FFB800]" />
              <span>Recent Activity Stream</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-[11px]">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="bg-[#0A0A0A] p-2.5 border border-[#222]">
                  <div className="flex items-center justify-between text-[#888]">
                    <span className="font-bold text-[#00FF41] uppercase">{log.action}</span>
                    <span className="text-[10px]">{log.timestamp.split('T')[1]?.split('.')[0]}</span>
                  </div>
                  <p className="text-[#E0E0E0] font-sans mt-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS MANAGER */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#0D0D0D] p-4 border border-[#1A1A1A]">
            <span className="font-bold text-white uppercase tracking-wider">Project Records Management</span>
            <button
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] flex items-center space-x-2 uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE NEW PROJECT</span>
            </button>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] overflow-x-auto shadow-2xl">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0A0A0A] border-b border-[#1A1A1A] text-[#888] uppercase text-[10px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Published</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#111]">
                    <td className="p-3 font-bold text-[#00FF41]">#{p.projectNumber}</td>
                    <td className="p-3 font-semibold text-white">{p.title}</td>
                    <td className="p-3 text-[#888]">{p.category}</td>
                    <td className="p-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleTogglePublish(p.id, p.published)}
                        className={`px-2 py-0.5 border text-[10px] font-bold uppercase ${
                          p.published ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30' : 'bg-[#1A1A1A] text-[#666] border-[#222]'
                        }`}
                      >
                        {p.published ? 'PUBLISHED' : 'DRAFT'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingProject(p)}
                        className="p-1.5 text-[#AAA] hover:text-[#00FF41]"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1.5 text-[#AAA] hover:text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM MANAGER */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#0D0D0D] p-4 border border-[#1A1A1A]">
            <span className="font-bold text-white uppercase tracking-wider">Team Roster Management</span>
            <button
              onClick={() => setShowTeamModal(true)}
              className="px-4 py-2 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] flex items-center space-x-2 uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>ADD TEAM MEMBER</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((m) => (
              <div key={m.id} className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 flex items-center justify-between shadow-xl">
                <div className="flex items-center space-x-3">
                  <img src={m.profileImage} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-[#333]" />
                  <div>
                    <div className="font-bold text-white uppercase">{m.name}</div>
                    <div className="text-[11px] text-[#00FF41]">{m.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTeamMember(m.id)}
                  className="p-2 text-[#666] hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* ADD TEAM MODAL */}
          {showTeamModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Add New Team Member</h3>
                <form onSubmit={handleCreateTeamMember} className="space-y-3">
                  <div>
                    <label className="block text-[#888] mb-1 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888] mb-1 uppercase">Role Title</label>
                    <input
                      type="text"
                      required
                      value={newTeamRole}
                      onChange={(e) => setNewTeamRole(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowTeamModal(false)}
                      className="px-3 py-2 bg-[#1A1A1A] text-[#AAA] hover:bg-[#222] uppercase font-bold"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#00FF41] text-black font-bold uppercase">
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MEDIA LIBRARY */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-[#0D0D0D] p-4 border border-[#1A1A1A] space-y-3 shadow-xl">
            <span className="font-bold text-white block uppercase tracking-wider">Register Cloudinary Media Asset</span>
            <form onSubmit={handleUploadMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Media Title (e.g. AM PCB Top Layer)"
                value={newMediaTitle}
                onChange={(e) => setNewMediaTitle(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
              />
              <input
                type="url"
                placeholder="Cloudinary Image URL"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
              />
              <button type="submit" className="bg-[#00FF41] text-black font-bold p-2 uppercase">
                Register Asset
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {media.map((med) => (
              <div key={med.id} className="bg-[#0D0D0D] border border-[#1A1A1A] overflow-hidden p-3 space-y-2 shadow-xl">
                <img src={med.url} alt={med.title} className="w-full h-32 object-cover bg-[#0A0A0A]" />
                <div className="font-bold text-white truncate uppercase">{med.title}</div>
                <div className="text-[10px] text-[#888] flex justify-between uppercase font-bold">
                  <span>{med.category}</span>
                  <span>{med.format}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-2xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Security Audit Logs</h3>
          <div className="divide-y divide-[#1A1A1A] text-[11px]">
            {logs.map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#00FF41] mr-2 uppercase">[{log.action}]</span>
                  <span className="text-[#E0E0E0]">{log.details}</span>
                </div>
                <span className="text-[#666]">{log.timestamp}</span>
              </div>
            ))}
          </div>
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
    </div>
  );
};
