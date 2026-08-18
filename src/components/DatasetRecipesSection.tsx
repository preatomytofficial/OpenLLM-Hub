import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Sparkles, 
  Check, 
  Copy 
} from 'lucide-react';

const DATASETS = [
  {
    id: 'bangla-synthetic-qa',
    name: 'Bangla-Alpaca-Instruct-500K',
    records: '520,000 Conversations',
    tokens: '680 Million Tokens',
    domain: 'General Instruction & Bengali QA',
    license: 'CC-BY-4.0',
    description: 'High-quality translated and synthetically verified instruction pairs covering Bengali literature, history, law, culture, and science.',
    format: 'JSONL / Parquet',
    hfUrl: 'https://huggingface.co/datasets/rongon/bangla-alpaca-500k',
    sample: `{"instruction": "রবীন্দ্রনাথ ঠাকুরের রচিত গীতাঞ্জলি কাব্যের মূল বিষয়বস্তু কী?", "response": "রবীন্দ্রনাথ ঠাকুরের রচিত 'গীতাঞ্জলি' মূলত একটি ভক্তিমূলক ও আধ্যাত্মিক কাব্যগ্রন্থ। এতে ঈশ্বরের সাথে মানুষের নিবিড় আত্মিক সম্পর্ক, প্রকৃতির অপার সৌন্দর্য এবং মানবজীবনের অনুভূতির প্রকাশ ঘটেছে।"}`
  },
  {
    id: 'bangla-code-alpaca',
    name: 'DevBengali-CodeInstruct-150K',
    records: '150,000 Code Snippets',
    tokens: '320 Million Tokens',
    domain: 'Python, TypeScript, SQL, Algorithms with Bangla Docs',
    license: 'Apache 2.0',
    description: 'Full-stack programming challenges, bug fixes, algorithmic problem solving with step-by-step Bengali code comments.',
    format: 'JSONL',
    hfUrl: 'https://huggingface.co/datasets/rongon/devbengali-code-150k',
    sample: `{"instruction": "পাইথনে একটি লিস্টের সব ডুপ্লিকেট আইটেম রিমুভ করার ফাংশন লিখুন।", "response": "def remove_duplicates(lst):\\n    # set ব্যবহার করে সহজে ডুপ্লিকেট দূর করা যায়\\n    return list(dict.fromkeys(lst))\\n\\n# উদাহরণ:\\nnums = [1, 2, 2, 3, 4, 4, 5]\\nprint(remove_duplicates(nums))  # আউটপুট: [1, 2, 3, 4, 5]"}`
  },
  {
    id: 'mukti-gsm8k-bn',
    name: 'Mukti-GSM8K-Math-Bengali',
    records: '45,000 Word Problems',
    tokens: '95 Million Tokens',
    domain: 'Chain-of-Thought Mathematical Reasoning',
    license: 'MIT',
    description: 'Mathematical problem-solving dataset adapted into Bengali with step-by-step thinking tags (<think>...</think>).',
    format: 'JSONL',
    hfUrl: 'https://huggingface.co/datasets/rongon/mukti-gsm8k-bn',
    sample: `{"instruction": "রহিমের কাছে ১২টি আম ছিল। সে করিমকে ৪টি এবং সজলকে ৩টি আম দিল। এখন রহিমের কাছে কয়টি আম রইল?", "response": "<think>মোট আম = ১২। দেওয়া হলো = ৪ + ৩ = ৭। অবশিষ্ট = ১২ - ৭ = ৫।</think>রহিমের কাছে এখন ৫টি আম রইল।"}`
  }
];

const RECIPES = [
  {
    title: 'LoRA / QLoRA 4-bit Fine-Tuning Setup',
    framework: 'Unsloth + PyTorch + Transformers',
    gpu: '1x NVIDIA A100 (80GB) or RTX 4090',
    code: `from unsloth import FastLanguageModel
import torch

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen2.5-7B",
    max_seq_length=4096,
    load_in_4bit=True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
)`
  }
];

export const DatasetRecipesSection: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState(DATASETS[0]);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="datasets-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Database className="h-3.5 w-3.5 text-purple-400" />
            <span>Open Training Data & Recipes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Fine-Tuning Datasets & Training Code
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Full transparency: inspect curated open datasets and replicate the training pipeline using our open Unsloth and PyTorch training scripts.
          </p>
        </div>

        {/* Datasets Cards & Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Datasets List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Open Source Datasets:
            </h3>
            {DATASETS.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDataset.id === ds.id
                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'border-white/5 bg-zinc-900/50 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${selectedDataset.id === ds.id ? 'text-purple-300' : 'text-white'}`}>
                    {ds.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-white/5">
                    {ds.license}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{ds.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                  <span>{ds.records}</span>
                  <span>•</span>
                  <span>{ds.tokens}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dataset Detail & JSONL Preview (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{selectedDataset.name}</h4>
                <p className="text-xs text-zinc-400">{selectedDataset.domain}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([selectedDataset.sample], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDataset.id}-sample.jsonl`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Sample JSONL</span>
                </button>
              </div>
            </div>

            {/* JSONL Sample Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Sample Record Preview (JSONL):</span>
                <button
                  onClick={() => copyCode(selectedDataset.sample, 'ds-sample')}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white font-mono cursor-pointer"
                >
                  {copied === 'ds-sample' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'ds-sample' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-cyan-300 border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedDataset.sample}
              </pre>
            </div>

            {/* Training Recipe Snippet */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Unsloth LoRA Fine-Tuning Recipe
                </span>
                <button
                  onClick={() => copyCode(RECIPES[0].code, 'recipe')}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white font-mono cursor-pointer"
                >
                  {copied === 'recipe' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'recipe' ? 'Copied' : 'Copy Python'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-amber-300/90 border border-white/5 overflow-x-auto whitespace-pre leading-relaxed">
                {RECIPES[0].code}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
