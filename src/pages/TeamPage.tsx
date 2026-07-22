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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1A1A1A] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5" />
            <span>ENGINEERING ROSTER & COLLECTIVE LEADERSHIP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
            BIT & VOLT Engineering Team
          </h1>
          <p className="text-[#888] text-sm font-sans max-w-2xl leading-relaxed">
            Founded by 3 ECE & CSE engineers, BIT & VOLT is an independent collective designed for multi-disciplinary hardware-software research and systems development.
          </p>
        </div>

        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-5 py-2.5 bg-[#00FF41] text-black font-mono font-bold text-xs hover:bg-[#00e038] transition-all shadow-lg shrink-0 flex items-center space-x-2 uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4" />
          <span>JOIN THE COLLECTIVE</span>
        </button>
      </div>

      {/* DEPARTMENT FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0D0D0D] p-3 border border-[#1A1A1A] font-mono text-xs">
        <span className="text-[#666] px-2 uppercase">DEPARTMENT:</span>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 transition-colors uppercase font-bold ${
              selectedDept === dept
                ? 'bg-[#00FF41] text-black border border-[#00FF41]'
                : 'text-[#888] hover:text-white bg-[#0A0A0A] border border-[#222]'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* ACTIVE TEAM MEMBERS */}
      <div className="space-y-6">
        <div className="text-sm font-mono font-bold text-white border-l-2 border-[#00FF41] pl-3 uppercase tracking-wider">
          Active Engineering Roster ({activeMembers.length})
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#888] font-mono text-sm">
            Loading team roster...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#00FF41]/50 transition-all flex flex-col justify-between p-6 space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  {/* HEADER: PHOTO & BADGES */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="w-16 h-16 object-cover border border-[#2A2A2A] shadow-md shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold font-mono text-white uppercase">{member.name}</h3>
                        {member.isFounder && (
                          <span className="px-1.5 py-0.5 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 font-mono text-[10px] font-bold">
                            FOUNDER
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-[#00FF41] font-semibold uppercase">{member.role}</p>
                      <span className="inline-block px-2 py-0.5 bg-[#0A0A0A] text-[#888] border border-[#222] text-[10px] font-mono uppercase">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  {/* BIO */}
                  <p className="text-xs text-[#AAA] font-sans leading-relaxed">
                    {member.detailedBio}
                  </p>

                  {/* SKILLS & TECHNOLOGIES */}
                  <div className="space-y-2 pt-2 border-t border-[#1A1A1A] font-mono text-xs">
                    <span className="text-[10px] text-[#666] block uppercase font-bold">Core Technical Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] bg-[#141414] text-[#A0A0A0] border border-[#222]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FOOTER: SOCIAL LINKS & PROJECT COUNTS */}
                <div className="pt-4 border-t border-[#1A1A1A] flex items-center justify-between font-mono text-xs text-[#888]">
                  <div className="flex items-center space-x-3">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF41] transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF41] transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="hover:text-[#00FF41] transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] text-[#666]">
                    {member.projectCount} Projects Contributed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALUMNI SECTION */}
      {alumniMembers.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#1A1A1A]">
          <div className="text-sm font-mono font-bold text-[#888] border-l-2 border-[#444] pl-3 uppercase">
            Alumni & Former Contributors ({alumniMembers.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumniMembers.map((member) => (
              <div key={member.id} className="bg-[#0D0D0D] p-4 border border-[#1A1A1A] flex items-center space-x-3">
                <img src={member.profileImage} alt={member.name} className="w-10 h-10 object-cover border border-[#222]" />
                <div className="font-mono text-xs">
                  <div className="font-bold text-white uppercase">{member.name}</div>
                  <div className="text-[#666]">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOIN COLLECTIVE MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] max-w-lg w-full p-6 space-y-6 shadow-2xl relative font-mono">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 text-[#888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white uppercase">Join BIT & VOLT Collective</h2>
              <p className="text-xs text-[#888] font-sans">
                We welcome passionate engineers in Electronics, Embedded Firmware, AI, and Software.
              </p>
            </div>

            {applySubmitted ? (
              <div className="p-6 bg-[#00FF41]/10 border border-[#00FF41]/40 text-center space-y-2 text-[#00FF41]">
                <ShieldCheck className="w-8 h-8 text-[#00FF41] mx-auto" />
                <p className="font-bold text-sm uppercase">Application Received!</p>
                <p className="text-xs text-[#E0E0E0] font-sans">
                  The BIT & VOLT founding team will review your portfolio and reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#888] mb-1 uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Vikram Sethi"
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <label className="block text-[#888] mb-1 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="vikram@engineering.edu"
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <label className="block text-[#888] mb-1 uppercase">Primary Department *</label>
                  <select
                    value={applicantDept}
                    onChange={(e) => setApplicantDept(e.target.value as Department)}
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  >
                    <option value="Electronics">Electronics & RF</option>
                    <option value="Embedded Systems">Embedded Systems & Firmware</option>
                    <option value="Software">Software & Systems</option>
                    <option value="AI/ML">AI / Computer Vision</option>
                    <option value="Robotics">Robotics & Drones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888] mb-1 uppercase">Key Technical Skills & Hardware Experience</label>
                  <textarea
                    rows={3}
                    value={applicantSkills}
                    onChange={(e) => setApplicantSkills(e.target.value)}
                    placeholder="e.g. KiCad PCB layout, STM32 C++, FreeRTOS, LTspice simulation..."
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41] font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#888] mb-1 uppercase">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://github.com/my-projects"
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] transition-colors flex items-center justify-center space-x-2 uppercase tracking-wider"
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
