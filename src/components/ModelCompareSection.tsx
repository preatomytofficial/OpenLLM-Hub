import React, { useState } from 'react';
import { LLMModel, QuantizationOption } from '../types';
import { 
  GitCompare, 
  Download, 
  Info,
  Layers,
  Cpu,
  Zap,
  Check
} from 'lucide-react';

interface ModelCompareSectionProps {
  models: LLMModel[];
  onOpenDetails: (model: LLMModel) => void;
  onDownloadModel: (model: LLMModel, quant: QuantizationOption) => void;
}

export const ModelCompareSection: React.FC<ModelCompareSectionProps> = ({
  models,
  onOpenDetails,
  onDownloadModel,
}) => {
  const [modelAId, setModelAId] = useState<string>(models[0]?.id || '');
  const [modelBId, setModelBId] = useState<string>(models[1]?.id || '');

  const modelA = models.find((m) => m.id === modelAId) || models[0];
  const modelB = models.find((m) => m.id === modelBId) || models[1];

  const compareMetrics = [
    {
      label: 'Base Architecture',
      valA: modelA.baseArchitecture,
      valB: modelB.baseArchitecture,
    },
    {
      label: 'Parameter Size',
      valA: modelA.parameterSize,
      valB: modelB.parameterSize,
      better: modelA.paramNumber < modelB.paramNumber ? 'b' : 'a',
    },
    {
      label: 'Context Window Length',
      valA: modelA.contextWindow,
      valB: modelB.contextWindow,
    },
    {
      label: 'Minimum VRAM Requirement',
      valA: `${modelA.minVramGb} GB`,
      valB: `${modelB.minVramGb} GB`,
      better: modelA.minVramGb < modelB.minVramGb ? 'a' : 'b',
    },
    {
      label: 'BanglaNLP Benchmark Score',
      valA: `${modelA.benchmarks.banglaNlpScore}%`,
      valB: `${modelB.benchmarks.banglaNlpScore}%`,
      better: modelA.benchmarks.banglaNlpScore > modelB.benchmarks.banglaNlpScore ? 'a' : 'b',
    },
    {
      label: 'HumanEval Coding Score',
      valA: `${modelA.benchmarks.codingHumanEval}%`,
      valB: `${modelB.benchmarks.codingHumanEval}%`,
      better: modelA.benchmarks.codingHumanEval > modelB.benchmarks.codingHumanEval ? 'a' : 'b',
    },
    {
      label: 'GSM8K Math Reasoning',
      valA: `${modelA.benchmarks.mathGsm8k}%`,
      valB: `${modelB.benchmarks.mathGsm8k}%`,
      better: modelA.benchmarks.mathGsm8k > modelB.benchmarks.mathGsm8k ? 'a' : 'b',
    },
    {
      label: 'MMLU General Knowledge',
      valA: `${modelA.benchmarks.mmlu}%`,
      valB: `${modelB.benchmarks.mmlu}%`,
      better: modelA.benchmarks.mmlu > modelB.benchmarks.mmlu ? 'a' : 'b',
    },
    {
      label: 'Inference Speed',
      valA: `${modelA.benchmarks.tokensPerSec} tok/s`,
      valB: `${modelB.benchmarks.tokensPerSec} tok/s`,
      better: modelA.benchmarks.tokensPerSec > modelB.benchmarks.tokensPerSec ? 'a' : 'b',
    },
    {
      label: 'License',
      valA: modelA.license,
      valB: modelB.license,
    },
  ];

  return (
    <section id="compare-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-300 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <GitCompare className="h-3.5 w-3.5 text-cyan-400" />
            <span>Side-by-Side Model Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Compare Custom AI Models
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Select two models to compare their hardware footprints, benchmark scores, architectures, and performance trade-offs.
          </p>
        </div>

        {/* Model Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
          
          {/* Model A Selection */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-md">
            <label className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
              First Model (A):
            </label>
            <select
              value={modelAId}
              onChange={(e) => setModelAId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              {models.map((m) => (
                <option key={`a-${m.id}`} value={m.id}>
                  {m.name} ({m.parameterSize} - {m.baseArchitecture})
                </option>
              ))}
            </select>
          </div>

          {/* Model B Selection */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 backdrop-blur-md">
            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
              Second Model (B):
            </label>
            <select
              value={modelBId}
              onChange={(e) => setModelBId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              {models.map((m) => (
                <option key={`b-${m.id}`} value={m.id}>
                  {m.name} ({m.parameterSize} - {m.baseArchitecture})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          
          {/* Header Row */}
          <div className="grid grid-cols-3 border-b border-white/10 bg-zinc-950/80 p-4 text-xs font-bold text-zinc-300 items-center">
            <div className="text-zinc-400 uppercase tracking-wider">Evaluation Metric</div>
            <div className="text-center font-bold text-cyan-300 text-sm truncate px-2">{modelA.name}</div>
            <div className="text-center font-bold text-blue-300 text-sm truncate px-2">{modelB.name}</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 text-xs">
            {compareMetrics.map((metric, idx) => (
              <div key={idx} className="grid grid-cols-3 p-4 items-center hover:bg-white/5 transition-colors">
                <div className="font-medium text-zinc-400">{metric.label}</div>
                
                {/* Model A Value */}
                <div className="text-center font-mono font-semibold">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg ${
                      metric.better === 'a'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-zinc-200'
                    }`}
                  >
                    {metric.valA}
                  </span>
                </div>

                {/* Model B Value */}
                <div className="text-center font-mono font-semibold">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg ${
                      metric.better === 'b'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                        : 'text-zinc-200'
                    }`}
                  >
                    {metric.valB}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bottom Bar */}
          <div className="grid grid-cols-3 border-t border-white/10 bg-zinc-950/80 p-4 items-center">
            <div className="text-xs text-zinc-400 font-semibold">Quick Actions:</div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => onOpenDetails(modelA)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <Info className="h-3 w-3 text-cyan-400" />
                <span>Specs A</span>
              </button>
              <button
                onClick={() => onDownloadModel(modelA, modelA.quantizations[0])}
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-colors cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Get A</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => onOpenDetails(modelB)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                <Info className="h-3 w-3 text-blue-400" />
                <span>Specs B</span>
              </button>
              <button
                onClick={() => onDownloadModel(modelB, modelB.quantizations[0])}
                className="w-full sm:w-auto flex items-center justify-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-colors cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Get B</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
