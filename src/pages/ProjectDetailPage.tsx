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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#888] font-mono space-y-3">
        <div className="w-8 h-8 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="uppercase">Loading project technical specification...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <div className="p-6 bg-[#0D0D0D] border border-[#1A1A1A] space-y-3">
          <h2 className="text-xl font-bold text-white uppercase">Project Not Found</h2>
          <p className="text-xs text-[#888]">The requested slug "{slug}" could not be located in database records.</p>
          <button
            onClick={() => onNavigate('/projects')}
            className="px-4 py-2 text-xs bg-[#00FF41] text-black font-bold uppercase"
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
        className="inline-flex items-center space-x-2 text-xs font-mono text-[#888] hover:text-[#00FF41] transition-colors uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO ALL PROJECTS</span>
      </button>

      {/* PROJECT HEADER */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#1A1A1A] pb-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#0A0A0A] text-[#00FF41] border border-[#00FF41]/30 font-mono font-bold text-xs uppercase">
                PROJECT #{project.projectNumber}
              </span>
              <StatusBadge status={project.status} size="md" />
              <span className="px-2.5 py-1 bg-[#1A1A1A] text-[#E0E0E0] font-mono text-xs border border-[#222] uppercase">
                {project.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-[#AAA] font-sans leading-relaxed max-w-3xl">
              {project.fullDescription}
            </p>
          </div>

          {/* ACTION BUTTONS & LINKS */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 font-mono text-xs">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#0A0A0A] text-[#E0E0E0] border border-[#222] hover:border-[#00FF41] hover:text-[#00FF41] transition-all flex items-center space-x-2 uppercase font-bold"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] transition-all flex items-center space-x-2 uppercase"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Spec Sheet</span>
              </a>
            )}
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2">
          <div>
            <span className="text-[#666] block uppercase">START DATE</span>
            <span className="text-[#E0E0E0] font-semibold">{project.startDate}</span>
          </div>
          <div>
            <span className="text-[#666] block uppercase">STATUS</span>
            <span className="text-[#00FF41] font-semibold uppercase">{project.status}</span>
          </div>
          <div>
            <span className="text-[#666] block uppercase">HARDWARE COMPONENTS</span>
            <span className="text-[#E0E0E0] font-semibold">{project.hardware.length} Discrete Components</span>
          </div>
          <div>
            <span className="text-[#666] block uppercase">TEAM ASSIGNMENT</span>
            <span className="text-[#FFB800] font-semibold">{teamMembers.length} Members</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1A1A1A] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2.5 transition-colors flex items-center space-x-2 uppercase font-bold ${
            activeTab === 'architecture' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>System Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2.5 transition-colors flex items-center space-x-2 uppercase font-bold ${
            activeTab === 'specs' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Technical Specs & BOM</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2.5 transition-colors flex items-center space-x-2 uppercase font-bold ${
            activeTab === 'docs' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Full Documentation</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2.5 transition-colors flex items-center space-x-2 uppercase font-bold ${
            activeTab === 'challenges' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Challenges & Solutions</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 transition-colors flex items-center space-x-2 uppercase font-bold ${
            activeTab === 'gallery' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' : 'text-[#888] hover:bg-[#0D0D0D]'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Gallery & Media</span>
        </button>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. ARCHITECTURE TAB */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          {project.projectNumber === '001' ? (
            <BlockDiagram />
          ) : (
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-8 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold font-mono text-white flex items-center space-x-2 uppercase">
                <Layers className="w-5 h-5 text-[#00FF41]" />
                <span>System Architecture Block Diagram</span>
              </h3>
              <p className="text-xs text-[#888] font-mono">
                Component topology and hardware-software signal pipeline.
              </p>
              <div className="p-6 bg-[#0A0A0A] border border-[#222] text-center font-mono text-xs text-[#888]">
                [SYSTEM SCHEMATIC DIAGRAM RECORD REGISTERED]
              </div>
            </div>
          )}

          {/* KEY ACHIEVEMENTS */}
          {project.keyAchievements && project.keyAchievements.length > 0 && (
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold font-mono text-[#00FF41] flex items-center space-x-2 uppercase">
                <CheckCircle2 className="w-5 h-5" />
                <span>Key Engineering Achievements</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-[#AAA]">
                {project.keyAchievements.map((ach, idx) => (
                  <li key={idx} className="bg-[#0A0A0A] p-3 border border-[#222] flex items-start space-x-2">
                    <span className="text-[#00FF41] font-bold">✓</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. SPECS & BILL OF MATERIALS TAB */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TECHNICAL SPECIFICATIONS TABLE */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-mono text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <Sliders className="w-5 h-5 text-[#00FF41]" />
              <span>Technical Operating Parameters</span>
            </h3>

            {project.specs && project.specs.length > 0 ? (
              <div className="divide-y divide-[#1A1A1A] font-mono text-xs">
                {project.specs.map((spec, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="text-[#888]">{spec.label}</span>
                    <span className="text-[#00FF41] font-bold">
                      {spec.value} {spec.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#666]">No parameters recorded.</p>
            )}
          </div>

          {/* HARDWARE BILL OF MATERIALS */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-mono text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <Cpu className="w-5 h-5 text-[#FFB800]" />
              <span>Hardware Bill of Materials (BOM)</span>
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {project.hardware.map((hw, idx) => (
                <div key={idx} className="bg-[#0A0A0A] p-2.5 border border-[#222] text-[#E0E0E0] flex items-center justify-between">
                  <span>{hw}</span>
                  <span className="text-[#666] text-[10px] uppercase">Verified Component</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono text-[#888] block mb-2 font-bold uppercase">Software Stack & Tools:</span>
              <div className="flex flex-wrap gap-1.5">
                {project.software.map((sw, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs font-mono bg-[#1A1A1A] text-sky-400 border border-[#222] uppercase font-bold">
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DOCUMENTATION TAB */}
      {activeTab === 'docs' && (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
            <h3 className="text-xl font-bold font-mono text-white flex items-center space-x-2 uppercase">
              <FileText className="w-5 h-5 text-[#00FF41]" />
              <span>Comprehensive Engineering Documentation</span>
            </h3>
            <span className="text-xs font-mono text-[#888]">[MARKDOWN FORMAT]</span>
          </div>

          <MarkdownViewer content={project.documentation} />
        </div>
      )}

      {/* 4. CHALLENGES & ENGINEERING DECISIONS TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-mono text-[#FFB800] flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <AlertTriangle className="w-5 h-5" />
              <span>Technical Challenges & Solutions</span>
            </h3>

            {project.challenges && project.challenges.length > 0 ? (
              <div className="space-y-4">
                {project.challenges.map((item, idx) => (
                  <div key={idx} className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2 text-xs font-mono">
                    <div className="text-[#FFB800] font-bold flex items-center space-x-1 uppercase">
                      <span>CHALLENGE #{idx + 1}:</span>
                      <span>{item.challenge}</span>
                    </div>
                    <div className="text-[#00FF41] pt-2 border-t border-[#111] flex items-start space-x-1 font-sans">
                      <span className="font-mono font-bold shrink-0 uppercase">SOLUTION:</span>
                      <span className="text-[#AAA]">{item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#666]">No challenge records logged.</p>
            )}
          </div>

          {/* FUTURE IMPROVEMENTS */}
          {project.futureImprovements && project.futureImprovements.length > 0 && (
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold font-mono text-sky-400 flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
                <Lightbulb className="w-5 h-5" />
                <span>Planned Future Improvements & v2.0 Roadmap</span>
              </h3>

              <ul className="space-y-2 font-mono text-xs text-[#AAA]">
                {project.futureImprovements.map((imp, idx) => (
                  <li key={idx} className="bg-[#0A0A0A] p-3 border border-[#222] flex items-center space-x-2">
                    <span className="text-sky-400 font-bold">→</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. GALLERY & MEDIA TAB */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold font-mono text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <Image className="w-5 h-5 text-[#00FF41]" />
              <span>Project Hardware & Schematic Gallery</span>
            </h3>

            {project.gallery && project.gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((url, idx) => (
                  <div key={idx} className="bg-[#0A0A0A] overflow-hidden border border-[#222]">
                    <img
                      src={url}
                      alt={`Project Media ${idx + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#666]">No gallery images registered.</p>
            )}
          </div>
        </div>
      )}

      {/* TEAM ASSIGNMENT FOOTER */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold font-mono text-white flex items-center space-x-2 border-b border-[#1A1A1A] pb-2 uppercase">
          <Users className="w-4 h-4 text-[#00FF41]" />
          <span>Assigned Team Engineers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-[#0A0A0A] p-3 border border-[#222] flex items-center space-x-3">
              <img
                src={member.profileImage}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover border border-[#333]"
              />
              <div className="font-mono text-xs">
                <div className="font-bold text-white uppercase">{member.name}</div>
                <div className="text-[11px] text-[#00FF41]">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
