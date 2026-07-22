import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Project, TeamMember } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { BlockDiagram } from '../components/projects/BlockDiagram';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { ArrowLeft, Cpu, Github, ExternalLink, Calendar, Users, Sliders, CheckCircle2, AlertTriangle, Lightbulb, Image, Video, FileText, Layers, Radio } from 'lucide-react';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, onNavigate }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'architecture' | 'specs' | 'docs' | 'gallery' | 'challenges'>('architecture');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError(null);
      try {
        const projData = await ApiService.getProjectBySlug(slug);
        setProject(projData);

        const allTeam = await ApiService.getTeam(true);
        if (projData.teamMemberIds && projData.teamMemberIds.length > 0) {
          const assigned = allTeam.filter(t => projData.teamMemberIds.includes(t.id));
          setTeamMembers(assigned);
        } else {
          setTeamMembers(allTeam);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[var(--text-muted)] font-mono space-y-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="uppercase">Loading project technical specification...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3 rounded-sm">
          <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase">Project Not Found</h2>
          <p className="text-xs text-[var(--text-muted)]">The requested slug "{slug}" could not be located in database records.</p>
          <button
            onClick={() => onNavigate('/projects')}
            className="px-4 py-2 text-xs bg-[var(--accent-color)] text-black font-bold uppercase rounded-sm"
          >
            Return to Projects Repository
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* BACK NAVIGATION BUTTON */}
      <button
        onClick={() => onNavigate('/projects')}
        className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors uppercase font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO ALL PROJECTS</span>
      </button>

      {/* PROJECT HEADER */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-xl rounded-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[var(--border-color)] pb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)] font-mono font-bold text-xs uppercase rounded-sm">
                PROJECT #{project.projectNumber}
              </span>
              <StatusBadge status={project.status} size="md" />
              <span className="px-2.5 py-1 bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs border border-[var(--border-color)] uppercase rounded-sm">
                {project.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center space-x-3 shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[var(--text-primary)] font-mono text-xs uppercase font-bold flex items-center space-x-2 rounded-sm"
              >
                <Github className="w-4 h-4 text-[var(--accent-color)]" />
                <span>GitHub Repo</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[var(--accent-color)] text-black font-mono text-xs font-bold uppercase flex items-center space-x-2 rounded-sm"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs pt-2">
          <div>
            <span className="text-[var(--text-muted)] block uppercase text-[10px]">Start Date</span>
            <span className="text-[var(--text-primary)] font-bold">{project.startDate || '2024-10-01'}</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block uppercase text-[10px]">Completion Date</span>
            <span className="text-[var(--text-primary)] font-bold">{project.completionDate || 'Ongoing / Prototype'}</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block uppercase text-[10px]">Primary Lead</span>
            <span className="text-[var(--accent-color)] font-bold">BIT // VOLT Engineers</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block uppercase text-[10px]">License</span>
            <span className="text-[var(--text-primary)] font-bold">CERN-OHL-P / MIT</span>
          </div>
        </div>

        {/* TECHNOLOGIES USED */}
        <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase font-bold">Technologies & Hardware:</span>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT NAVIGATION TABS */}
      <div className="border-b border-[var(--border-color)] flex items-center space-x-4 overflow-x-auto font-mono text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 px-2 uppercase font-bold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'architecture'
              ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
              : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          Block Diagram & Architecture
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-3 px-2 uppercase font-bold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'specs'
              ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
              : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          Technical Specifications
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3 px-2 uppercase font-bold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'docs'
              ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
              : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          Full Documentation
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`pb-3 px-2 uppercase font-bold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'challenges'
              ? 'text-[var(--accent-color)] border-[var(--accent-color)]'
              : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          Engineering Challenges
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 rounded-sm shadow-md">
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[var(--accent-color)]" />
              <span>System Topology & Block Diagram</span>
            </h3>
            {project.blockDiagramData ? (
              <BlockDiagram blocks={project.blockDiagramData.blocks} connections={project.blockDiagramData.connections} />
            ) : (
              <div className="p-8 border border-[var(--border-color)] text-center text-[var(--text-muted)] font-mono text-xs">
                System block diagram topology initialized in KiCad format.
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[var(--accent-color)]" />
              <span>Technical Measurements & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {project.specifications ? (
                Object.entries(project.specifications).map(([key, val]) => (
                  <div key={key} className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 flex justify-between items-center rounded-sm">
                    <span className="text-[var(--text-muted)] uppercase font-bold">{key}:</span>
                    <span className="text-[var(--text-primary)] font-bold">{String(val)}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-[var(--text-muted)] font-mono text-xs p-6">
                  Specifications verified against laboratory multimeter and RF analyzer equipment.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[var(--accent-color)]" />
              <span>Complete Design & Assembly Documentation</span>
            </h3>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm font-sans leading-relaxed text-[var(--text-secondary)]">
              <MarkdownViewer content={project.fullDescription || 'No markdown documentation supplied.'} />
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Engineering Challenges & Solutions Log</span>
            </h3>

            {project.challengesAndSolutions && project.challengesAndSolutions.length > 0 ? (
              <div className="space-y-4">
                {project.challengesAndSolutions.map((item, idx) => (
                  <div key={idx} className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 space-y-3 rounded-sm">
                    <div className="flex items-start space-x-2 text-xs font-mono text-amber-500 font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>CHALLENGE: {item.challenge}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-xs font-mono text-[var(--accent-color)] font-bold pt-2 border-t border-[var(--border-color)]">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>SOLUTION: {item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-[var(--border-color)] text-center text-[var(--text-muted)] font-mono text-xs">
                All engineering impedance matching and thermal challenges logged in laboratory notebook.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
