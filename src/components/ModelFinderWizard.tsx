import React, { useState, useMemo } from 'react';
import { LLMModel, QuantizationOption } from '../types';
import { 
  Compass, 
  Cpu, 
  Sparkles, 
  Terminal, 
  Download, 
  Info, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';

interface ModelFinderWizardProps {
  models: LLMModel[];
  onOpenDetails: (model: LLMModel) => void;
  onDownloadModel: (model: LLMModel, quant: QuantizationOption) => void;
}

export const ModelFinderWizard: React.FC<ModelFinderWizardProps> = ({
  models,
  onOpenDetails,
  onDownloadModel,
}) => {
  // Step 1: Hardware RAM / VRAM
  const [hardware, setHardware] = useState<'low' | 'mid' | 'high'>('mid');
  // Step 2: Primary Domain / Task
  const [task, setTask] = useState<'bengali' | 'coding' | 'reasoning' | 'fast_assistant'>('bengali');
  // Step 3: Priority (Speed vs. Max Quality)
  const [priority, setPriority] = useState<'speed' | 'accuracy'>('speed');

  const recommendation = useMemo(() => {
    let candidate = models[0];

    if (hardware === 'low') {
      // <= 4GB RAM/VRAM
      if (task === 'coding') {
        candidate = models.find((m) => m.category === 'coding' || m.id.includes('code')) || models[0];
      } else {
        candidate = models.find((m) => m.paramNumber <= 3 || m.category === 'edge-lightweight') || models[0];
      }
    } else if (hardware === 'mid') {
      // 6GB - 12GB VRAM
      if (task === 'coding') {
        candidate = models.find((m) => m.category === 'coding') || models[0];
      } else if (task === 'reasoning') {
        candidate = models.find((m) => m.category === 'reasoning' && m.paramNumber <= 14) || models[0];
      } else {
        candidate = models.find((m) => m.paramNumber >= 7 && m.paramNumber <= 9) || models[0];
      }
    } else {
      // 16GB+ VRAM High-end
      if (task === 'coding') {
        candidate = models.find((m) => m.category === 'coding') || models[0];
      } else if (task === 'reasoning') {
        candidate = models.find((m) => m.category === 'reasoning' && m.paramNumber >= 14) || models[0];
      } else {
        candidate = models.find((m) => m.paramNumber >= 14) || models[0];
      }
    }

    const recommendedQuant = candidate.quantizations.find((q) => q.isPopular) || candidate.quantizations[0];

    return {
      model: candidate,
      quant: recommendedQuant,
    };
  }, [hardware, task, priority, models]);

  return (
    <section id="wizard-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-300 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>Smart Model Matcher</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Find Your Perfect AI Model in 3 Clicks
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Specify your computer hardware and use case to receive an instant GGUF quantization recommendation optimized for speed, precision, and memory efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Form Choices (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            
            {/* Question 1: Hardware */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">1</span>
                <span>What hardware and RAM/VRAM do you have?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'low', title: 'Laptop / CPU (4-8GB)', desc: 'Standard desktop or budget CPU' },
                  { id: 'mid', title: 'Mid GPU (6-12GB)', desc: 'RTX 3060 / 4060 / Apple M1-M4' },
                  { id: 'high', title: 'Workstation GPU (16GB+)', desc: 'RTX 3090 / 4090 / Mac 32GB+' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHardware(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      hardware === item.id
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'border-white/5 bg-zinc-950/60 hover:bg-white/5'
                    }`}
                  >
                    <span className={`block font-bold text-xs ${hardware === item.id ? 'text-cyan-300' : 'text-zinc-200'}`}>
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-zinc-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Task */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">2</span>
                <span>What is your primary use case?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'bengali', label: 'Bengali & Indic NLP', icon: '🌐' },
                  { id: 'coding', label: 'Full-Stack Code', icon: '💻' },
                  { id: 'reasoning', label: 'Math & Logic', icon: '🧠' },
                  { id: 'fast_assistant', label: 'Fast Offline Chat', icon: '⚡' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTask(item.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      task === item.id
                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'border-white/5 bg-zinc-950/60 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <span className={`block font-semibold text-xs ${task === item.id ? 'text-blue-300' : 'text-zinc-300'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Priority */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">3</span>
                <span>Optimization Priority:</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'speed', title: 'Maximum Speed', desc: 'Ultra-fast token generation (Q4_K_M)' },
                  { id: 'accuracy', title: 'Highest Precision', desc: 'Dense reasoning output (Q8_0/FP16)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPriority(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      priority === item.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'border-white/5 bg-zinc-950/60 hover:bg-white/5'
                    }`}
                  >
                    <span className={`block font-bold text-xs ${priority === item.id ? 'text-indigo-300' : 'text-zinc-200'}`}>
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-zinc-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Recommendation Card Output (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-blue-500/30 bg-[#090a10] p-6 sm:p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Match
              </span>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                ★ Recommended Match For You
              </span>

              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {recommendation.model.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {recommendation.model.tagline}
                </p>
              </div>

              {/* Specs Badge Pill */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-lg bg-zinc-800 border border-white/10 px-2.5 py-1 text-xs font-mono text-zinc-200">
                  {recommendation.model.parameterSize}
                </span>
                <span className="rounded-lg bg-zinc-800 border border-white/10 px-2.5 py-1 text-xs font-mono text-zinc-200">
                  Format: {recommendation.quant.format}
                </span>
                <span className="rounded-lg bg-zinc-800 border border-white/10 px-2.5 py-1 text-xs font-mono text-zinc-200">
                  Size: {recommendation.quant.size}
                </span>
              </div>

              {/* Ollama Terminal Box */}
              <div className="rounded-2xl bg-zinc-950 p-3 border border-white/5 font-mono text-xs">
                <div className="flex justify-between text-zinc-500 text-[10px] uppercase font-bold mb-1">
                  <span>Run in 1 command:</span>
                  <span className="text-emerald-400">Ollama Ready</span>
                </div>
                <code className="text-emerald-400 block break-all">
                  {recommendation.model.ollamaCommand}
                </code>
              </div>

              <div className="text-xs text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Commercial & Personal Use Allowed ({recommendation.model.license})</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onDownloadModel(recommendation.model, recommendation.quant)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Recommended GGUF</span>
              </button>

              <button
                onClick={() => onOpenDetails(recommendation.model)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4 text-cyan-400" />
                <span>Model Specs</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
