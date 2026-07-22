import React, { useEffect, useRef, useState } from 'react';
import { Radio, Activity, Sliders, Zap } from 'lucide-react';

export const SignalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [carrierFreq, setCarrierFreq] = useState<number>(27.145);
  const [modDepth, setModDepth] = useState<number>(85);
  const [audioFreq, setAudioFreq] = useState<number>(1000);
  const [showFFT, setShowFFT] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas with deep void black
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, width, height);

      // Draw Mechanical Matrix Grid
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 1;
      const gridSize = 24;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Line
      ctx.strokeStyle = '#222222';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (!showFFT) {
        // AM Waveform Oscilloscope view
        const centerY = height / 2;
        const amplitude = height * 0.35;
        const m = modDepth / 100;

        // Envelope (Upper & Lower)
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255, 184, 0, 0.5)'; // Gold/Amber envelope
        ctx.lineWidth = 1.5;

        // Upper Envelope
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const audioWave = Math.sin((x * 0.015 * (audioFreq / 1000)) + time);
          const envY = centerY - amplitude * 0.5 * (1 + m * audioWave);
          if (x === 0) ctx.moveTo(x, envY);
          else ctx.lineTo(x, envY);
        }
        ctx.stroke();

        // Lower Envelope
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const audioWave = Math.sin((x * 0.015 * (audioFreq / 1000)) + time);
          const envY = centerY + amplitude * 0.5 * (1 + m * audioWave);
          if (x === 0) ctx.moveTo(x, envY);
          else ctx.lineTo(x, envY);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // High Frequency Modulated Carrier Signal (Neon Terminal Matrix Green #00FF41)
        ctx.strokeStyle = '#00FF41';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const audioWave = Math.sin((x * 0.015 * (audioFreq / 1000)) + time);
          const carrierWave = Math.sin((x * 0.3 * (carrierFreq / 10)) + (time * 5));
          const env = 0.5 * (1 + m * audioWave);
          const y = centerY + amplitude * env * carrierWave;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Oscilloscope HUD overlay
        ctx.fillStyle = '#00FF41';
        ctx.font = '11px monospace';
        ctx.fillText(`CARRIER: ${carrierFreq.toFixed(3)} MHz [RF-27MHZ]`, 15, 20);
        ctx.fillStyle = '#FFB800';
        ctx.fillText(`MODULATION DEPTH: ${modDepth}% (AM-DSB)`, 15, 36);
        ctx.fillStyle = '#E0E0E0';
        ctx.fillText(`AUDIO SPEECH FREQ: ${audioFreq} Hz`, 15, 52);
      } else {
        // Spectrum Analyzer FFT View
        const numBars = 48;
        const barWidth = (width - 40) / numBars;
        const centerBin = Math.floor(numBars / 2);

        for (let i = 0; i < numBars; i++) {
          const dist = Math.abs(i - centerBin);
          let barHeight = 10 + Math.random() * 8;

          // Carrier peak
          if (dist === 0) {
            barHeight = height * 0.75 + (modDepth * 0.15);
          } else if (dist === 2 || dist === 3) {
            // Sidebands
            barHeight = (height * 0.35) * (modDepth / 100) + Math.random() * 10;
          }

          const x = 20 + i * barWidth;
          const y = height - 25 - barHeight;

          const isCarrier = dist === 0;
          const isSideband = dist === 2 || dist === 3;

          ctx.fillStyle = isCarrier ? '#00FF41' : isSideband ? '#FFB800' : '#333333';
          ctx.fillRect(x, y, barWidth - 2, barHeight);
        }

        ctx.fillStyle = '#00FF41';
        ctx.font = '11px monospace';
        ctx.fillText(`SPECTRUM ANALYZER (27.145 MHz Center Peak + USB/LSB Sidebands)`, 15, 20);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [carrierFreq, modDepth, audioFreq, showFFT]);

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] overflow-hidden shadow-2xl font-mono">
      {/* Header bar */}
      <div className="bg-[#0F0F0F] border-b border-[#1A1A1A] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-[#00FF41] animate-pulse" />
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            BIT // VOLT Signal Laboratory — RF AM Visualizer
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFFT(!showFFT)}
            className={`px-2.5 py-1 text-[11px] font-mono transition-colors flex items-center space-x-1 uppercase font-bold ${
              showFFT ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40' : 'bg-[#1A1A1A] text-[#888] hover:text-white border border-[#2A2A2A]'
            }`}
          >
            <Activity className="w-3 h-3 text-[#00FF41]" />
            <span>{showFFT ? 'Oscilloscope' : 'FFT Spectrum'}</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={700}
          height={260}
          className="w-full h-[220px] sm:h-[260px] block cursor-crosshair"
        />
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#555] pointer-events-none uppercase">
          SAMPLING RATE: 100 MSPS | 50Ω IMPEDANCE
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-[#0F0F0F] border-t border-[#1A1A1A] px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[#888] mb-1">
            <span>Carrier Freq (MHz)</span>
            <span className="text-[#00FF41] font-bold">{carrierFreq.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="26.0"
            max="28.0"
            step="0.005"
            value={carrierFreq}
            onChange={(e) => setCarrierFreq(parseFloat(e.target.value))}
            className="w-full accent-[#00FF41] bg-[#1A1A1A] h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-[#888] mb-1">
            <span>Modulation Depth (%)</span>
            <span className="text-[#FFB800] font-bold">{modDepth}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={modDepth}
            onChange={(e) => setModDepth(parseInt(e.target.value))}
            className="w-full accent-[#FFB800] bg-[#1A1A1A] h-1.5"
          />
        </div>

        <div>
          <div className="flex justify-between text-[#888] mb-1">
            <span>Audio Tone (Hz)</span>
            <span className="text-white font-bold">{audioFreq} Hz</span>
          </div>
          <input
            type="range"
            min="300"
            max="3400"
            step="100"
            value={audioFreq}
            onChange={(e) => setAudioFreq(parseInt(e.target.value))}
            className="w-full accent-white bg-[#1A1A1A] h-1.5"
          />
        </div>
      </div>
    </div>
  );
};
