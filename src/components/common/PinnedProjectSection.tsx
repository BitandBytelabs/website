import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Radio, Cpu, Zap, Activity, ArrowRight, ShieldCheck, CheckCircle2, FileText, Layers } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PinnedProjectSectionProps {
  onNavigate: (path: string) => void;
}

export const PinnedProjectSection: React.FC<PinnedProjectSectionProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      tag: 'SYSTEM OVERVIEW',
      title: 'Project 001: AM Walkie-Talkie',
      subtitle: 'Full-duplex analog RF transceiver operating at 27.145 MHz',
      description: 'Built entirely from ground zero using discrete RF components, crystal-stabilized local oscillators, double-tuned bandpass filters, and LM386 audio power stages. Designed for reliable line-of-sight voice communications with ultra-low power consumption.',
      highlights: [
        'Frequency: 27.145 MHz (CB Band Channel 14)',
        'Modulation: Amplitude Modulation (AM 100% Index)',
        'Output Power: 250mW RF Carrier',
        'Range: 1.5 - 2.8 Kilometers Line-of-Sight'
      ],
      badge: 'PROTOTYPE V2.1',
      badgeColor: 'border-[var(--accent-color)] text-[var(--accent-color)]'
    },
    {
      step: '02',
      tag: 'SYSTEM ARCHITECTURE',
      title: 'Transceiver Block Topology',
      subtitle: 'Superheterodyne receiver paired with Class-C RF power amplifier',
      description: 'The architecture employs a single-conversion superheterodyne receiver front-end with a 455 kHz IF stage, crystal lattice filter, and envelope detector. The transmitter driver uses a 2N2222 oscillator and BD139 RF PA stage.',
      highlights: [
        'IF Frequency: 455 kHz ceramic filter bandpass',
        'Receiver Sensitivity: -95 dBm @ 10dB SINAD',
        'Selectivity: -30 dB at ±10 kHz offset',
        'Antenna Matching: Pi-network 50-ohm LC match'
      ],
      badge: 'SCHEMATIC VERIFIED',
      badgeColor: 'border-sky-500 text-sky-400'
    },
    {
      step: '03',
      tag: 'HARDWARE & PCB',
      title: 'Custom FR4 PCB & Low-Noise Layout',
      subtitle: 'Double-sided copper pours with dedicated RF ground planes',
      description: 'Layout engineered in KiCad with microstrip impedance matching, isolated RF choke inductors, shielded RF cans, and discrete thermal vias to minimize inter-stage crosstalk and stray capacitance.',
      highlights: [
        'FR4 Double-Sided 1.6mm substrate',
        'Isolated Tx/Rx Ground Pours',
        'Dedicated LC Tank Shielding',
        'On-board Electret Mic Preamp'
      ],
      badge: 'HARDWARE FABRICATED',
      badgeColor: 'border-amber-500 text-amber-400'
    },
    {
      step: '04',
      tag: 'SIGNAL TESTING & PROFILING',
      title: 'Oscilloscope Waveform Validation',
      subtitle: 'Spectrum analysis and low-distortion modulation envelope',
      description: 'Verified carrier frequency stability under thermal sweep (-10°C to +50°C), measured harmonic suppression (> -42 dBc on 2nd harmonic), and tuned receiver S-meter AGC loop for crystal clear voice demodulation.',
      highlights: [
        'Carrier Stability: ±150 Hz drift over sweep',
        'Harmonic Rejection: -42 dBc 2nd / -48 dBc 3rd',
        'Audio THD: < 3.2% at 1 kHz sine modulation',
        'Battery Draw: 18 mA Rx / 140 mA Tx @ 9V'
      ],
      badge: 'TESTING COMPLETED',
      badgeColor: 'border-emerald-500 text-emerald-400'
    },
    {
      step: '05',
      tag: 'FIELD PERFORMANCE & SPECS',
      title: 'Operational Field Results',
      subtitle: 'Field tested across urban noise and open terrain environments',
      description: 'Documented field tests confirmed intelligible voice communication up to 2.4 km in suburban terrain with telescoping whip antenna. Full schematics, bill of materials, and Gerber files published under open hardware license.',
      highlights: [
        'Urban Distance: 850m through concrete structures',
        'Open Field Range: 2,400m clear line-of-sight',
        'Operating Voltage: 7.2V - 12V DC input',
        'Enclosure: 3D-printed PETG rugged chassis'
      ],
      badge: 'SPECIFICATION FINAL',
      badgeColor: 'border-purple-500 text-purple-400'
    }
  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const totalSteps = steps.length;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalSteps * 800}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
          setActiveStep(idx);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[var(--bg-surface)] border-y border-[var(--border-color)] overflow-hidden transition-colors py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[var(--border-color)] pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>PINNED CASE STUDY // ENGINEERING IN MOTION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] mt-1 uppercase tracking-tight">
              Flagship System Architecture
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/projects/am-walkie-talkie')}
            className="px-5 py-2.5 bg-[var(--accent-color)] text-black font-bold font-mono text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center space-x-2 rounded-sm self-start sm:self-auto"
          >
            <span>Explore Full Specification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR BAR */}
        <div className="hidden md:flex items-center justify-between gap-2 mb-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-sm font-mono text-xs">
          {steps.map((st, i) => (
            <button
              key={st.step}
              onClick={() => setActiveStep(i)}
              className={`flex-1 py-2 px-3 text-center transition-all flex items-center justify-center space-x-2 rounded-sm ${
                activeStep === i
                  ? 'bg-[var(--accent-color)] text-black font-bold shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="font-mono text-[10px] opacity-80">[{st.step}]</span>
              <span className="truncate text-[11px] uppercase font-semibold">{st.tag}</span>
            </button>
          ))}
        </div>

        {/* MAIN CASE STUDY DISPLAY CONTENT */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-10 rounded-sm relative overflow-hidden shadow-2xl">
          {/* BACKGROUND SIGNAL GRID ACCENT */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Radio className="w-96 h-96 text-[var(--accent-color)]" />
          </div>

          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase font-bold border rounded-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-color)]">
                {steps[activeStep].tag}
              </span>
              <span className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold border rounded-sm ${steps[activeStep].badgeColor}`}>
                {steps[activeStep].badge}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">
                {steps[activeStep].title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[var(--accent-color)] mt-1 font-medium">
                // {steps[activeStep].subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              {steps[activeStep].description}
            </p>

            {/* HIGHLIGHTED TECHNICAL METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {steps[activeStep].highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-2 bg-[var(--bg-surface)] border border-[var(--border-color)] p-3 rounded-sm">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-color)] mt-0.5 shrink-0" />
                  <span className="text-xs font-mono text-[var(--text-primary)] font-medium leading-tight">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT VISUAL/DIAGRAM CARD */}
          <div className="lg:col-span-5 relative z-10">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 font-mono text-xs text-[var(--text-muted)]">
                <span className="text-[var(--accent-color)] font-bold">// SYSTEM SPECIFICATION NO. 001</span>
                <span>STEP {steps[activeStep].step} / 05</span>
              </div>

              {/* SIMULATED OSCILLOSCOPE WAVEFORM GRAPH */}
              <div className="h-44 bg-[#050505] border border-[#1A1A1A] rounded relative flex items-center justify-center overflow-hidden">
                {/* OSCILLOSCOPE GRID LINES */}
                <div className="absolute inset-0 bg-dot-grid opacity-30" />
                <svg className="w-full h-32 text-[var(--accent-color)] stroke-current fill-none" viewBox="0 0 400 100">
                  <path
                    d={`M 0 50 Q 50 ${activeStep % 2 === 0 ? '10' : '90'}, 100 50 T 200 50 T 300 50 T 400 50`}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                  <path
                    d={`M 0 50 Q 50 ${activeStep % 2 === 0 ? '80' : '20'}, 100 50 T 200 50 T 300 50 T 400 50`}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.6"
                  />
                </svg>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono text-[var(--accent-color)] bg-black/80 px-2 py-0.5 rounded border border-[var(--accent-color)]/30">
                  CH1: 27.145 MHz Carrier (100mV/div)
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Modulation Mode:</span>
                  <span className="text-[var(--text-primary)] font-bold">AM (A3E)</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Hardware Status:</span>
                  <span className="text-[var(--accent-color)] font-bold">VERIFIED & FUNCTIONAL</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Lead Engineers:</span>
                  <span className="text-[var(--text-primary)]">BIT // VOLT Collective</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE STEP SWITCHER FOR ACCESSIBILITY */}
        <div className="flex md:hidden items-center justify-between mt-6 gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-primary)] uppercase font-bold rounded-sm"
          >
            &lt; Previous
          </button>
          <span className="text-[var(--text-muted)] font-bold">
            Step {activeStep + 1} of {steps.length}
          </span>
          <button
            onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-40 text-[var(--text-primary)] uppercase font-bold rounded-sm"
          >
            Next &gt;
          </button>
        </div>

      </div>
    </section>
  );
};
