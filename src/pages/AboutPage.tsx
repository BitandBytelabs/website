import React from 'react';
import { Radio, Cpu, Shield, Server, Database, Cloud, Terminal, CheckCircle2, Zap, RadioTower } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* HEADER */}
      <div className="border-b border-[#1A1A1A] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00FF41] uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5" />
          <span>INDEPENDENT R&D ORGANIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight uppercase">
          About BIT & VOLT
        </h1>
        <p className="text-[#888] text-sm font-sans max-w-2xl leading-relaxed">
          An engineering organization devoted to physical layer communications, discrete RF electronics, real-time embedded firmware, and software co-design.
        </p>
      </div>

      {/* MANIFESTO */}
      <section className="bg-[#0D0D0D] border border-[#1A1A1A] p-8 space-y-6 shadow-2xl">
        <div className="text-xs font-mono text-[#00FF41] tracking-widest uppercase">
          // OUR ENGINEERING PHILOSOPHY
        </div>
        <blockquote className="text-2xl sm:text-3xl font-bold font-mono text-white leading-snug uppercase">
          "We don't just build projects. We design, experiment, test, document, and engineer systems."
        </blockquote>
        <p className="text-[#AAA] text-sm font-sans leading-relaxed max-w-3xl">
          BIT & VOLT operates as an independent collective where Electronics and Communication Engineering (ECE) meets Computer Science and Engineering (CSE). Rather than treating projects as simple academic exercises, we approach every endeavor with the rigor of an industrial R&D laboratory.
        </p>
      </section>

      {/* LABORATORY CAPABILITIES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-mono text-white border-b border-[#1A1A1A] pb-3 flex items-center space-x-2 uppercase">
          <RadioTower className="w-5 h-5 text-[#00FF41]" />
          <span>Laboratory Equipment & Testing Capabilities</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-[#00FF41] uppercase">1. RF & Oscilloscope Instrumentation</h3>
            <ul className="space-y-2 text-[#AAA]">
              <li>• 100 MHz Dual-Channel Digital Oscilloscopes</li>
              <li>• Vector Network Analyzers (VNA 50 kHz - 900 MHz)</li>
              <li>• Spectrum Analyzers for AM/FM Carrier Modulation</li>
              <li>• Arbitrary Function Signal Generators</li>
            </ul>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-[#FFB800] uppercase">2. Embedded Firmware Debugging</h3>
            <ul className="space-y-2 text-[#AAA]">
              <li>• 16-Channel 100 MSPS Logic Analyzers</li>
              <li>• ST-Link v2 / J-Link JTAG & SWD Debuggers</li>
              <li>• FreeRTOS Real-Time Kernel Profilers</li>
              <li>• Bus Pirate I2C/SPI Protocol Sniffers</li>
            </ul>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-sky-400 uppercase">3. Prototyping & PCB Fabrication</h3>
            <ul className="space-y-2 text-[#AAA]">
              <li>• KiCad / Altium Designer EDA Workstations</li>
              <li>• Temperature-Controlled ESD Soldering Stations</li>
              <li>• Double-Sided FR4 Copper PCB Etching Rig</li>
              <li>• Precision 3D Enclosure Printers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* $0-BUDGET ARCHITECTURE EXPLANATION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-mono text-white border-b border-[#1A1A1A] pb-3 flex items-center space-x-2 uppercase">
          <Server className="w-5 h-5 text-purple-400" />
          <span>$0-Budget Production Infrastructure Architecture</span>
        </h2>

        <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 sm:p-8 space-y-6 shadow-xl">
          <p className="text-xs sm:text-sm text-[#AAA] font-sans leading-relaxed">
            The BIT & VOLT platform is architected to operate completely within free tier infrastructure quotas, delivering high uptime and performance without ongoing server hosting costs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
            <div className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2">
              <div className="text-[#00FF41] font-bold flex items-center space-x-1 uppercase">
                <Server className="w-4 h-4" />
                <span>Render Free</span>
              </div>
              <p className="text-[11px] text-[#888]">Node.js REST service & Vite SPA static host.</p>
            </div>

            <div className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2">
              <div className="text-[#FFB800] font-bold flex items-center space-x-1 uppercase">
                <Database className="w-4 h-4" />
                <span>MongoDB M0</span>
              </div>
              <p className="text-[11px] text-[#888]">Cloud database for projects, team, research data.</p>
            </div>

            <div className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2">
              <div className="text-sky-400 font-bold flex items-center space-x-1 uppercase">
                <Cloud className="w-4 h-4" />
                <span>Cloudinary</span>
              </div>
              <p className="text-[11px] text-[#888]">Media storage for high-res schematics & PCB renders.</p>
            </div>

            <div className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2">
              <div className="text-purple-400 font-bold flex items-center space-x-1 uppercase">
                <Shield className="w-4 h-4" />
                <span>UptimeRobot</span>
              </div>
              <p className="text-[11px] text-[#888]">5-min keep-alive ping preventing container sleep.</p>
            </div>

            <div className="bg-[#0A0A0A] p-4 border border-[#222] space-y-2">
              <div className="text-[#00FF41] font-bold flex items-center space-x-1 uppercase">
                <Terminal className="w-4 h-4" />
                <span>GitHub Repo</span>
              </div>
              <p className="text-[11px] text-[#888]">Source code version control and CI/CD pipeline.</p>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => onNavigate('/docs')}
              className="px-4 py-2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/40 text-xs font-mono font-bold hover:bg-[#00FF41]/20 uppercase"
            >
              READ FULL DEPLOYMENT SETUP GUIDE &gt;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
