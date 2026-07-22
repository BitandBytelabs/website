import React from 'react';
import { Radio, Cpu, Shield, Server, Database, Cloud, Terminal, CheckCircle2, Zap, RadioTower, Award, Layers } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* HEADER */}
      <div className="border-b border-[var(--border-color)] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[var(--accent-color)] uppercase tracking-widest font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>INDEPENDENT R&D ORGANIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight uppercase">
          About BIT // VOLT
        </h1>
        <p className="text-[var(--text-muted)] text-sm font-sans max-w-2xl leading-relaxed">
          An engineering organization devoted to physical layer communications, discrete RF electronics, real-time embedded firmware, and software co-design.
        </p>
      </div>

      {/* MANIFESTO */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 space-y-6 shadow-xl rounded-sm">
        <div className="text-xs font-mono text-[var(--accent-color)] tracking-widest uppercase font-bold">
          // OUR ENGINEERING PHILOSOPHY
        </div>
        <blockquote className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] leading-snug uppercase">
          "We don't just build projects. We design, experiment, test, document, and engineer systems."
        </blockquote>
        <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed max-w-3xl">
          BIT // VOLT operates as an independent collective where Electronics and Communication Engineering (ECE) meets Computer Science and Engineering (CSE). Rather than treating projects as simple academic exercises, we approach every endeavor with the rigor of an industrial R&D laboratory.
        </p>
      </section>

      {/* LABORATORY CAPABILITIES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center space-x-2 uppercase">
          <RadioTower className="w-5 h-5 text-[var(--accent-color)]" />
          <span>Laboratory Instrumentation & R&D Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 shadow-md rounded-sm">
            <h3 className="text-sm font-bold text-[var(--accent-color)] uppercase">1. RF & Oscilloscope Instrumentation</h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>• 100 MHz Dual-Channel Digital Oscilloscopes</li>
              <li>• Vector Network Analyzers (VNA 50 kHz - 900 MHz)</li>
              <li>• Spectrum Analyzers for AM/FM Carrier Modulation</li>
              <li>• Arbitrary Function Signal Generators</li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 shadow-md rounded-sm">
            <h3 className="text-sm font-bold text-amber-500 uppercase">2. Embedded Firmware Debugging</h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>• 16-Channel 100 MSPS Logic Analyzers</li>
              <li>• ST-Link v2 / J-Link JTAG & SWD Debuggers</li>
              <li>• FreeRTOS Real-Time Kernel Profilers</li>
              <li>• Bus Pirate I2C/SPI Protocol Sniffers</li>
            </ul>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 shadow-md rounded-sm">
            <h3 className="text-sm font-bold text-sky-400 uppercase">3. Prototyping & PCB Fabrication</h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>• KiCad / Altium Designer EDA Workstations</li>
              <li>• Temperature-Controlled ESD Soldering Stations</li>
              <li>• Double-Sided FR4 Copper PCB Etching Rig</li>
              <li>• Precision 3D Enclosure Printers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ENGINEERING DOMAINS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 flex items-center space-x-2 uppercase">
          <Layers className="w-5 h-5 text-purple-400" />
          <span>Multi-Disciplinary Research Focus</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 rounded-sm shadow-md">
            <h3 className="text-base font-bold text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Hardware & Analog Systems</span>
            </h3>
            <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
              Design of discrete RF transmitters, LC tank bandpass filters, impedance matching networks, class-C power amplifiers, and low-noise operational preamps.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-3 rounded-sm shadow-md">
            <h3 className="text-base font-bold text-[var(--text-primary)] uppercase flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Embedded Firmware & Software</span>
            </h3>
            <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
              Bare-metal C and FreeRTOS kernel programming, low-latency peripheral DMA transfers, signal processing algorithms, and telemetry web APIs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
