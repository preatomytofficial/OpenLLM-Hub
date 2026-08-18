import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Cpu, 
  Check, 
  Copy, 
  Layers, 
  FileCode2, 
  CheckCircle2,
  Zap,
  Sparkles,
  BookOpen,
  ExternalLink,
  FolderGit2
} from 'lucide-react';
import { LLMModel, QuantizationOption } from '../types';

interface ModelDetailModalProps {
  model: LLMModel | null;
  onClose: () => void;
  onDownload: (model: LLMModel, quant: QuantizationOption) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  onClose,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'integrate' | 'benchmarks' | 'prompts'>('downloads');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!model) return null;

  const isHfModel = model.category === 'huggingface-llm';
  const hfCleanRepo = model.huggingFaceRepo ? model.huggingFaceRepo.replace(/\/tree\/.*$/, '') : '';

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="model-detail-modal-container"
        className="relative w-full max-w-4xl rounded-3xl bg-[#09090b] shadow-2xl border border-white/10 overflow-hidden my-8 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between border-b border-white/10 bg-zinc-950/80 px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {model.name}
              </h2>
              <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                {model.parameterSize}
              </span>
              <span className="rounded-lg bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                {model.license}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {model.contextWindow} Context
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              {model.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-zinc-950/40 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Downloads & Quantizations</span>
          </button>

          <button
            onClick={() => setActiveTab('integrate')}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'integrate'
                ? 'border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>Quick CLI & Code Snippets</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prompts'
                ? 'border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>Sample Prompts & Outputs</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'benchmarks'
                ? 'border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="h-4 w-4 text-cyan-400" />
            <span>Benchmarks & Specifications</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: DOWNLOADS & QUANTIZATIONS */}
          {activeTab === 'downloads' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-zinc-900/50 p-4 border border-white/5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white mb-1">
                  100% Free Direct Downloads
                </h3>
                <p className="text-xs text-zinc-400">
                  All model weights are quantized into GGUF format for instant local execution in LM Studio, Ollama, Jan, or llama.cpp. Select the optimal file for your hardware.
                </p>
              </div>

              {/* Quantization Table */}
              <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden backdrop-blur-md">
                {model.quantizations.map((quant, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/5 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{quant.format}</span>
                        {quant.isPopular && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-blue-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                        <span className="font-mono text-xs text-zinc-400">({quant.filename})</span>
                      </div>
                      <p className="text-xs text-zinc-400">{quant.recommendedFor}</p>
                      <p className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                        <Cpu className="h-3 w-3" /> {quant.recommendedVram}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-zinc-200 bg-zinc-800 border border-white/5 px-3 py-1 rounded-xl">
                        {quant.size}
                      </span>
                      <button
                        onClick={() => onDownload(model, quant)}
                        id={`btn-modal-download-${index}`}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hardware fit banner */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-200 flex items-start gap-3 backdrop-blur-md">
                <Cpu className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Hardware Compatibility:</p>
                  <p className="mt-0.5 text-zinc-300">
                    Minimum VRAM required: {model.minVramGb} GB (or {model.minCpuRamGb} GB system RAM if running on CPU). Recommended for zero-latency generation: {model.recommendedVramGb} GB VRAM.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTEGRATION & CLI CODE */}
          {activeTab === 'integrate' && (
            <div className="space-y-5">
              
              {/* If Hugging Face Model: Pure Hugging Face Link & CLI (NO Ollama) */}
              {isHfModel ? (
                <>
                  {/* Hugging Face Official Repo Link */}
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-zinc-100 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <span className="text-sm">🤗</span> Option 1: Hugging Face Model Repository & Direct Files
                      </span>
                      <a
                        href={`https://huggingface.co/${hfCleanRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-amber-300 hover:text-white bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        <span>Open on Hugging Face</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <div className="p-3 bg-zinc-950/90 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-amber-300 truncate">
                        https://huggingface.co/{hfCleanRepo}
                      </span>
                      <button
                        onClick={() => copySnippet(`https://huggingface.co/${hfCleanRepo}`, 'hf-link')}
                        className="shrink-0 flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        {copiedCode === 'hf-link' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode === 'hf-link' ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Hugging Face CLI */}
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-zinc-100 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 font-mono">
                        <Terminal className="h-4 w-4" /> Option 2: Hugging Face CLI Download
                      </span>
                      <button
                        onClick={() => copySnippet(`huggingface-cli download ${model.huggingFaceRepo}`, 'hf')}
                        className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        {copiedCode === 'hf' ? <Check className="h-3.5 w-3.5 text-blue-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode === 'hf' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-zinc-200 overflow-x-auto p-3 bg-zinc-900/90 rounded-xl border border-white/5">
                      huggingface-cli download {model.huggingFaceRepo}
                    </pre>
                  </div>
                </>
              ) : (
                <>
                  {/* Ollama Setup for non-HF models */}
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-zinc-100 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-mono">
                        <Terminal className="h-4 w-4" /> Option 1: Run with Ollama (1-Line Command)
                      </span>
                      <button
                        onClick={() => copySnippet(model.ollamaCommand, 'ollama')}
                        className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                      >
                        {copiedCode === 'ollama' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode === 'ollama' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-emerald-400 overflow-x-auto p-3 bg-zinc-900/90 rounded-xl border border-white/5">
                      {model.ollamaCommand}
                    </pre>
                  </div>

                  {/* Hugging Face CLI */}
                  {model.huggingFaceRepo && (
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-zinc-100 shadow-inner">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 font-mono">
                          <Terminal className="h-4 w-4" /> Option 2: Hugging Face CLI Download
                        </span>
                        <button
                          onClick={() => copySnippet(`huggingface-cli download ${model.huggingFaceRepo}`, 'hf')}
                          className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          {copiedCode === 'hf' ? <Check className="h-3.5 w-3.5 text-blue-400" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedCode === 'hf' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-zinc-200 overflow-x-auto p-3 bg-zinc-900/90 rounded-xl border border-white/5">
                        huggingface-cli download {model.huggingFaceRepo}
                      </pre>
                    </div>
                  )}
                </>
              )}

              {/* Python Code Snippet */}
              <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-zinc-100 shadow-inner">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
                    <FileCode2 className="h-4 w-4" /> Option {isHfModel ? '3' : '3'}: Python Integration
                  </span>
                  <button
                    onClick={() => copySnippet(model.pythonSnippet, 'python')}
                    className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    {copiedCode === 'python' ? <Check className="h-3.5 w-3.5 text-amber-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode === 'python' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-amber-300 overflow-x-auto p-3 bg-zinc-900/90 rounded-xl border border-white/5 whitespace-pre">
                  {model.pythonSnippet}
                </pre>
              </div>

              {/* LM Studio & Jan import info */}
              <div className="rounded-2xl bg-zinc-900/50 border border-white/10 p-4 text-xs text-zinc-300 backdrop-blur-md">
                <h4 className="font-bold text-white mb-1">
                  Desktop GUI Application Support:
                </h4>
                <p className="text-zinc-400">
                  Simply place any downloaded .gguf file into your LM Studio or Jan.ai "My Models" directory, and select it from the model dropdown.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SAMPLE PROMPTS & TEST */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Curated prompt benchmarks and verified model inference outputs:
              </p>

              <div className="space-y-3">
                {model.samplePrompts.map((sample) => (
                  <div key={sample.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sample.title}</span>
                      <button
                        onClick={() => copySnippet(sample.prompt, `prompt-${sample.id}`)}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-blue-600/40 transition-colors cursor-pointer"
                      >
                        {copiedCode === `prompt-${sample.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedCode === `prompt-${sample.id}` ? 'Copied Prompt' : 'Copy Prompt'}</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-zinc-950/80 p-3 text-xs text-zinc-300 border border-white/5 font-mono">
                      {sample.prompt}
                    </div>

                    <div className="rounded-xl bg-blue-500/5 p-3 text-xs text-cyan-200 border border-blue-500/20 whitespace-pre-line">
                      <span className="font-bold text-cyan-400 block mb-1">Model Output:</span>
                      {sample.response}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BENCHMARKS & ARCHITECTURE */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-5">
              
              {/* Benchmark Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">MMLU Knowledge</span>
                  <p className="mt-1 text-2xl font-extrabold text-white">{model.benchmarks.mmlu}%</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">HumanEval Code</span>
                  <p className="mt-1 text-2xl font-extrabold text-blue-400">{model.benchmarks.codingHumanEval}%</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">GSM8K Math</span>
                  <p className="mt-1 text-2xl font-extrabold text-purple-400">{model.benchmarks.mathGsm8k}%</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">BanglaNLP Score</span>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-400">{model.benchmarks.banglaNlpScore}%</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">ARC Reasoning</span>
                  <p className="mt-1 text-2xl font-extrabold text-cyan-400">{model.benchmarks.reasoningArc}%</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
                  <span className="text-xs font-semibold text-zinc-400">Tokens / Sec</span>
                  <p className="mt-1 text-2xl font-extrabold text-amber-400">{model.benchmarks.tokensPerSec} tok/s</p>
                </div>
              </div>

              {/* Features List */}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 backdrop-blur-md">
                <h4 className="font-bold text-white text-sm mb-3">
                  Key Architectural Features
                </h4>
                <ul className="space-y-2.5">
                  {model.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Training info */}
              <div className="rounded-2xl bg-zinc-950/80 p-4 border border-white/5 text-xs text-zinc-400 space-y-1.5">
                <p><strong className="text-zinc-200">Base Architecture:</strong> {model.baseArchitecture}</p>
                <p><strong className="text-zinc-200">Training Tokens:</strong> {model.trainingTokens}</p>
                <p><strong className="text-zinc-200">License:</strong> {model.license}</p>
                <p><strong className="text-zinc-200">Release Date:</strong> {model.releaseDate}</p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950/80 px-6 py-4">
          <div className="text-xs text-zinc-400">
            Open-source and free for commercial and research use
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => copySnippet(model.ollamaCommand, 'footer-ollama')}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              {copiedCode === 'footer-ollama' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Terminal className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{copiedCode === 'footer-ollama' ? 'Copied Ollama' : 'Copy Ollama Command'}</span>
            </button>

            <button
              onClick={() => onDownload(model, model.quantizations[0])}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Recommended GGUF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
