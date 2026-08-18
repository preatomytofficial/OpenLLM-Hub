import React, { useState } from 'react';
import { LLMModel } from '../types';
import { 
  Server, 
  Terminal, 
  Code2, 
  Check, 
  Copy 
} from 'lucide-react';

interface LocalServerGuideSectionProps {
  models: LLMModel[];
}

export const LocalServerGuideSection: React.FC<LocalServerGuideSectionProps> = ({ models }) => {
  const [selectedModel, setSelectedModel] = useState<LLMModel>(models[0]);
  const [serverType, setServerType] = useState<'ollama' | 'vllm' | 'llamacpp'>('ollama');
  const [clientLang, setClientLang] = useState<'python' | 'curl' | 'js'>('python');
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getServerCommand = () => {
    if (serverType === 'ollama') {
      return `# 1. Run Ollama server with OpenAI-compatible API\n${selectedModel.ollamaCommand}\n\n# API base URL: http://localhost:11434/v1`;
    }
    if (serverType === 'vllm') {
      return `# High-Throughput vLLM Server (NVIDIA GPU)\npip install vllm\npython3 -m vllm.entrypoints.openai.api_server \\\n  --model ${selectedModel.huggingFaceRepo} \\\n  --port 8000 \\\n  --max-model-len 4096 \\\n  --gpu-memory-utilization 0.90`;
    }
    return `# llama-server (GGUF CPU/GPU)\n./llama-server \\\n  -m ${selectedModel.quantizations[0].filename} \\\n  --port 8080 \\\n  -c 4096 \\\n  -ngl 33`;
  };

  const getClientSnippet = () => {
    const port = serverType === 'ollama' ? '11434' : serverType === 'vllm' ? '8000' : '8080';
    const modelName = serverType === 'ollama' ? selectedModel.slug : selectedModel.huggingFaceRepo;

    if (clientLang === 'python') {
      return `from openai import OpenAI

# Connect to local OpenAI-compatible API endpoint
client = OpenAI(
    base_url="http://localhost:${port}/v1",
    api_key="not-needed-for-local"
)

response = client.chat.completions.create(
    model="${modelName}",
    messages=[
        {"role": "system", "content": "You are a helpful AI assistant specialized in Bengali and Coding."},
        {"role": "user", "content": "Explain machine learning and provide a practical code example."}
    ],
    temperature=0.7,
    stream=True
)

for chunk in response:
    content = chunk.choices[0].delta.content or ""
    print(content, end="", flush=True)`;
    }

    if (clientLang === 'curl') {
      return `curl http://localhost:${port}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelName}",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing algorithms"}
    ],
    "temperature": 0.7
  }'`;
    }

    return `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:${port}/v1",
  apiKey: "not-needed-for-local",
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "${modelName}",
    messages: [
      { role: "user", content: "What are the core capabilities of this model?" }
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();`;
  };

  return (
    <section id="api-server-section" className="py-12 sm:py-16 bg-transparent border-b border-white/5 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span>OpenAI-Compatible Local API Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Host Your Own AI API Server
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Plug these open-source models directly into LangChain, LlamaIndex, Next.js, or mobile applications via standard OpenAI client libraries with zero API bills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
          
          {/* Server Config (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                1. Select AI Model:
              </label>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const found = models.find((m) => m.id === e.target.value);
                  if (found) setSelectedModel(found);
                }}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.parameterSize})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                2. Select Server Backend:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ollama', name: 'Ollama' },
                  { id: 'vllm', name: 'vLLM (GPU)' },
                  { id: 'llamacpp', name: 'llama.cpp' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServerType(s.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      serverType === s.id
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'border-white/5 bg-zinc-950/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Server Command Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  Run Server Command
                </span>
                <button
                  onClick={() => copyCode(getServerCommand(), 'server-cmd')}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                >
                  {copied === 'server-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'server-cmd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-emerald-400 border border-white/5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {getServerCommand()}
              </pre>
            </div>

          </div>

          {/* Client SDK Integration Snippet (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-cyan-400" />
                Connect via Client Code
              </span>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 rounded-xl bg-zinc-950 p-1 border border-white/5">
                {(['python', 'curl', 'js'] as const).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => setClientLang(langKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      clientLang === langKey
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {langKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Standard OpenAI Protocol Client:</span>
                <button
                  onClick={() => copyCode(getClientSnippet(), 'client-code')}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-mono cursor-pointer"
                >
                  {copied === 'client-code' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'client-code' ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-zinc-950 font-mono text-xs text-cyan-300 border border-white/5 overflow-x-auto whitespace-pre leading-relaxed">
                {getClientSnippet()}
              </pre>
            </div>

            <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3.5 text-xs text-blue-200">
              <p className="font-semibold text-white">Zero Cloud Dependencies:</p>
              <p className="text-zinc-300 mt-0.5">
                All requests process 100% locally on your machine with 0 telemetry and infinite rate limits.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
