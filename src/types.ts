export type ModelCategory = 
  | 'all'
  | 'huggingface-llm'
  | 'bengali-indic'
  | 'coding'
  | 'reasoning'
  | 'edge-lightweight'
  | 'vision'
  | 'medical-specialized'
  | 'general-chat';

export type ModelScope = 'all' | 'public' | 'my_llm';

export type QuantizationFormat = 
  | 'GGUF Q4_K_M'
  | 'GGUF Q5_K_M'
  | 'GGUF Q8_0'
  | 'Safetensors (FP16)'
  | 'AWQ 4-bit'
  | 'ONNX Runtime';

export interface QuantizationOption {
  format: QuantizationFormat;
  size: string;
  bytes: number;
  filename: string;
  downloadUrl: string;
  recommendedVram: string;
  recommendedFor: string;
  isPopular?: boolean;
}

export interface ModelBenchmark {
  mmlu: number; // Percentage e.g. 78.4
  codingHumanEval: number; // e.g. 82.1
  mathGsm8k: number; // e.g. 85.3
  banglaNlpScore: number; // e.g. 91.2
  reasoningArc: number; // e.g. 84.6
  tokensPerSec: number; // e.g. 65
}

export interface SamplePrompt {
  id: string;
  title: string;
  titleBn?: string;
  prompt: string;
  promptBn?: string;
  systemPrompt?: string;
  response: string;
  responseBn?: string;
  thinkingProcess?: string;
  category: string;
}

export interface LLMModel {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  taglineBn?: string;
  description: string;
  descriptionBn?: string;
  creator: string;
  avatarIcon: string;
  baseArchitecture: string;
  parameterSize: string;
  paramNumber: number; // in billions e.g. 8
  category: ModelCategory;
  modelScope: 'public' | 'my_llm';
  contextWindow: string;
  license: string;
  releaseDate: string;
  downloadsCount: number;
  likesCount: number;
  rating: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  benchmarks: ModelBenchmark;
  minVramGb: number;
  recommendedVramGb: number;
  minCpuRamGb: number;
  quantizations: QuantizationOption[];
  ollamaCommand: string;
  huggingFaceRepo: string;
  pythonSnippet: string;
  samplePrompts: SamplePrompt[];
  tags: string[];
  features: string[];
  featuresBn?: string[];
  trainingTokens: string;
}

export interface HardwarePreset {
  id: string;
  name: string;
  vramGb: number;
  ramGb: number;
  deviceType: 'gpu' | 'mac' | 'cpu';
  icon: string;
}
