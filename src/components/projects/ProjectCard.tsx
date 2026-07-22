import React from 'react';
import { Project } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Cpu, Github, ExternalLink, ArrowRight, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect?: (slug: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#00FF41]/50 transition-all duration-300 flex flex-col group shadow-xl">
      {/* Thumbnail Header */}
      <div className="relative h-48 overflow-hidden bg-[#0A0A0A]">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

        {/* Project Number Badge */}
        <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 px-2.5 py-1 border border-[#2A2A2A] text-[10px] font-mono text-[#00FF41] font-bold tracking-wider">
          PRJ-{project.projectNumber}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={project.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#888]">
            <Layers className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="uppercase tracking-wider">{project.category}</span>
          </div>

          <h3 className="text-base font-bold font-mono text-white group-hover:text-[#00FF41] transition-colors line-clamp-1 uppercase tracking-tight">
            {project.title}
          </h3>

          <p className="text-xs text-[#888] leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-3 pt-2 border-t border-[#1A1A1A]">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-mono bg-[#141414] text-[#A0A0A0] border border-[#222]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#111] text-[#666] border border-[#222]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Card Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-[#888] text-xs font-mono">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:text-[#00FF41] transition-colors"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={() => onSelect ? onSelect(project.slug) : (window.location.hash = `#/projects/${project.slug}`)}
              className="inline-flex items-center space-x-1 text-[11px] font-mono text-[#00FF41] hover:underline font-bold uppercase tracking-wider group/btn"
            >
              <span>EXPLORE SPEC</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
