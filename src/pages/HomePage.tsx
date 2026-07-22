import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SignalCanvas } from '../components/common/SignalCanvas';
import { PinnedProjectSection } from '../components/common/PinnedProjectSection';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ApiService } from '../services/api';
import { Project, ResearchEntry, SystemStats } from '../types';
import { ArrowRight, Cpu, Radio, Zap, Shield, Terminal, User, Activity, Sparkles, Layers } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [researchArticles, setResearchArticles] = useState<ResearchEntry[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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

    // GSAP HERO ENTRANCE ANIMATION
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4')
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-8 sm:pt-16 pb-12 overflow-hidden border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* HERO TEXT */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[var(--accent-color)] font-mono text-xs sm:text-sm font-bold">[ EST. 2024 ]</span>
                <div className="h-px flex-1 bg-[var(--border-color)]"></div>
              </div>

              <div className="space-y-3">
                <h1 ref={titleRef} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-[var(--text-primary)] uppercase font-sans">
                  BIT <span className="text-[var(--accent-color)]">//</span> VOLT<br />
                  <span className="text-transparent text-stroke-green" style={{ WebkitTextStroke: '1px var(--accent-color)' }}>
                    COLLECTIVE.
                  </span>
                </h1>
                <p ref={taglineRef} className="text-xs sm:text-sm font-mono text-[var(--accent-color)] tracking-widest uppercase pt-1 font-bold">
                  // BITS. SIGNALS. SYSTEMS.
                </p>
              </div>

              <p className="text-[var(--text-secondary)] text-sm sm:text-base font-sans leading-relaxed max-w-xl">
                An independent engineering collective building at the intersection of electronics, communication systems, embedded firmware, and software architectures.
              </p>

              {/* CTAS */}
              <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/projects')}
                  className="px-8 py-3 bg-[var(--accent-color)] text-black font-bold font-mono uppercase text-xs tracking-widest hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-[var(--accent-glow)] rounded-sm group"
                >
                  <span>EXPLORE PROJECTS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('/team')}
                  className="px-8 py-3 border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-card)] font-bold font-mono uppercase text-xs tracking-widest hover:border-[var(--accent-color)] transition-all flex items-center space-x-2 rounded-sm"
                >
                  <User className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>MEET THE TEAM</span>
                </button>
              </div>

              {/* METRICS GRID */}
              <div className="mt-8 pt-6 grid grid-cols-3 gap-6 border-t border-[var(--border-color)] font-mono">
                <div className="flex flex-col">
                  <span className="text-[var(--accent-color)] text-2xl font-bold mb-1">
                    {stats ? String(stats.activeTeamMembers).padStart(2, '0') : '03'}
                  </span>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-tight">Active Engineers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-2xl font-bold mb-1">
                    {stats ? String(stats.publishedProjects).padStart(2, '0') : '01'}
                  </span>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-tight">Published Systems</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-primary)] text-2xl font-bold mb-1">
                    {stats ? String(stats.totalResearchArticles).padStart(2, '0') : '02'}
                  </span>
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-tight">Research Papers</span>
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

      {/* CORE OPERATIONAL MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 sm:p-12 text-center space-y-4 shadow-xl relative overflow-hidden rounded-sm">
          <div className="text-xs font-mono text-[var(--accent-color)] tracking-widest uppercase font-bold">
            // OPERATIONAL MANIFESTO
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-mono text-[var(--text-primary)] max-w-3xl mx-auto leading-tight uppercase tracking-tight">
            "We don't just build projects. We design, experiment, test, document, and engineer systems."
          </h2>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm font-sans max-w-2xl mx-auto leading-relaxed">
            Every system built by BIT // VOLT undergoes full hardware-software co-design, schematic verification, low-noise signal profiling, firmware abstraction, and comprehensive technical documentation.
          </p>
        </div>
      </section>

      {/* PINNED PROJECT SECTION (GSAP SCROLLTRIGGER PINNING) */}
      <PinnedProjectSection onNavigate={onNavigate} />

      {/* FEATURED PROJECTS REPOSITORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div>
            <div className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5" />
              <span>FEATURED SYSTEMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] mt-1 uppercase">
              Selected Engineering Projects
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/projects')}
            className="text-xs font-mono text-[var(--accent-color)] hover:underline font-bold flex items-center space-x-1 uppercase tracking-wider"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FEATURED PROJECT DISPLAY */}
        {loading ? (
          <div className="bg-[var(--bg-card)] p-8 border border-[var(--border-color)] text-center text-[var(--text-muted)] font-mono text-sm">
            Loading featured engineering systems...
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelect={(slug) => onNavigate(`/projects/${slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] p-8 border border-[var(--border-color)] text-center text-[var(--text-muted)] font-mono text-sm">
            No published projects available at this time.
          </div>
        )}
      </section>

      {/* DISCIPLINARY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[var(--border-color)] pb-4">
          <div className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
            // TECHNICAL DISCIPLINE MATRIX
          </div>
          <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 uppercase">
            Core Engineering Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 hover:border-[var(--accent-color)] transition-colors rounded-sm shadow-md">
            <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] rounded-sm">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">Electronics & RF</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              Discrete analog circuitry, crystal oscillators, impedance matching, modulation filters, and custom FR4 PCB design.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 hover:border-amber-500 transition-colors rounded-sm shadow-md">
            <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-amber-500 rounded-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">Embedded Systems</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              ARM Cortex-M firmware, FreeRTOS deterministic kernels, low-level bus protocols (SPI/I2C/UART/CAN), and DMA control.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 hover:border-sky-500 transition-colors rounded-sm shadow-md">
            <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-sky-400 rounded-sm">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">Robotics & IoT</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              Autonomous quadrotor drones, LoRaWAN mesh sensor nodes, energy harvesting, and PID flight stabilization.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 hover:border-purple-500 transition-colors rounded-sm shadow-md">
            <div className="w-10 h-10 bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-purple-400 rounded-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">Software & AI</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              Full-stack telemetry web apps, edge neural computer vision, REST API services, and cyber-physical security.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT RESEARCH PREVIEW */}
      {researchArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div>
              <div className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
                // LABORATORY INVESTIGATIONS
              </div>
              <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-1 uppercase">
                Recent Research & Experiment Notes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/research')}
              className="text-xs font-mono text-[var(--accent-color)] hover:underline font-bold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>VIEW ALL RESEARCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchArticles.map((art) => (
              <div key={art.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 flex flex-col justify-between hover:border-[var(--accent-color)] transition-colors rounded-sm shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span className="px-2 py-0.5 bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)] rounded-sm">
                      {art.category}
                    </span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-base font-bold font-mono text-[var(--text-primary)] uppercase">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                    {art.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">Author: {art.author}</span>
                  <button
                    onClick={() => onNavigate('/research')}
                    className="text-[var(--accent-color)] hover:underline font-bold uppercase text-[11px]"
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
