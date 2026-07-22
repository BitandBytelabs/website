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
      <div className="border-b border-[var(--border-color)] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>TECHNICAL INQUIRIES & COLLABORATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
          Contact BIT // VOLT
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-sans leading-relaxed">
          Reach out for technical discussions, hardware design collaborations, research inquiries, or team partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CONTACT METADATA */}
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-2 rounded-sm shadow-md">
            <span className="text-[var(--text-muted)] uppercase font-bold block">LABORATORY EMAIL</span>
            <a href="mailto:contact@bitandvolt.org" className="text-[var(--accent-color)] font-bold hover:underline">
              contact@bitandvolt.org
            </a>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-2 rounded-sm shadow-md">
            <span className="text-[var(--text-muted)] uppercase font-bold block">PRIMARY DISCIPLINE</span>
            <span className="text-[var(--text-primary)]">Electronics, Communication & Computer Science</span>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 space-y-2 rounded-sm shadow-md">
            <span className="text-[var(--text-muted)] uppercase font-bold block">RESPONSE TIME</span>
            <span className="text-[var(--text-secondary)]">Within 24-48 Hours</span>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-xl rounded-sm">
          {submitted ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3 font-mono text-emerald-400 rounded-sm">
              <CheckCircle2 className="w-10 h-10 text-[var(--accent-color)] mx-auto" />
              <h3 className="text-lg font-bold uppercase">Message Transmitted Successfully</h3>
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                Thank you for reaching out. The BIT // VOLT engineering team will review your inquiry.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-4 py-2 text-xs bg-[var(--accent-color)] text-black font-bold uppercase rounded-sm"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@lab.org"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Inquiry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                >
                  <option value="Project Collaboration">Project Collaboration</option>
                  <option value="Research & Papers">Research & Papers</option>
                  <option value="Sponsorship & Hardware">Sponsorship & Hardware Grants</option>
                  <option value="General Technical Question">General Technical Question</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 uppercase font-bold">Message Details *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your project, question, or collaboration opportunity..."
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] rounded-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[var(--accent-color)] text-black font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 rounded-sm"
              >
                <Send className="w-4 h-4" />
                <span>TRANSMIT INQUIRY</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
