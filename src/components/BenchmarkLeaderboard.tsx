import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Download, 
  Info,
  Award
} from 'lucide-react';
import { LLMModel, QuantizationOption } from '../types';

interface BenchmarkLeaderboardProps {
  models: LLMModel[];
  onOpenDetails: (model: LLMModel) => void;
  onDownloadModel: (model: LLMModel, quant: QuantizationOption) => void;
}

type SortKey = 'mmlu' | 'codingHumanEval' | 'mathGsm8k' | 'banglaNlpScore' | 'tokensPerSec' | 'paramNumber';

export const BenchmarkLeaderboard: React.FC<BenchmarkLeaderboardProps> = ({
  models,
  onOpenDetails,
  onDownloadModel
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('banglaNlpScore');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedModels = [...models].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortKey === 'paramNumber') {
      valA = a.paramNumber;
      valB = b.paramNumber;
    } else {
      valA = a.benchmarks[sortKey] || 0;
      valB = b.benchmarks[sortKey] || 0;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <section id="leaderboard-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 mb-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              <span>Empirical Benchmark Leaderboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Model Performance Leaderboard
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Standardized evaluations on BanglaNLP, HumanEval (Coding), GSM8K (Math), and MMLU across all custom models.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Sorted by: <strong className="text-cyan-400 capitalize">{sortKey}</strong></span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/80 text-zinc-300 font-bold">
                <th className="py-3.5 px-4 font-bold">
                  Model Name & Parameters
                </th>
                <th 
                  onClick={() => handleSort('banglaNlpScore')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Bangla NLP</span>
                    <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('codingHumanEval')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>HumanEval (Code)</span>
                    <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('mathGsm8k')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>GSM8K (Math)</span>
                    <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('mmlu')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>MMLU</span>
                    <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('tokensPerSec')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Speed (tok/s)</span>
                    <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedModels.map((model, idx) => (
                <tr key={model.id} className="hover:bg-white/5 transition-colors">
                  
                  {/* Model Name & Specs */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-800 border border-white/5 text-[11px] font-bold text-zinc-300">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-white sm:text-xs">
                          {model.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <span className="font-mono text-cyan-400">{model.parameterSize}</span>
                          <span>•</span>
                          <span>{model.contextWindow} Context</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Bangla NLP */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 font-mono">
                        {model.benchmarks.banglaNlpScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
                          style={{ width: `${model.benchmarks.banglaNlpScore}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* HumanEval Code */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400 font-mono">
                        {model.benchmarks.codingHumanEval}%
                      </span>
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                          style={{ width: `${model.benchmarks.codingHumanEval}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* GSM8K Math */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-400 font-mono">
                        {model.benchmarks.mathGsm8k}%
                      </span>
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="h-full bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" 
                          style={{ width: `${model.benchmarks.mathGsm8k}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  {/* MMLU */}
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-zinc-300 font-mono">
                      {model.benchmarks.mmlu}%
                    </span>
                  </td>

                  {/* Speed */}
                  <td className="py-3.5 px-3">
                    <span className="rounded-lg bg-blue-500/10 px-2 py-0.5 font-bold font-mono text-cyan-300 border border-blue-500/20">
                      {model.benchmarks.tokensPerSec} tok/s
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenDetails(model)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-cyan-400 transition-colors cursor-pointer"
                        title="View Full Model Specs"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDownloadModel(model, model.quantizations[0])}
                        className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
                        title="Download GGUF"
                      >
                        <Download className="h-3 w-3 text-white" />
                        <span>Get</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
