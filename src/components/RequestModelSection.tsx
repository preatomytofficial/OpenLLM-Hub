import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Send, 
  CheckCircle2
} from 'lucide-react';

export const RequestModelSection: React.FC = () => {
  const [modelName, setModelName] = useState('');
  const [baseArch, setBaseArch] = useState('Qwen 2.5');
  const [useCase, setUseCase] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName.trim() || !useCase.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="request-model-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/60 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-xs font-semibold text-pink-300 mb-3 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <MessageSquarePlus className="h-3.5 w-3.5 text-pink-400" />
              <span>Community Fine-Tuning Requests</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Need a Custom Fine-Tuned LLM?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Submit your domain requirement (e.g. Legal, Medical, Financial, Specialized Indic NLP) and our lab will train and release GGUF quantizations for free.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-3 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Request Submitted Successfully!
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                Thank you! Your request has been queued for data ingestion and fine-tuning. Check back on the hub for the release.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setModelName('');
                  setUseCase('');
                }}
                className="mt-2 text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Desired Model Name / Domain:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BanglaLegal-14B or Medical QA"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Preferred Base Architecture:
                  </label>
                  <select
                    value={baseArch}
                    onChange={(e) => setBaseArch(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Qwen 2.5">Qwen 2.5 (3B / 7B / 14B / 32B)</option>
                    <option value="Llama 3.3">Llama 3.3 (8B / 70B)</option>
                    <option value="Gemma 2">Google Gemma 2 (2B / 9B / 27B)</option>
                    <option value="DeepSeek R1">DeepSeek R1 Distill</option>
                    <option value="Mistral">Mistral NeMo / Small</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Describe the Use-Case & Dataset Requirements:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain what this model should excel at and why it is needed..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Your Email or GitHub Username (Optional):
                </label>
                <input
                  type="text"
                  placeholder="name@example.com or @github_user"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Model Request</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
