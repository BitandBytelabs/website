import React, { useState } from 'react';
import { Cpu, Radio, Zap, Volume2, Mic, Activity, Layers, Sliders } from 'lucide-react';

interface BlockInfo {
  id: string;
  name: string;
  sub: string;
  type: 'TX' | 'RX' | 'COMMON';
  components: string[];
  description: string;
  specs: string;
}

export const BlockDiagram: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<string>('osc');

  const blocks: Record<string, BlockInfo> = {
    mic: {
      id: 'mic',
      name: '1. Audio Preamplifier',
      sub: 'Speech Signal Conditioning',
      type: 'TX',
      components: ['Electret Condenser Mic', '2N3904 NPN Transistor', 'AC Coupling Capacitors'],
      description: 'Amplifies low-level voice acoustic signals (300Hz-3.4kHz) to 1V p-p modulation driver input.',
      specs: 'Gain: +26 dB | Bandwidth: 300 - 3400 Hz'
    },
    mod: {
      id: 'mod',
      name: '2. Collector Modulator',
      sub: 'AM DSB Generation',
      type: 'TX',
      components: ['2N2222A Power Transistor', 'Modulation Transformer / Inductor'],
      description: 'Varies the DC supply voltage to the RF Class-C driver stage proportionally with speech audio voltage.',
      specs: 'Modulation Depth: 85% | Efficiency: 72%'
    },
    osc: {
      id: 'osc',
      name: '3. Quartz Crystal Oscillator',
      sub: '27.145 MHz Carrier Ref',
      type: 'TX',
      components: ['27.145 MHz Quartz Crystal', '2N2222A NPN', 'Colpitts Tank Capacitors'],
      description: 'Generates ultra-stable 27.145 MHz high-frequency sine wave reference carrier.',
      specs: 'Freq: 27.145 MHz | Stability: < ± 25 Hz'
    },
    pa: {
      id: 'pa',
      name: '4. RF Power Amplifier & Pi Match',
      sub: '50Ω Impedance Matching',
      type: 'TX',
      components: ['Class-C RF Amplifier', 'Pi LC Network (L1, C1, C2)', 'Low-Pass Filter'],
      description: 'Boosts modulated RF carrier to 250mW RF power output and matches impedance to 50Ω whip antenna.',
      specs: 'Power: 250 mW | Harmonics: -38 dBc'
    },
    ptt: {
      id: 'ptt',
      name: '5. T/R Switch (PTT Relay)',
      sub: 'Transmit/Receive Switching',
      type: 'COMMON',
      components: ['Push-To-Talk Switch', 'Dual-Pole Relay / DPDT Switch'],
      description: 'Routes antenna and DC supply rails dynamically between transmit (TX) and receive (RX) stages.',
      specs: 'Isolation: > 45 dB | Switching: Manual'
    },
    ant: {
      id: 'ant',
      name: '6. Telescopic Whip Antenna',
      sub: '50Ω Radiating Element',
      type: 'COMMON',
      components: ['1.2m Telescopic Whip', 'Load Coil', 'BNC Connector'],
      description: 'Converts guided RF electrical currents into radiating electromagnetic radio waves.',
      specs: 'Length: 1.2m | Gain: 2.15 dBi'
    },
    rx_filter: {
      id: 'rx_filter',
      name: '7. LC Front-End Filter & LNA',
      sub: '27 MHz Selective Receiver',
      type: 'RX',
      components: ['Tuned LC Tank Resonator', '1N60 Diode Protection', '2N3904 Low Noise Amp'],
      description: 'Rejects out-of-band RF interference and amplifies tiny incoming microvolt signals.',
      specs: 'Selectivity: Q=45 | Sensitivity: < 10 µV'
    },
    det: {
      id: 'det',
      name: '8. Envelope Detector',
      sub: 'AM Diode Demodulator',
      type: 'RX',
      components: ['1N60 Germanium Diode', '10nF Filter Cap', '47kΩ Load Resistor'],
      description: 'Extracts original speech audio envelope from received 27 MHz AM carrier wave.',
      specs: 'Diode Vf: 0.25V | Demod THD: < 3.2%'
    },
    amp: {
      id: 'amp',
      name: '9. LM386 Audio Driver',
      sub: 'Power Output Stage',
      type: 'RX',
      components: ['LM386 IC', '10µF Bypass Cap', '8Ω 0.5W Speaker'],
      description: 'Amplifies recovered audio speech signal to drive miniature 8 ohm internal speaker.',
      specs: 'Audio Output: 325 mW | Supply: 9V DC'
    }
  };

  const active = blocks[selectedBlock] || blocks.osc;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 technical-panel space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Layers className="w-4 h-4" />
            <span>SYSTEM HARDWARE ARCHITECTURE BLOCK DIAGRAM</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-mono mt-1">
            Project 001: AM Walkie-Talkie Circuit Pipeline
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">TX Path</span>
          <span className="px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">RX Path</span>
          <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">PTT Switch</span>
        </div>
      </div>

      {/* Interactive Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* TRANSMITTER COLUMN */}
        <div className="space-y-3 bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg">
          <div className="text-xs font-mono font-bold text-amber-400 border-b border-amber-900/40 pb-2 flex items-center justify-between">
            <span>[TX] TRANSMITTER STAGE</span>
            <Mic className="w-3.5 h-3.5" />
          </div>

          {['mic', 'mod', 'osc', 'pa'].map((key) => {
            const b = blocks[key];
            const isSelected = selectedBlock === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedBlock(key)}
                className={`w-full text-left p-2.5 rounded border transition-all font-mono ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{b.name}</span>
                  <span className="text-[10px] text-amber-400/80">{b.sub}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* COMMON / SWITCHING COLUMN */}
        <div className="space-y-3 bg-purple-950/10 border border-purple-900/30 p-3 rounded-lg flex flex-col justify-between">
          <div className="text-xs font-mono font-bold text-purple-400 border-b border-purple-900/40 pb-2 flex items-center justify-between">
            <span>[T/R] SWITCH & ANTENNA</span>
            <Radio className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-3 my-auto">
            {['ptt', 'ant'].map((key) => {
              const b = blocks[key];
              const isSelected = selectedBlock === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedBlock(key)}
                  className={`w-full text-left p-3 rounded border transition-all font-mono ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-lg scale-[1.02]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-purple-500/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{b.name}</div>
                  <div className="text-[10px] text-purple-400 mt-0.5">{b.sub}</div>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 text-center bg-slate-900/60 p-2 rounded border border-slate-800/80">
            Push-To-Talk Toggle routes RF energy to antenna during speech transmission.
          </div>
        </div>

        {/* RECEIVER COLUMN */}
        <div className="space-y-3 bg-sky-950/10 border border-sky-900/30 p-3 rounded-lg">
          <div className="text-xs font-mono font-bold text-sky-400 border-b border-sky-900/40 pb-2 flex items-center justify-between">
            <span>[RX] RECEIVER STAGE</span>
            <Volume2 className="w-3.5 h-3.5" />
          </div>

          {['rx_filter', 'det', 'amp'].map((key) => {
            const b = blocks[key];
            const isSelected = selectedBlock === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedBlock(key)}
                className={`w-full text-left p-3 rounded border transition-all font-mono ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-500 text-sky-200 shadow-lg shadow-sky-500/10 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-sky-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{b.name}</span>
                </div>
                <div className="text-[10px] text-sky-400 mt-0.5">{b.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INSPECTION DETAIL PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold font-mono text-slate-100">{active.name}</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {active.specs}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          {active.description}
        </p>

        <div>
          <span className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase font-semibold">
            Key Discrete Components:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {active.components.map((comp, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs font-mono rounded bg-slate-800 text-slate-200 border border-slate-700/80"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
