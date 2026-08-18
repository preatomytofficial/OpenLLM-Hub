import React, { useState } from 'react';
import { 
  Cpu, 
  Download
} from 'lucide-react';
import { LLMModel, HardwarePreset, QuantizationOption } from '../types';
import { HARDWARE_PRESETS } from '../data/models';

interface HardwareCalculatorProps {
  models: LLMModel[];
  onDownloadModel: (model: LLMModel, quant: QuantizationOption) => void;
}

export const HardwareCalculator: React.FC<HardwareCalculatorProps> = ({
  models,
  onDownloadModel
}) => {
  const [selectedPreset, setSelectedPreset] = useState<HardwarePreset>(HARDWARE_PRESETS[3]); // RTX 3060 default
  const [customVram, setCustomVram] = useState<number>(12);
  const [customRam, setCustomRam] = useState<number>(32);
  const [isCustom, setIsCustom] = useState(false);

  const currentVram = isCustom ? customVram : selectedPreset.vramGb;
  const currentRam = isCustom ? customRam : selectedPreset.ramGb;

  const getCompatibility = (model: LLMModel) => {
    // If user has zero VRAM (CPU only)
    if (currentVram === 0) {
      if (currentRam >= model.minCpuRamGb) {
        return {
          status: 'runs-cpu',
          label: 'Runs on CPU RAM',
          color: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
          speed: '25-45 tok/s',
          recommendedQuant: model.quantizations.find(q => q.format.includes('Q4')) || model.quantizations[0]
        };
      } else {
        return {
          status: 'insufficient',
          label: 'Insufficient RAM',
          color: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
          speed: 'Out of Memory',
          recommendedQuant: model.quantizations[0]
        };
      }
    }

    // Has GPU VRAM
    if (currentVram >= model.recommendedVramGb) {
      return {
        status: 'perfect',
        label: 'Full GPU (100% VRAM Fit)',
        color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
        speed: `${model.benchmarks.tokensPerSec} tok/s`,
        recommendedQuant: model.quantizations.find(q => q.format.includes('Q8')) || model.quantizations[0]
      };
    } else if (currentVram >= model.minVramGb) {
      return {
        status: 'good',
        label: 'Runs in 4-bit Quant (Q4_K_M)',
        color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
        speed: `${Math.round(model.benchmarks.tokensPerSec * 0.9)} tok/s`,
        recommendedQuant: model.quantizations.find(q => q.format.includes('Q4')) || model.quantizations[0]
      };
    } else if (currentRam >= model.minCpuRamGb) {
      return {
        status: 'hybrid',
        label: 'Hybrid GPU + CPU Offload',
        color: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
        speed: '15-30 tok/s',
        recommendedQuant: model.quantizations.find(q => q.format.includes('Q4')) || model.quantizations[0]
      };
    } else {
      return {
        status: 'insufficient',
        label: 'Hardware Upgrade Needed',
        color: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
        speed: 'Low Memory',
        recommendedQuant: model.quantizations[0]
      };
    }
  };

  return (
    <section id="hardware-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-300 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>Hardware & VRAM Compatibility Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Will It Run on My Machine?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Select your hardware preset or adjust the custom VRAM sliders to evaluate offline inference compatibility across all open-source models.
          </p>
        </div>

        {/* Hardware Preset Selector */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {HARDWARE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                setIsCustom(false);
              }}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                !isCustom && selectedPreset.id === preset.id
                  ? 'border-blue-500/50 bg-blue-600/15 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                  : 'border-white/5 bg-zinc-900/40 text-zinc-300 hover:border-white/10 hover:bg-zinc-900/60'
              }`}
            >
              <span className="text-xs font-bold line-clamp-1 text-white">{preset.name}</span>
              <span className={`text-[11px] mt-1 ${
                !isCustom && selectedPreset.id === preset.id ? 'text-blue-300' : 'text-zinc-500'
              }`}>
                {preset.vramGb > 0 ? `${preset.vramGb} GB VRAM` : 'No GPU'} • {preset.ramGb} GB RAM
              </span>
            </button>
          ))}
        </div>

        {/* Custom Slider Toggle */}
        <div className="mt-6 max-w-xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-2">
            <span>Custom Hardware Configuration:</span>
            <span className="text-cyan-400 font-mono">
              VRAM: {currentVram} GB | System RAM: {currentRam} GB
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>GPU VRAM</span>
                <span className="font-bold text-white">{customVram} GB</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={customVram}
                onChange={(e) => {
                  setCustomVram(parseInt(e.target.value));
                  setIsCustom(true);
                }}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                <span>System RAM</span>
                <span className="font-bold text-white">{customRam} GB</span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={customRam}
                onChange={(e) => {
                  setCustomRam(parseInt(e.target.value));
                  setIsCustom(true);
                }}
                className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Compatibility Matrix Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {models.map((model) => {
            const comp = getCompatibility(model);
            return (
              <div
                key={model.id}
                className="flex flex-col justify-between rounded-2xl border border-white/5 bg-zinc-900/40 p-4 shadow-sm backdrop-blur-md hover:border-blue-500/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{model.name}</h4>
                      <p className="text-[11px] text-zinc-400">{model.parameterSize} • {model.baseArchitecture}</p>
                    </div>
                    <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-bold ${comp.color}`}>
                      {comp.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-300 bg-zinc-950/70 p-2.5 rounded-xl border border-white/5">
                    <span>
                      Min VRAM required:{' '}
                      <strong className="text-white">{model.minVramGb} GB</strong>
                    </span>
                    <span>
                      Est. Speed:{' '}
                      <strong className="text-cyan-400 font-mono">{comp.speed}</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Recommended: <strong className="text-zinc-200">{comp.recommendedQuant.format} ({comp.recommendedQuant.size})</strong>
                  </span>
                  <button
                    onClick={() => onDownloadModel(model, comp.recommendedQuant)}
                    id={`btn-calc-download-${model.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-white" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
