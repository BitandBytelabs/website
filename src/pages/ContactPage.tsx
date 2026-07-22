import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Radio, MessageSquare, Building2, Terminal } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Project Collaboration');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* HEADER */}
      <div className="border-b border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5" />
          <span>TECHNICAL INQUIRIES & COLLABORATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
          Contact BIT & VOLT
        </h1>
        <p className="text-[#888] text-sm font-sans leading-relaxed">
          Reach out for technical discussions, hardware design collaborations, research inquiries, or team partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CONTACT METADATA */}
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-2">
            <span className="text-[#666] uppercase font-bold block">LABORATORY EMAIL</span>
            <a href="mailto:contact@bitandvolt.org" className="text-[#00FF41] font-bold hover:underline">
              contact@bitandvolt.org
            </a>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-2">
            <span className="text-[#666] uppercase font-bold block">PRIMARY DISCIPLINE</span>
            <span className="text-[#E0E0E0]">Electronics, Communication & Computer Science</span>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-4 space-y-2">
            <span className="text-[#666] uppercase font-bold block">RESPONSE TIME</span>
            <span className="text-[#AAA]">Within 24-48 Hours</span>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="md:col-span-2 bg-[#0D0D0D] border border-[#1A1A1A] p-6 sm:p-8 space-y-6 shadow-2xl">
          {submitted ? (
            <div className="p-8 bg-[#00FF41]/10 border border-[#00FF41]/40 text-center space-y-3 font-mono text-[#00FF41]">
              <CheckCircle2 className="w-10 h-10 text-[#00FF41] mx-auto" />
              <h3 className="text-lg font-bold uppercase">Message Transmitted Successfully</h3>
              <p className="text-xs text-[#E0E0E0] font-sans">
                Thank you for reaching out. The BIT & VOLT engineering team will review your inquiry.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-4 py-2 text-xs bg-[#00FF41] text-black font-bold uppercase"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888] mb-1 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <label className="block text-[#888] mb-1 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@lab.org"
                    className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888] mb-1 uppercase">Inquiry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                >
                  <option value="Project Collaboration">Project Collaboration</option>
                  <option value="RF / Electronics Consultation">RF / Electronics Consultation</option>
                  <option value="Research & Paper Inquiries">Research & Paper Inquiries</option>
                  <option value="Sponsorship / Equipment Donation">Sponsorship / Equipment Donation</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[#888] mb-1 uppercase">Message Details *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, technical question, or collaboration proposal..."
                  className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41] font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] transition-colors flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>TRANSMIT MESSAGE</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
