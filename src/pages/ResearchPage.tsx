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
      <div className="border-b border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5" />
          <span>LABORATORY INVESTIGATIONS & TECHNICAL PAPERS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
          Research & Experiment Notes
        </h1>
        <p className="text-[#888] text-sm font-sans max-w-2xl leading-relaxed">
          Technical investigations, RF measurements, firmware optimization benchmarks, and circuit design analyses authored by BIT & VOLT engineers.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search research papers, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#222] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#555] focus:outline-none focus:border-[#00FF41]"
          />
        </div>
        <div className="text-xs font-mono text-[#888] hidden sm:block uppercase">
          {filtered.length} RESEARCH PAPERS AVAILABLE
        </div>
      </div>

      {/* RESEARCH CARDS GRID */}
      {loading ? (
        <div className="p-12 text-center text-[#888] font-mono text-sm">
          Loading research papers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-12 text-center text-[#888] font-mono text-sm">
          No research articles found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-4 hover:border-[#00FF41]/50 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                  <span className="px-2.5 py-1 bg-[#0A0A0A] text-[#00FF41] border border-[#00FF41]/40 uppercase font-bold text-[10px]">
                    {item.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold font-mono text-white hover:text-[#00FF41] transition-colors uppercase">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#AAA] font-sans leading-relaxed">
                  {item.summary}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] font-mono bg-[#141414] text-[#888] border border-[#222]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1A1A1A] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-1.5 text-[#888]">
                  <User className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>{item.author}</span>
                </div>

                <button
                  onClick={() => setSelectedEntry(item)}
                  className="px-3 py-1.5 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/40 hover:bg-[#00FF41]/20 font-bold transition-all flex items-center space-x-1 uppercase text-[11px]"
                >
                  <span>READ PAPER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL RESEARCH PAPER MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 p-2 bg-[#1A1A1A] text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#1A1A1A] pb-4 font-mono">
              <span className="px-2.5 py-1 bg-[#0A0A0A] text-[#00FF41] border border-[#00FF41]/40 text-xs font-bold uppercase">
                {selectedEntry.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-2 uppercase">{selectedEntry.title}</h2>
              <div className="text-xs text-[#888] flex items-center space-x-4 pt-1">
                <span>By: {selectedEntry.author} ({selectedEntry.authorRole || 'Engineer'})</span>
                <span>Date: {selectedEntry.date}</span>
              </div>
            </div>

            {/* CONTENT */}
            <MarkdownViewer content={selectedEntry.content} />

            {/* REFERENCES */}
            {selectedEntry.references && selectedEntry.references.length > 0 && (
              <div className="pt-4 border-t border-[#1A1A1A] font-mono text-xs space-y-2">
                <span className="font-bold text-white block uppercase">Citations & References:</span>
                <ul className="list-disc ml-5 space-y-1 text-[#888]">
                  {selectedEntry.references.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
