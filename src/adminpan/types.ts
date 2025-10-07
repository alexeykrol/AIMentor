export interface AdminConfig {
  aiProvider: string;
  aiProvider: string;
  apiKey: string;
  analysisQuestions: number;
  guestQuestions: number;
}

export interface ConfigFormData {
  aiProvider: string;
  apiKey: string;
  aiModel: string;
  analysisQuestions: number;
  guestQuestions: number;
}

export const AI_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google' },
  { value: 'meta', label: 'Meta' },
  { value: 'mistral', label: 'Mistral AI' },
] as const;

export const AI_MODELS_BY_PROVIDER = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  google: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' },
  ],
  meta: [
    { value: 'llama-2-70b', label: 'Llama 2 70B' },
    { value: 'llama-2-13b', label: 'Llama 2 13B' },
  ],
  mistral: [
    { value: 'mistral-large', label: 'Mistral Large' },
    { value: 'mistral-medium', label: 'Mistral Medium' },
  ],
} as const;