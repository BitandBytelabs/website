import React, { useEffect, useState } from 'react';
import { SignalCanvas } from '../components/common/SignalCanvas';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ApiService } from '../services/api';
import { Project, ResearchEntry, SystemStats } from '../types';
import { ArrowRight, Cpu, Radio, Zap, Shield, Terminal, BookOpen, Layers, CheckCircle2, User, Activity } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [researchArticles, setResearchArticles] = useState<ResearchEntry[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, resRes, statRes] = await Promise.all([
          ApiService.getProjects(),
          ApiService.getResearch(),
          ApiService.getStats(),
        ]);
        setFeaturedProjects(projRes.filter(p => p.featured || p.projectNumber === '001'));
        setResearchArticles(resRes.slice(0, 2));
        setStats(statRes);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* HERO TEXT */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[#00FF41] font-mono text-xs sm:text-sm font-bold">[ EST. 2024 ]</span>
                <div className="h-px flex-1 bg-[#1A1A1A]"></div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-white uppercase font-sans">
                  Engineering<br/>The Future of<br/>
                  <span className="text-transparent text-stroke-green" style={{ WebkitTextStroke: '1px #00FF41' }}>Connectivity.</span>
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#00FF41] tracking-widest uppercase pt-1">
                  // BITS. SIGNALS. SYSTEMS.
                </p>
              </div>

              <p className="text-[#A0A0A0] text-sm sm:text-base font-sans leading-relaxed max-w-xl">
                An independent engineering collective building at the intersection of electronics, communication, embedded systems, and software.
              </p>

              {/* CTAS */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/projects')}
                  className="px-8 py-3 bg-[#00FF41] text-black font-bold uppercase text-xs tracking-widest hover:bg-[#00D436] transition-all flex items-center space-x-2 shadow-lg shadow-[#00FF41]/10 group"
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/team')}
                  className="px-8 py-3 border border-[#333] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#1A1A1A] hover:border-[#00FF41]/50 transition-all flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-[#00FF41]" />
                  <span>MEET THE TEAM</span>
                </button>
              </div>

              {/* METRICS GRID */}
              <div className="mt-8 pt-6 grid grid-cols-3 gap-8 border-t border-[#1A1A1A]">
                <div className="flex flex-col">
                  <span className="text-[#00FF41] font-mono text-2xl font-bold mb-1">03</span>
                  <span className="text-[10px] uppercase text-[#666] tracking-tighter font-mono">Founding Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-mono text-2xl font-bold mb-1">01</span>
                  <span className="text-[10px] uppercase text-[#666] tracking-tighter font-mono">Active Project</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-mono text-2xl font-bold mb-1">0.0</span>
                  <span className="text-[10px] uppercase text-[#666] tracking-tighter font-mono">OpEx Budget (USD)</span>
                </div>
              </div>
            </div>

            {/* HERO SIGNAL OSCILLOSCOPE CANVAS */}
            <div className="lg:col-span-6">
              <SignalCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* CORE ENGINEERING PHILOSOPHY STATEMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-8 sm:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="text-xs font-mono text-[#00FF41] tracking-widest uppercase">
            // OPERATIONAL MANIFESTO
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white max-w-3xl mx-auto leading-tight uppercase">
            "We don't just build projects. We design, experiment, test, document, and engineer systems."
          </h2>
          <p className="text-[#888] text-xs sm:text-sm font-sans max-w-2xl mx-auto leading-relaxed">
            Every system built by BIT & VOLT undergoes full hardware-software co-design, schematic verification, low-noise signal profiling, firmware abstraction, and comprehensive technical documentation.
          </p>
        </div>
      </section>

      {/* FEATURED PROJECT SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A] pb-4">
          <div>
            <div className="text-xs font-mono text-[#00FF41] uppercase tracking-widest flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5" />
              <span>FLAGSHIP ENGINEERING SYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1 uppercase">
              Project 001: AM Walkie-Talkie
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/projects/am-walkie-talkie')}
            className="text-xs font-mono text-[#00FF41] hover:underline font-bold flex items-center space-x-1 uppercase tracking-wider"
          >
            <span>VIEW FULL TECHNICAL SPECIFICATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FEATURED PROJECT DISPLAY */}
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelect={(slug) => onNavigate(`/projects/${slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0D0D0D] p-8 border border-[#1A1A1A] text-center text-[#888] font-mono text-sm">
            Loading featured engineering systems...
          </div>
        )}
      </section>

      {/* DISCIPLINARY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#1A1A1A] pb-4">
          <div className="text-xs font-mono text-[#00FF41] uppercase tracking-widest">
            // TECHNICAL DISCIPLINE MATRIX
          </div>
          <h2 className="text-2xl font-bold font-mono text-white mt-1 uppercase">
            Core Engineering Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 hover:border-[#00FF41]/50 transition-colors">
            <div className="w-10 h-10 bg-[#111111] border border-[#222222] flex items-center justify-center text-[#00FF41]">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-tight">Electronics & RF</h3>
            <p className="text-xs text-[#888] leading-relaxed font-sans">
              Discrete analog circuitry, crystal oscillators, impedance matching, modulation filters, and custom FR4 PCB design.
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 hover:border-[#FFB800]/50 transition-colors">
            <div className="w-10 h-10 bg-[#111111] border border-[#222222] flex items-center justify-center text-[#FFB800]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-tight">Embedded Systems</h3>
            <p className="text-xs text-[#888] leading-relaxed font-sans">
              ARM Cortex-M firmware, FreeRTOS deterministic kernels, low-level bus protocols (SPI/I2C/UART/CAN), and DMA control.
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 hover:border-sky-500/50 transition-colors">
            <div className="w-10 h-10 bg-[#111111] border border-[#222222] flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-tight">Robotics & IoT</h3>
            <p className="text-xs text-[#888] leading-relaxed font-sans">
              Autonomous quadrotor drones, LoRaWAN mesh sensor nodes, energy harvesting, and PID flight stabilization.
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 hover:border-purple-500/50 transition-colors">
            <div className="w-10 h-10 bg-[#111111] border border-[#222222] flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-tight">Software & AI</h3>
            <p className="text-xs text-[#888] leading-relaxed font-sans">
              Full-stack telemetry web apps, edge neural computer vision, REST API services, and cyber-physical security.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT RESEARCH PREVIEW */}
      {researchArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
            <div>
              <div className="text-xs font-mono text-[#00FF41] uppercase tracking-widest">
                // LABORATORY INVESTIGATIONS
              </div>
              <h2 className="text-2xl font-bold font-mono text-white mt-1 uppercase">
                Recent Research & Experiment Notes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/research')}
              className="text-xs font-mono text-[#00FF41] hover:underline font-bold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>VIEW ALL RESEARCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchArticles.map((art) => (
              <div key={art.id} className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 flex flex-col justify-between hover:border-[#00FF41]/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                    <span className="px-2 py-0.5 bg-[#111] text-[#00FF41] border border-[#222]">
                      {art.category}
                    </span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-base font-bold font-mono text-white uppercase">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#888] leading-relaxed font-sans">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#666]">Author: {art.author}</span>
                  <button
                    onClick={() => onNavigate('/research')}
                    className="text-[#00FF41] hover:underline font-bold uppercase text-[11px]"
                  >
                    Read Paper &gt;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
