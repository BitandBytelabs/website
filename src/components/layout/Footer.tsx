import React from 'react';
import { Radio, Terminal, Server, ShieldCheck, Database, Cloud, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F0F0F] border-t border-[#1A1A1A] text-[#888] text-[11px] font-mono pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND COLUMN */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#00FF41]">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-base text-white tracking-wider">
                BIT <span className="text-[#00FF41]">//</span> VOLT
              </span>
            </div>
            <p className="text-[#888] text-xs leading-relaxed font-sans">
              An independent engineering collective building at the intersection of electronics, communication systems, embedded firmware, and software.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-[#00FF41]">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              <span>[SYSTEM STATUS: OPERATIONAL]</span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-[11px] flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/projects')} className="hover:text-[#00FF41] transition-colors">
                  &gt; All Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/projects/am-walkie-talkie')} className="hover:text-[#00FF41] transition-colors text-[#FFB800]">
                  &gt; Project 001: AM Walkie-Talkie
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/team')} className="hover:text-[#00FF41] transition-colors">
                  &gt; Founding Team & Roster
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/research')} className="hover:text-[#00FF41] transition-colors">
                  &gt; Research & Experiments
                </button>
              </li>
            </ul>
          </div>

          {/* INFRASTRUCTURE STACK */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-[11px] flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>$0 Budget Stack</span>
            </h4>
            <ul className="space-y-2 text-[11px] text-[#888]">
              <li className="flex items-center space-x-1.5">
                <Database className="w-3 h-3 text-[#00FF41]" />
                <span>MongoDB Atlas M0 (Database)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Cloud className="w-3 h-3 text-sky-400" />
                <span>Cloudinary Free Tier (Media)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Server className="w-3 h-3 text-purple-400" />
                <span>Render Free Web Service (Node/Express)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3 h-3 text-[#FFB800]" />
                <span>UptimeRobot Keep-Alive Monitor</span>
              </li>
            </ul>
          </div>

          {/* PORTAL & GOVERNANCE */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-[11px] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF41]" />
              <span>Governance & Security</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-purple-400 transition-colors">
                  &gt; Admin CMS Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/docs')} className="hover:text-[#00FF41] transition-colors">
                  &gt; Deployment Setup Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#00FF41] transition-colors">
                  &gt; Technical Collaboration
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM METRICS & COPYRIGHT */}
        <div className="pt-6 border-t border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#555]">
          <div>
            &copy; {new Date().getFullYear()} BIT & VOLT ENGINEERING GROUP // BITS. SIGNALS. SYSTEMS.
          </div>
          <div className="flex gap-6 font-mono text-[#666]">
            <span>SYS_LOAD: 12.4%</span>
            <span>HOST: RENDER_FREE_TIER</span>
            <span className="text-[#00FF41]">DB: ATLAS_M0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
