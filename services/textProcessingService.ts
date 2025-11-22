import { HumanizationLevel, WritingMode, AnalysisResult } from '../types';

// Heuristics for "AI-sounding" words
const AI_TRIGGER_WORDS = [
  "delve", "landscape", "tapestry", "nuance", "leverage", "utilize", 
  "harness", "unleash", "paramount", "crucial", "pivotal", "foster", 
  "game-changer", "transformative", "meticulous", "comprehensive", 
  "realm", "underscore", "highlight", "moreover", "furthermore", 
  "consequently", "seamlessly", "robust", "paradigm"
];

// Replacement dictionaries
const GENERAL_SYNONYMS: Record<string, string> = {
  "utilize": "use",
  "leverage": "use",
  "facilitate": "help",
  "demonstrate": "show",
  "subsequently": "later",
  "nevertheless": "but",
  "furthermore": "also",
  "moreover": "plus",
  "commence": "start",
  "terminate": "end",
  "endeavor": "try",
  "approximately": "about",
  "purchase": "buy",
  "require": "need",
  "obtain": "get",
  "seamlessly": "smoothly",
  "robust": "strong",
  "paramount": "key",
  "crucial": "vital",
  "unleash": "release",
  "harness": "control",
  "delve": "dig",
};

const PROFESSIONAL_SYNONYMS: Record<string, string> = {
  "get": "obtain",
  "buy": "purchase",
  "bad": "suboptimal",
  "good": "beneficial",
  "fix": "rectify",
  "ask": "inquire",
  "need": "require",
  "start": "initiate",
  "end": "conclude",
  "help": "assist",
  "try": "attempt",
  "use": "leverage",
  "maybe": "perhaps",
  "really": "significantly",
  "very": "highly",
  "think": "believe",
  "make": "generate",
  "give": "provide",
  "keep": "maintain",
  "show": "demonstrate",
  "tell": "inform",
  "fast": "expedited",
  "slow": "gradual",
  "change": "modify",
  "idea": "concept",
  "problem": "challenge",
  "result": "outcome",
};

// Helper to count stats
export const getStats = (text: string) => {
  const chars = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  return { chars, words, sentences };
};

// Mock Analysis Logic
export const analyzeText = (text: string): AnalysisResult => {
  const stats = getStats(text);
  if (stats.words === 0) {
    return {
      aiScore: 0,
      readabilityScore: 100,
      wordCount: 0,
      sentenceCount: 0,
      suggestions: [],
      flaggedPhrases: []
    };
  }

  let aiTriggersFound = 0;
  const flaggedPhrases: { phrase: string; reason: string }[] = [];
  const lowerText = text.toLowerCase();

  AI_TRIGGER_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const match = text.match(regex);
    if (match) {
      aiTriggersFound += match.length;
      if (!flaggedPhrases.find(p => p.phrase === word)) {
        flaggedPhrases.push({ phrase: word, reason: "Commonly overused by AI." });
      }
    }
  });

  // Calculate Sentence Variance (AI tends to be very uniform)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
  const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / (sentenceLengths.length || 1);
  
  // High AI score if: Low variance (uniform sentences) OR High trigger words
  let aiScoreRaw = (aiTriggersFound / stats.words) * 300; // Density factor
  if (variance < 10) aiScoreRaw += 20; // Uniform sentences penalty
  if (variance > 50) aiScoreRaw -= 10; // Human variance bonus

  const aiScore = Math.min(Math.max(Math.round(aiScoreRaw), 5), 99);
  const readabilityScore = Math.max(100 - (avgLength * 2), 10); // Simple heuristic

  const suggestions: string[] = [];
  if (aiTriggersFound > 2) suggestions.push("Reduce the use of complex, 'buzzword' vocabulary.");
  if (variance < 15) suggestions.push("Vary your sentence structure. Mix short and long sentences.");
  if (avgLength > 25) suggestions.push("Your sentences are quite long. Try breaking them up.");
  if (stats.words < 20) suggestions.push("Text is too short for accurate analysis.");

  return {
    aiScore,
    readabilityScore: Math.round(readabilityScore),
    wordCount: stats.words,
    sentenceCount: stats.sentences,
    suggestions,
    flaggedPhrases
  };
};

// Mock Humanization Logic
export const humanizeText = (
  text: string, 
  level: HumanizationLevel, 
  mode: WritingMode
): string => {
  let processedText = text;
  
  // 1. Word Replacement Strategy
  const dict = mode === WritingMode.General ? GENERAL_SYNONYMS : PROFESSIONAL_SYNONYMS;
  
  // Factor for how many words to replace based on level
  const replacementChance = level === HumanizationLevel.Light ? 0.3 : level === HumanizationLevel.Medium ? 0.6 : 0.9;

  Object.keys(dict).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    processedText = processedText.replace(regex, (match) => {
      return Math.random() < replacementChance ? dict[key] : match;
    });
  });

  // 2. Structural Changes (Heavy Level only)
  if (level === HumanizationLevel.Heavy) {
    const sentences = processedText.split('. ');
    
    if (mode === WritingMode.General) {
        processedText = sentences.map(s => {
            if (Math.random() < 0.25 && s.length > 10) {
                const fillers = ["Honestly,", "Basically,", "You know,", "Look,", "To be fair,", "Actually,"];
                const filler = fillers[Math.floor(Math.random() * fillers.length)];
                return `${filler} ${s.charAt(0).toLowerCase() + s.slice(1)}`;
            }
            return s;
        }).join('. ');
    } else if (mode === WritingMode.Professional) {
        processedText = sentences.map(s => {
            if (Math.random() < 0.2 && s.length > 15) {
                const transitions = ["Furthermore,", "Consequently,", "In addition,", "Moreover,", "Therefore,", "Notably,"];
                const trans = transitions[Math.floor(Math.random() * transitions.length)];
                return `${trans} ${s.charAt(0).toLowerCase() + s.slice(1)}`;
            }
            return s;
        }).join('. ');
    }
  }

  // 3. Contractions (General Mode only)
  if (mode === WritingMode.General) {
     processedText = processedText
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bis not\b/gi, "isn't")
        .replace(/\bwe are\b/gi, "we're")
        .replace(/\bthey are\b/gi, "they're")
        .replace(/\bit is\b/gi, "it's");
  }

  return processedText;
};