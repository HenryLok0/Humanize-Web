export enum HumanizationLevel {
  Light = 'Light',
  Medium = 'Medium',
  Heavy = 'Heavy',
}

export enum WritingMode {
  General = 'General',
  Professional = 'Professional',
}

export interface AnalysisResult {
  aiScore: number; // 0-100
  readabilityScore: number; // 0-100
  wordCount: number;
  sentenceCount: number;
  suggestions: string[];
  flaggedPhrases: { phrase: string; reason: string }[];
}

export interface TextStats {
  chars: number;
  words: number;
  sentences: number;
}