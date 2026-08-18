import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Download, 
  X, 
  Copy, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LLMModel, QuantizationOption } from '../types';

interface DownloadToastProps {
  activeDownload: { model: LLMModel; quant: QuantizationOption } | null;
  onClose: () => void;
}

export const DownloadToast: React.FC<DownloadToastProps> = ({
  activeDownload,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (activeDownload) {
      // Fire confetti celebrating open source download!
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.85, x: 0.85 },
          colors: ['#10b981', '#0284c7', '#6366f1', '#f59e0b']
        });
      } catch (err) {
        // Safe fallback if confetti isn't supported in iframe
      }

      // Also trigger a real text file download with model metadata & links
      try {
        const fileContent = `# OpenLLM Hub Model Weights Download Manifest
Model Name: ${activeDownload.model.name}
Base Architecture: ${activeDownload.model.baseArchitecture}
Parameter Size: ${activeDownload.model.parameterSize}
Quantization Format: ${activeDownload.quant.format}
Filename: ${activeDownload.quant.filename}
File Size: ${activeDownload.quant.size}
License: ${activeDownload.model.license}
Creator: ${activeDownload.model.creator}

---
Ollama Run Command:
${activeDownload.model.ollamaCommand}

Hugging Face Hub Repository:
https://huggingface.co/${activeDownload.model.huggingFaceRepo}

Direct Weight Link:
https://huggingface.co/${activeDownload.model.huggingFaceRepo}/resolve/main/${activeDownload.quant.filename}

Instructions for LM Studio / Jan / Ollama:
1. Place this file in your local AI models directory.
2. Launch your local engine with: ${activeDownload.model.ollamaCommand}
3. Enjoy 100% private, free local inference!
`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeDownload.quant.filename}.manifest.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
    }
  }, [activeDownload]);

  if (!activeDownload) return null;

  const copyCmd = () => {
    navigator.clipboard.writeText(activeDownload.model.ollamaCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-3xl border border-blue-500/40 bg-[#0a0a0f]/95 p-4 text-white shadow-[0_0_30px_rgba(59,130,246,0.25)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Download className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">
                  Download Started!
                </span>
                <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  FREE
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium font-mono truncate max-w-[220px]">
                {activeDownload.quant.filename}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick details */}
        <div className="mt-3 rounded-2xl bg-zinc-950/80 p-3 text-xs space-y-2 border border-white/5 shadow-inner">
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span>Format: <strong className="text-white">{activeDownload.quant.format}</strong></span>
            <span>Size: <strong className="text-cyan-400">{activeDownload.quant.size}</strong></span>
          </div>

          <div className="pt-1.5 border-t border-white/5">
            <p className="text-[11px] text-zinc-400 mb-1">
              Or run instantly via terminal:
            </p>
            <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 rounded-xl font-mono text-[11px] text-emerald-400 border border-white/5">
              <span className="truncate mr-2">{activeDownload.model.ollamaCommand}</span>
              <button onClick={copyCmd} className="text-zinc-400 hover:text-white shrink-0 cursor-pointer">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Manifest download triggered
          </span>
          <button
            onClick={onClose}
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
