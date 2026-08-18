import React, { useState } from 'react';
import { 
  FolderDown, 
  Terminal, 
  Copy, 
  Check 
} from 'lucide-react';
import { LLMModel } from '../types';

interface DownloadGuideSectionProps {
  models: LLMModel[];
  onDownloadAllZip: () => void;
}

export const DownloadGuideSection: React.FC<DownloadGuideSectionProps> = ({
  models,
  onDownloadAllZip
}) => {
  const [activeGuide, setActiveGuide] = useState<'ollama' | 'lmstudio' | 'bash' | 'python'>('ollama');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allOllamaCommands = models.map(m => m.ollamaCommand).join('\n');
  const bulkDownloadScript = `#!/usr/bin/env bash
# OpenLLM Hub - Bulk Downloader Script for all custom AI models
# 100% Free & Open Source

mkdir -p ./openllm_models && cd ./openllm_models
echo "🚀 Downloading all custom fine-tuned LLMs from OpenLLM Hub..."

${models.map(m => {
  const q = m.quantizations[0];
  return `# Model: ${m.name} (${m.parameterSize})\necho "📥 Downloading ${q.filename} (${q.size})..."\ncurl -L -O "https://huggingface.co/${m.huggingFaceRepo}/resolve/main/${q.filename}"\n`;
}).join('\n')}

echo "✅ All LLM model weights downloaded successfully to ./openllm_models!"
echo "Run them with: ollama run /path/to/model or load in LM Studio."`;

  return (
    <section id="download-center" className="py-12 sm:py-16 bg-transparent text-zinc-100 border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold text-blue-300 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <FolderDown className="h-3.5 w-3.5 text-cyan-400" />
            <span>Download & Local Setup Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            How to Run These Models Locally in 60 Seconds
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Every model is formatted for immediate plug-and-play with Ollama, LM Studio, Jan, or Python. Choose your preferred workflow.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/10 bg-zinc-900/70 p-1.5 text-xs font-semibold backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setActiveGuide('ollama')}
              className={`rounded-xl px-4 py-2 transition-all cursor-pointer ${
                activeGuide === 'ollama' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🦙 Ollama (1-Command)
            </button>
            <button
              onClick={() => setActiveGuide('lmstudio')}
              className={`rounded-xl px-4 py-2 transition-all cursor-pointer ${
                activeGuide === 'lmstudio' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🖥️ LM Studio / Jan
            </button>
            <button
              onClick={() => setActiveGuide('bash')}
              className={`rounded-xl px-4 py-2 transition-all cursor-pointer ${
                activeGuide === 'bash' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ⚡ Bulk Curl Script (.sh)
            </button>
            <button
              onClick={() => setActiveGuide('python')}
              className={`rounded-xl px-4 py-2 transition-all cursor-pointer ${
                activeGuide === 'python' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              🐍 Python / Hugging Face
            </button>
          </div>
        </div>

        {/* Guide Content Box */}
        <div className="mt-6 max-w-4xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl shadow-2xl">
          
          {/* OLLAMA */}
          {activeGuide === 'ollama' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Run Directly with Ollama
                  </h3>
                  <p className="text-xs text-zinc-400">
                    No manual file moving required. Just paste the command in your Terminal or Command Prompt.
                  </p>
                </div>
                <button
                  onClick={() => copyText(allOllamaCommands, 'all-ollama')}
                  className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  {copiedKey === 'all-ollama' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'all-ollama' ? 'Copied All!' : 'Copy All Commands'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-950/90 font-mono text-xs text-emerald-400 overflow-x-auto border border-white/10 leading-relaxed whitespace-pre shadow-inner">
{allOllamaCommands}
              </pre>
            </div>
          )}

          {/* LM STUDIO */}
          {activeGuide === 'lmstudio' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Step-by-Step Guide for LM Studio / Jan.ai GUI
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-4 space-y-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">1</span>
                  <p className="font-bold text-white">Download .gguf</p>
                  <p className="text-zinc-400">Click the "Download" button on any model above (e.g. Q4_K_M).</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-4 space-y-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">2</span>
                  <p className="font-bold text-white">Move to Models Folder</p>
                  <p className="text-zinc-400">Place the .gguf file into <code className="text-cyan-400 font-mono">~/.cache/lm-studio/models</code></p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-zinc-950/70 p-4 space-y-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">3</span>
                  <p className="font-bold text-white">Select & Chat</p>
                  <p className="text-zinc-400">Select the model from the top bar in LM Studio and chat with 100% privacy!</p>
                </div>
              </div>
            </div>
          )}

          {/* BULK BASH SCRIPT */}
          {activeGuide === 'bash' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Download All Models in One Bash Script
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Automate the entire download workflow with curl and resume support.
                  </p>
                </div>
                <button
                  onClick={() => copyText(bulkDownloadScript, 'bash-script')}
                  className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  {copiedKey === 'bash-script' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'bash-script' ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-950/90 font-mono text-xs text-zinc-200 overflow-x-auto border border-white/10 leading-relaxed max-h-56 shadow-inner">
                {bulkDownloadScript}
              </pre>
            </div>
          )}

          {/* PYTHON */}
          {activeGuide === 'python' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Python Inference with Transformers
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Load directly with GPU 4-bit / 16-bit precision:
                  </p>
                </div>
                <button
                  onClick={() => copyText(models[0].pythonSnippet, 'python-full')}
                  className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 border border-white/10 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  {copiedKey === 'python-full' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'python-full' ? 'Copied' : 'Copy Python Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-zinc-950/90 font-mono text-xs text-amber-300 overflow-x-auto border border-white/10 leading-relaxed shadow-inner">
                {models[0].pythonSnippet}
              </pre>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
