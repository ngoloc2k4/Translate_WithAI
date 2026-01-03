// Translation Providers Types
export enum Provider {
  DEEPL = 'deepl',
  GOOGLE = 'google',
  LIBRE = 'libre',
  GEMINI = 'gemini',
  OPENROUTER = 'openrouter',
  NVIDIA = 'nvidia',
}

export enum Mode {
  DEFAULT = 'default',
  VOCABULARY = 'vocabulary',
  PARALLEL = 'parallel',
  SUMMARY = 'summary',
  MIXED = 'mixed',
}

export enum Tone {
  FORMAL = 'formal',
  CASUAL = 'casual',
  HUMOROUS = 'humorous',
  PROFESSIONAL = 'professional',
  POETIC = 'poetic',
  SLANG = 'slang',
}

export enum CreativityLevel {
  NORMAL = 'normal',      // temperature 0.0-0.2
  BALANCED = 'balanced',  // temperature 0.5
  CREATIVE = 'creative',  // temperature 0.8-1.0
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode: Mode;
  tone: Tone;
  creativity: CreativityLevel;
  basicProvider?: Provider;
  aiProvider?: Provider;
  allVersions?: boolean;
  apiKey?: string;
}

export interface TranslationResponse {
  basicTranslation: string;
  aiTranslations?: {
    normal?: string;
    balanced?: string;
    creative?: string;
  };
  insights?: Flashcard[];
  metadata?: {
    sourceLanguage: string;
    targetLanguage: string;
    mode: Mode;
    tone: Tone;
    timestamp: string;
  };
}

export interface Flashcard {
  word: string;
  pronunciation?: string;
  meaning: string;
  explanation: string;
  example: string;
}

export interface HistoryEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode: Mode;
  tone: Tone;
  timestamp: string;
  basicProvider: Provider;
  aiProvider?: Provider;
}
