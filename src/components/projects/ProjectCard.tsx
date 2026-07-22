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
    <div 
      onClick={() => onSelect && onSelect(project.slug)}
      className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/70 transition-all duration-300 flex flex-col group shadow-md rounded-sm cursor-pointer overflow-hidden"
    >
      {/* Thumbnail Header */}
      <div className="relative h-48 overflow-hidden bg-[var(--bg-surface)]">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-80" />

        {/* Project Number Badge */}
        <div className="absolute top-3 left-3 bg-[var(--bg-surface)]/90 px-2.5 py-1 border border-[var(--border-color)] text-[10px] font-mono text-[var(--accent-color)] font-bold tracking-wider rounded-sm backdrop-blur-sm">
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
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--text-muted)]">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span className="uppercase tracking-wider font-semibold">{project.category}</span>
          </div>

          <h3 className="text-base font-bold font-mono text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors line-clamp-1 uppercase tracking-tight">
            {project.title}
          </h3>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 font-sans">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] rounded-sm">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Card Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-[var(--text-muted)] text-xs font-mono">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:text-[var(--accent-color)] transition-colors"
                  title="View GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(project.slug);
              }}
              className="inline-flex items-center space-x-1 text-[11px] font-mono text-[var(--accent-color)] hover:underline font-bold uppercase tracking-wider group/btn"
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
