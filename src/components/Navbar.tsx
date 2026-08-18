import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Terminal, 
  Check, 
  Copy, 
  Search,
  Globe2,
  Rocket,
  Plus
} from 'lucide-react';
import { MODELS_DATA } from '../data/models';
import { ModelScope } from '../types';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  selectedScope: ModelScope | 'all';
  setSelectedScope: (scope: ModelScope | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalDownloads: string;
  onScrollToModels: () => void;
  onOpenAddModelModal: () => void;
  onOpenSocialModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  selectedScope,
  setSelectedScope,
  searchQuery,
  setSearchQuery,
  totalDownloads,
  onScrollToModels,
  onOpenAddModelModal,
  onOpenSocialModal
}) => {
  const [copiedBatch, setCopiedBatch] = useState(false);

  const copyAllOllama = () => {
    const commands = MODELS_DATA.map(m => m.ollamaCommand).join('\n');
    navigator.clipboard.writeText(commands);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2200);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setSelectedScope('all');
              onScrollToModels();
            }} 
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            id="nav-brand-btn"
          >
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl border border-blue-500/30 bg-zinc-900 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-transform group-hover:scale-105">
              <img 
                src="/favicon.png" 
                alt="OpenLLM Hub Logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-base sm:text-lg tracking-tight">
                  OpenLLM Hub
                </span>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Public & Custom AI Models Repository
              </p>
            </div>
          </button>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="nav-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models (Llama 3.3, DeepSeek-R1, BanglaLlama, Qwen)..."
              className="w-full rounded-full border border-white/10 bg-zinc-900/60 py-1.5 pl-9 pr-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-zinc-900/90 focus:outline-none transition-all shadow-inner backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items & Scope Switcher */}
        <nav className="flex items-center gap-2">
          
          {/* Quick Scope Switcher */}
          <div className="hidden lg:flex items-center rounded-xl bg-zinc-900/80 p-1 border border-white/10 text-xs">
            <button
              onClick={() => {
                setSelectedScope('all');
                onScrollToModels();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScope === 'all' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedScope('public');
                onScrollToModels();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScope === 'public' ? 'bg-sky-600 text-white' : 'text-zinc-400 hover:text-sky-300'
              }`}
            >
              <Globe2 className="h-3 w-3 text-sky-400" />
              <span>Public LLM</span>
            </button>
            <button
              onClick={() => {
                setSelectedScope('my_llm');
                onScrollToModels();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedScope === 'my_llm' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-purple-300'
              }`}
            >
              <Rocket className="h-3 w-3 text-purple-400" />
              <span>My LLM</span>
            </button>
          </div>

          {/* Add Custom Model Button */}
          <button
            onClick={onOpenAddModelModal}
            className="hidden sm:flex items-center gap-1 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
            title="Register your custom fine-tuned model"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add My LLM</span>
          </button>

          {/* Creator Profile Button */}
          <button
            id="nav-creator-social-btn"
            onClick={onOpenSocialModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-white px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Creator: Preatom YT (Social Media Links)"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Preatom YT</span>
          </button>

          {/* Copy All Ollama Commands Quick Action */}
          <button
            id="nav-copy-all-btn"
            onClick={copyAllOllama}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer"
          >
            {copiedBatch ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-emerald-200">Commands Copied!</span>
              </>
            ) : (
              <>
                <Terminal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy All Ollama</span>
                <span className="sm:hidden">Ollama</span>
              </>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
};
