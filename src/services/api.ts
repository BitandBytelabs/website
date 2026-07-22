import { Project, TeamMember, ResearchEntry, MediaItem, AdminUser, ActivityLog, SystemStats } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('bit_volt_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

export const ApiService = {
  // PUBLIC
  async getHealth() {
    return fetchJson<{ status: string; database: { type: string; connected: boolean }; uptime: number }>(`${API_BASE}/health`);
  },

  async getStats() {
    const res = await fetchJson<{ success: boolean; data: SystemStats }>(`${API_BASE}/stats`);
    return res.data;
  },

  async getProjects(filters?: { category?: string; status?: string; search?: string; includeDrafts?: boolean }): Promise<Project[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.includeDrafts) params.append('includeDrafts', 'true');

    const res = await fetchJson<{ success: boolean; data: Project[] }>(`${API_BASE}/projects?${params.toString()}`);
    return res.data;
  },

  async getProjectBySlug(slug: string): Promise<Project> {
    const res = await fetchJson<{ success: boolean; data: Project }>(`${API_BASE}/projects/${slug}`);
    return res.data;
  },

  async getTeam(includeAll = false): Promise<TeamMember[]> {
    const res = await fetchJson<{ success: boolean; data: TeamMember[] }>(`${API_BASE}/team?all=${includeAll}`);
    return res.data;
  },

  async getResearch(includeDrafts = false): Promise<ResearchEntry[]> {
    const res = await fetchJson<{ success: boolean; data: ResearchEntry[] }>(`${API_BASE}/research?includeDrafts=${includeDrafts}`);
    return res.data;
  },

  async getResearchBySlug(slug: string): Promise<ResearchEntry> {
    const res = await fetchJson<{ success: boolean; data: ResearchEntry }>(`${API_BASE}/research/${slug}`);
    return res.data;
  },

  // AUTH
  async adminLogin(email: string, pass: string) {
    const res = await fetchJson<{ success: boolean; token: string; user: AdminUser }>(`${API_BASE}/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    if (res.token) {
      localStorage.setItem('bit_volt_auth_token', res.token);
    }
    return res;
  },

  async adminLogout() {
    try {
      await fetchJson(`${API_BASE}/admin/logout`, { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('bit_volt_auth_token');
    }
  },

  async getAdminMe(): Promise<AdminUser> {
    const res = await fetchJson<{ success: boolean; user: AdminUser }>(`${API_BASE}/admin/me`);
    return res.user;
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetchJson<{ success: boolean; data: ActivityLog[] }>(`${API_BASE}/admin/logs`);
    return res.data;
  },

  // PROTECTED CMS
  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetchJson<{ success: boolean; data: Project }>(`${API_BASE}/admin/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    });
    return res.data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetchJson<{ success: boolean; data: Project }>(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async toggleProjectPublish(id: string, published: boolean): Promise<Project> {
    const res = await fetchJson<{ success: boolean; data: Project }>(`${API_BASE}/admin/projects/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
    });
    return res.data;
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const res = await fetchJson<{ success: boolean; data: TeamMember }>(`${API_BASE}/admin/team`, {
      method: 'POST',
      body: JSON.stringify(member),
    });
    return res.data;
  },

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const res = await fetchJson<{ success: boolean; data: TeamMember }>(`${API_BASE}/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/team/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  async createResearch(entry: Partial<ResearchEntry>): Promise<ResearchEntry> {
    const res = await fetchJson<{ success: boolean; data: ResearchEntry }>(`${API_BASE}/admin/research`, {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return res.data;
  },

  async deleteResearch(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/research/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },

  async getMedia(): Promise<MediaItem[]> {
    const res = await fetchJson<{ success: boolean; data: MediaItem[] }>(`${API_BASE}/admin/media`);
    return res.data;
  },

  async uploadMedia(data: { title: string; url: string; category?: string }): Promise<MediaItem> {
    const res = await fetchJson<{ success: boolean; data: MediaItem }>(`${API_BASE}/admin/media`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteMedia(id: string): Promise<boolean> {
    const res = await fetchJson<{ success: boolean }>(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  }
};
