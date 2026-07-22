import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { TeamMember, Department } from '../types';
import { User, Github, Linkedin, Mail, ExternalLink, ShieldCheck, Sparkles, Send, X, Radio } from 'lucide-react';

interface TeamPageProps {
  onNavigate: (path: string) => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [applyModalOpen, setApplyModalOpen] = useState<boolean>(false);
  const [applySubmitted, setApplySubmitted] = useState<boolean>(false);

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantDept, setApplicantDept] = useState<Department>('Electronics');
  const [applicantSkills, setApplicantSkills] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');

  const departments: string[] = [
    'All',
    'Electronics',
    'Communication',
    'Embedded Systems',
    'Software',
    'AI/ML',
    'Robotics',
    'Research',
  ];

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);
      try {
        const data = await ApiService.getTeam(true);
        setTeamMembers(data);
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  const activeMembers = teamMembers.filter(t => t.status === 'Active' && (selectedDept === 'All' || t.department === selectedDept));
  const alumniMembers = teamMembers.filter(t => t.status === 'Alumni' && (selectedDept === 'All' || t.department === selectedDept));

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySubmitted(true);
    setTimeout(() => {
      setApplyModalOpen(false);
      setApplySubmitted(false);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantSkills('');
      setApplicantPortfolio('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>ENGINEERING ROSTER & COLLECTIVE LEADERSHIP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
            THE PEOPLE BEHIND THE SYSTEMS
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-sans max-w-2xl leading-relaxed">
            Founded by 3 ECE & CSE engineers, BIT // VOLT is an independent collective designed for multi-disciplinary hardware-software research and systems development.
          </p>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-5 py-2.5 bg-[var(--accent-color)] text-black font-mono font-bold text-xs hover:opacity-90 transition-all shadow-lg shrink-0 flex items-center space-x-2 uppercase tracking-wider rounded-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>JOIN THE COLLECTIVE</span>
        </button>
      </div>

      {/* DEPARTMENT FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-[var(--bg-card)] p-3 border border-[var(--border-color)] font-mono text-xs rounded-sm shadow-md">
        <span className="text-[var(--text-muted)] px-2 uppercase font-bold">DEPARTMENT:</span>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 transition-colors uppercase font-bold rounded-sm ${
              selectedDept === dept
                ? 'bg-[var(--accent-color)] text-black'
                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* ACTIVE TEAM MEMBERS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[var(--accent-color)]" />
            <span>Active Engineers ({activeMembers.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center text-[var(--text-muted)] font-mono text-sm rounded-sm">
            Loading team roster...
          </div>
        ) : activeMembers.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center text-[var(--text-muted)] font-mono text-sm rounded-sm">
            No active engineers in this department.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4 hover:border-[var(--accent-color)] transition-all flex flex-col justify-between rounded-sm shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={member.name}
                      className="w-16 h-16 rounded-sm object-cover border border-[var(--border-color)] group-hover:border-[var(--accent-color)] transition-colors"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase">
                          {member.name}
                        </h3>
                        {member.isFounder && (
                          <span className="px-2 py-0.5 text-[9px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-sm font-bold">
                            FOUNDER
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-[var(--accent-color)] font-bold mt-0.5">
                        {member.role}
                      </p>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mt-1">
                        [{member.department}]
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {/* EXPERTISE TAGS */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-color)]">
                    {member.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-sm"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* SOCIAL LINKS */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center space-x-3 text-[var(--text-muted)]">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent-color)] transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent-color)] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="hover:text-[var(--accent-color)] transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALUMNI MEMBERS SECTION */}
      {alumniMembers.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
          <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] uppercase flex items-center space-x-2">
            <span>Alumni & Past Contributors ({alumniMembers.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alumniMembers.map((member) => (
              <div key={member.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-2 rounded-sm opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-sm object-cover border border-[var(--border-color)]" />
                  <div>
                    <h4 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase">{member.name}</h4>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-lg p-6 space-y-6 font-mono text-xs rounded-sm shadow-2xl relative">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase">Apply to Join BIT // VOLT</h3>
              <p className="text-[var(--text-muted)] text-[11px] font-sans">
                Submit your engineering background and interests to join our hardware and software labs.
              </p>
            </div>

            {applySubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 text-center space-y-2 text-emerald-400">
                <p className="font-bold uppercase text-sm">Application Received!</p>
                <p className="text-[11px] font-sans">Our founding engineers will review your submission shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="e.g. alex@university.edu"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Primary Department *</label>
                  <select
                    value={applicantDept}
                    onChange={(e) => setApplicantDept(e.target.value as Department)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  >
                    {departments.filter(d => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Technical Skills & Tooling *</label>
                  <textarea
                    required
                    rows={3}
                    value={applicantSkills}
                    onChange={(e) => setApplicantSkills(e.target.value)}
                    placeholder="e.g. KiCad, ARM Assembly, C++, FreeRTOS, PyTorch, PCB Soldering..."
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--accent-color)] text-black font-bold uppercase tracking-wider hover:opacity-90 transition-opacity rounded-sm flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT APPLICATION</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
