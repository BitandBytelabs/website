import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Project, ProjectCategory, ProjectStatus } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { StatusBadge } from '../components/common/Badge';
import { Search, Filter, Layers, LayoutGrid, List, ArrowRight, Radio } from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState<boolean>(true);

  const categories: string[] = [
    'All',
    'Electronics',
    'Communication',
    'Embedded Systems',
    'IoT',
    'Robotics',
    'Drones',
    'AI/ML',
    'Software',
    'Cybersecurity',
    'Other',
  ];

  const statuses: string[] = [
    'All',
    'Research',
    'Planning',
    'In Development',
    'Prototyping',
    'Testing',
    'Completed',
    'Archived',
  ];

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const data = await ApiService.getProjects({
          category: categoryFilter,
          status: statusFilter,
          search: searchTerm,
        });
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadProjects();
    }, 200);

    return () => clearTimeout(timer);
  }, [categoryFilter, statusFilter, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* HEADER */}
      <div className="border-b border-[var(--border-color)] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>PROJECT REPOSITORY & TECHNICAL SHOWCASE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
          Engineering Projects Catalog
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-sans max-w-2xl leading-relaxed">
          Comprehensive catalog of BIT // VOLT systems spanning physical RF communication hardware, embedded firmware, robotics, and software architectures.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-4 rounded-sm shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, component, or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] pl-9 pr-4 py-2 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
            />
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border text-xs font-mono rounded-sm transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)] font-bold'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 border text-xs font-mono rounded-sm transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--accent-color)] text-black border-[var(--accent-color)] font-bold'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] hover:text-[var(--text-primary)]'
              }`}
              title="Table/List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CATEGORY & STATUS CHIPS */}
        <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] shrink-0 font-bold">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap rounded-sm transition-all ${
                  categoryFilter === cat
                    ? 'bg-[var(--accent-color)] text-black font-bold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Statuses */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] shrink-0 font-bold">
              Status:
            </span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap rounded-sm transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-amber-500 hover:text-[var(--text-primary)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECT RESULTS DISPLAY */}
      {loading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)] font-mono text-sm rounded-sm">
          Searching project repository...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center space-y-3 rounded-sm">
          <p className="text-[var(--text-primary)] font-mono text-base font-bold uppercase">No projects match query filters.</p>
          <p className="text-[var(--text-muted)] text-xs font-mono">Try adjusting search term or resetting category filters.</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-[var(--accent-color)] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-sm mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelect={(slug) => onNavigate(`/projects/${slug}`)}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] overflow-x-auto rounded-sm shadow-md">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-[10px]">
                <th className="p-3 font-bold">ID</th>
                <th className="p-3 font-bold">Project Name</th>
                <th className="p-3 font-bold">Category</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Technologies</th>
                <th className="p-3 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  onClick={() => onNavigate(`/projects/${proj.slug}`)}
                  className="hover:bg-[var(--bg-card-hover)] cursor-pointer transition-colors"
                >
                  <td className="p-3 text-[var(--accent-color)] font-bold">PRJ-{proj.projectNumber}</td>
                  <td className="p-3 text-[var(--text-primary)] font-bold uppercase">{proj.title}</td>
                  <td className="p-3 text-[var(--text-muted)]">{proj.category}</td>
                  <td className="p-3">
                    <StatusBadge status={proj.status} size="sm" />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[9px] bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-[var(--accent-color)] font-bold hover:underline inline-flex items-center space-x-1 uppercase text-[10px]">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
