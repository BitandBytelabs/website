import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { ResearchEntry } from '../types';
import { MarkdownViewer } from '../components/common/MarkdownViewer';
import { Terminal, BookOpen, Search, ArrowRight, User, Calendar, Tag, X, Radio } from 'lucide-react';

interface ResearchPageProps {
  onNavigate: (path: string) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onNavigate }) => {
  const [researchList, setResearchList] = useState<ResearchEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ResearchEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadResearch() {
      setLoading(true);
      try {
        const data = await ApiService.getResearch();
        setResearchList(data);
      } catch (err) {
        console.error('Failed to load research:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  const filtered = researchList.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* HEADER */}
      <div className="border-b border-[var(--border-color)] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>LABORATORY INVESTIGATIONS & TECHNICAL PAPERS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
          Research & Experiment Notes
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-sans max-w-2xl leading-relaxed">
          Technical investigations, RF measurements, firmware optimization benchmarks, and circuit design analyses authored by BIT // VOLT engineers.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 flex items-center justify-between rounded-sm shadow-md">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search research papers, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] pl-9 pr-4 py-2 text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
          />
        </div>
        <div className="text-xs font-mono text-[var(--text-muted)] hidden sm:block uppercase font-bold">
          {filtered.length} RESEARCH PAPERS AVAILABLE
        </div>
      </div>

      {/* RESEARCH CARDS GRID */}
      {loading ? (
        <div className="p-12 text-center text-[var(--text-muted)] font-mono text-sm bg-[var(--bg-card)] border border-[var(--border-color)] rounded-sm">
          Loading research papers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)] font-mono text-sm rounded-sm">
          No research articles found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4 hover:border-[var(--accent-color)] transition-all shadow-md flex flex-col justify-between rounded-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                  <span className="px-2.5 py-1 bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)] uppercase font-bold text-[10px] rounded-sm">
                    {item.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors uppercase">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tg, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--text-muted)]">Author: {item.author}</span>
                <button
                  onClick={() => setSelectedEntry(item)}
                  className="text-[var(--accent-color)] font-bold hover:underline uppercase flex items-center space-x-1"
                >
                  <span>READ PAPER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL RESEARCH MODAL / VIEWER */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 rounded-sm shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-3 border-b border-[var(--border-color)] pb-6 font-mono">
              <span className="px-3 py-1 bg-[var(--bg-card)] text-[var(--accent-color)] border border-[var(--border-color)] uppercase font-bold text-xs">
                {selectedEntry.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] uppercase">
                {selectedEntry.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] pt-1">
                <span>AUTHOR: {selectedEntry.author}</span>
                <span>DATE: {selectedEntry.date}</span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm font-sans leading-relaxed text-[var(--text-secondary)]">
              <MarkdownViewer content={selectedEntry.content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
