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
      <div className="border-b border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5" />
          <span>PROJECT REPOSITORY & TECHNICAL SHOWCASE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
          Engineering Projects Catalog
        </h1>
        <p className="text-[#888] text-sm font-sans max-w-2xl leading-relaxed">
          Comprehensive catalog of BIT & VOLT systems spanning physical RF communication hardware, embedded firmware, robotics, and software architectures.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#666] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by title, component, or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#222] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-[#00FF41]"
            />
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center space-x-2 text-xs font-mono text-[#888] self-end md:self-auto">
            <span>SHOW:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 border ${
                viewMode === 'grid' ? 'bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/50' : 'bg-[#0A0A0A] border-[#222] text-[#888] hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 border ${
                viewMode === 'table' ? 'bg-[#00FF41]/20 text-[#00FF41] border-[#00FF41]/50' : 'bg-[#0A0A0A] border-[#222] text-[#888] hover:text-white'
              }`}
              title="Dense Systems Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1A1A1A]">
          <span className="text-xs font-mono text-[#666] mr-2 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#00FF41] text-black border border-[#00FF41] font-bold'
                  : 'bg-[#0A0A0A] text-[#888] hover:text-white border border-[#222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-[#666] mr-2">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 text-[11px] font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-[#FFB800] text-black border border-[#FFB800] font-bold'
                  : 'bg-[#0A0A0A] text-[#888] hover:text-white border border-[#222]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC BADGE SUMMARY */}
      <div className="flex items-center justify-between text-xs font-mono text-[#888]">
        <span>SHOWING {projects.length} ENGINEERING SYSTEMS</span>
        {searchTerm && <span>FILTERED BY "{searchTerm}"</span>}
      </div>

      {/* PROJECT LISTINGS */}
      {loading ? (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-12 text-center text-[#888] font-mono text-sm space-y-2">
          <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Querying database...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-12 text-center text-[#888] font-mono text-sm space-y-3">
          <p>No engineering projects matched the selected filters.</p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 text-xs font-mono bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/40 uppercase font-bold"
          >
            Reset All Filters
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
        /* DENSE SYSTEMS TABLE VIEW */
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] overflow-x-auto shadow-lg">
          <table className="w-full text-left font-mono text-xs text-[#E0E0E0]">
            <thead className="bg-[#0F0F0F] border-b border-[#1A1A1A] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Key Hardware</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#141414] transition-colors">
                  <td className="px-4 py-3 font-bold text-[#00FF41]">PROJ #{proj.projectNumber}</td>
                  <td className="px-4 py-3 font-semibold text-white uppercase">{proj.title}</td>
                  <td className="px-4 py-3 text-[#888]">{proj.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={proj.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-[#888] max-w-xs truncate">
                    {proj.hardware.slice(0, 2).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onNavigate(`/projects/${proj.slug}`)}
                      className="text-[#00FF41] hover:underline font-bold inline-flex items-center space-x-1 uppercase"
                    >
                      <span>SPEC</span>
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
