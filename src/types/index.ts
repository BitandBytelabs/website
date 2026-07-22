export type ProjectCategory =
  | 'Electronics'
  | 'Communication'
  | 'Embedded Systems'
  | 'IoT'
  | 'Robotics'
  | 'Drones'
  | 'AI/ML'
  | 'Software'
  | 'Cybersecurity'
  | 'Other';

export type ProjectStatus =
  | 'Research'
  | 'Planning'
  | 'In Development'
  | 'Prototyping'
  | 'Testing'
  | 'Completed'
  | 'Archived';

export interface TechSpec {
  label: string;
  value: string;
  unit?: string;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface ProjectDocSection {
  title: string;
  content: string;
}

export interface Project {
  _id?: string;
  id: string;
  projectNumber: string; // e.g. "001"
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  hardware: string[];
  software: string[];
  teamMemberIds: string[];
  startDate: string;
  endDate?: string;
  thumbnail: string;
  gallery: string[];
  videos: string[];
  documentation: string; // Markdown / structured text
  docSections?: ProjectDocSection[];
  githubUrl?: string;
  demoUrl?: string;
  specs: TechSpec[];
  keyAchievements: string[];
  challenges: ProjectChallenge[];
  futureImprovements: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Department =
  | 'Electronics'
  | 'Communication'
  | 'Embedded Systems'
  | 'Software'
  | 'AI/ML'
  | 'Robotics'
  | 'Research';

export type TeamStatus = 'Active' | 'Alumni' | 'Inactive';

export interface TeamMember {
  _id?: string;
  id: string;
  name: string;
  role: string;
  department: Department;
  shortBio: string;
  detailedBio: string;
  profileImage: string;
  skills: string[];
  technologies: string[];
  expertise: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  email?: string;
  joinDate: string;
  status: TeamStatus;
  isFounder: boolean;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchEntry {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  thumbnail?: string;
  references: string[];
  tags: string[];
  status: 'Draft' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  _id?: string;
  id: string;
  title: string;
  url: string;
  secureUrl?: string;
  cloudinaryPublicId: string;
  publicId?: string;
  format: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  folder?: string;
  category: 'Schematic' | 'PCB' | 'Diagram' | 'Prototype' | 'Video' | 'General';
  uploadedBy: string;
  createdAt: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin?: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: AdminRole;
  action: string;
  targetType: 'PROJECT' | 'TEAM' | 'RESEARCH' | 'MEDIA' | 'USER' | 'AUTH' | 'SYSTEM';
  targetId?: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface SystemStats {
  totalProjects: number;
  publishedProjects: number;
  inDevelopmentProjects: number;
  totalTeamMembers: number;
  activeTeamMembers: number;
  totalResearchArticles: number;
  totalMediaAssets: number;
  databaseConnected: boolean;
  cloudinaryConnected: boolean;
  systemUptimeSeconds: number;
}
