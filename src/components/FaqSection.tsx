import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is GGUF and why is it recommended for local inference?',
    a: 'GGUF (GPT-Generated Unified Format) is the modern open file format developed by Georgi Gerganov and the llama.cpp community. It encapsulates quantized neural network weights, metadata, and tokenizers into a single file designed for high-throughput execution on CPUs (using AVX2/AVX-512) and GPU VRAM offloading (CUDA, Apple Metal, and ROCm).'
  },
  {
    q: 'How do I resolve "CUDA Out of Memory" (OOM) errors?',
    a: '1) Select a 4-bit quantization format such as Q4_K_M instead of Q8_0 or FP16.\n2) In LM Studio or llama.cpp, reduce the GPU offload layer count (e.g. from 33 layers down to 20 layers) to let your system RAM handle remaining tensors.\n3) Reduce the context window length from 32k down to 4096 or 8192 tokens.'
  },
  {
    q: 'Can I use these models for commercial projects, startups, and SaaS products?',
    a: 'Yes. All fine-tuned models hosted on this platform are distributed under permissive open licenses (Apache 2.0 or MIT, inheriting from base model permissions). You are 100% free to build commercial SaaS backends, enterprise chatbots, mobile applications, and proprietary tools with zero licensing fees.'
  },
  {
    q: 'How can I connect these models to LangChain, LlamaIndex, or AutoGen?',
    a: 'Run Ollama, vLLM, or llama-server in the background. Ollama automatically exposes an OpenAI-compatible REST API at http://localhost:11434/v1. In LangChain, simply initialize ChatOpenAI(base_url="http://localhost:11434/v1", api_key="ollama", model="sonar-bangla-8b").'
  },
  {
    q: 'How are the Bengali & Multi-domain benchmarks evaluated?',
    a: 'Our standardized evaluation harness assesses multi-turn contextual coherence, factual question answering on South Asian literature and science, grammar parsing, translation BLEU scores, and mathematical reasoning step accuracy using zero-shot and 5-shot prompt templates.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-300 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Everything you need to know about GGUF quantizations, memory optimization, commercial licensing, and offline setups.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <div className="ml-4 shrink-0 text-zinc-400">
                    {isOpen ? <ChevronUp className="h-5 w-5 text-cyan-400" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 whitespace-pre-line">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
