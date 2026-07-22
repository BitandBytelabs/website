import React from 'react';
import { Radio, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] text-[var(--text-muted)] text-[11px] font-mono pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* BRAND COLUMN */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] rounded-sm">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-lg text-[var(--text-primary)] tracking-wider">
                BIT <span className="text-[var(--accent-color)]">//</span> VOLT
              </span>
            </div>
            <p className="text-[var(--accent-color)] text-xs font-mono font-semibold tracking-widest uppercase">
              Bits. Signals. Systems.
            </p>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-md font-sans">
              An independent engineering collective building at the intersection of electronics, communication systems, embedded systems, firmware, and software.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[11px] font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/projects')}
                  className="hover:text-[var(--accent-color)] transition-colors text-left"
                >
                  &gt; Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/team')}
                  className="hover:text-[var(--accent-color)] transition-colors text-left"
                >
                  &gt; Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/research')}
                  className="hover:text-[var(--accent-color)] transition-colors text-left"
                >
                  &gt; Research
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[var(--accent-color)] transition-colors text-left"
                >
                  &gt; About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[var(--accent-color)] transition-colors text-left"
                >
                  &gt; Contact
                </button>
              </li>
            </ul>
          </div>

          {/* CONNECT */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[var(--text-primary)] font-bold uppercase tracking-widest text-[11px] font-mono">
              Connect
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-color)] transition-colors flex items-center space-x-1.5"
                >
                  <Github className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-color)] transition-colors flex items-center space-x-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@bitandvolt.org"
                  className="hover:text-[var(--accent-color)] transition-colors flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)] font-mono">
          <div>
            &copy; {new Date().getFullYear()} BIT // VOLT
          </div>
          <div className="text-[var(--text-muted)] italic">
            Built by engineers. Documented by design.
          </div>
        </div>
      </div>
    </footer>
  );
};
