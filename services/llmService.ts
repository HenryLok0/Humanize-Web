import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

// Using a lightweight but capable model for browser usage
// Llama-3.2-3B is better for understanding context than 1B
const SELECTED_MODEL = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

let engine: MLCEngine | null = null;

export interface LLMStatus {
  status: 'idle' | 'loading' | 'ready' | 'error';
  progress: string;
  progressValue: number; // 0-1
}

type ProgressCallback = (status: LLMStatus) => void;

export const initLLM = async (onProgress: ProgressCallback): Promise<MLCEngine> => {
  if (engine) {
    onProgress({ status: 'ready', progress: 'AI Model Ready', progressValue: 1 });
    return engine;
  }

  try {
    onProgress({ status: 'loading', progress: 'Initializing AI Engine...', progressValue: 0 });
    
    engine = await CreateMLCEngine(SELECTED_MODEL, {
      initProgressCallback: (report) => {
        // Parse progress from report.text (e.g., "Loading model... 50%")
        // This is a rough estimation as report.text varies
        console.log(report.text);
        
        // Simple heuristic for progress bar based on text
        let val = 0.1;
        if (report.text.includes("Fetching")) val = 0.3;
        if (report.text.includes("Loading")) val = 0.6;
        if (report.text.includes("Finish")) val = 1;

        onProgress({ 
            status: 'loading', 
            progress: report.text, 
            progressValue: val 
        });
      }
    });

    onProgress({ status: 'ready', progress: 'AI Model Ready', progressValue: 1 });
    return engine;
  } catch (err) {
    console.error("LLM Init Error:", err);
    onProgress({ status: 'error', progress: 'Failed to load AI model. WebGPU might not be supported.', progressValue: 0 });
    throw err;
  }
};

export const getLLM = () => engine;

export const generateHumanizedText = async (
  text: string, 
  level: string, 
  mode: string
): Promise<string> => {
  if (!engine) throw new Error("AI Engine not initialized");

  const systemPrompt = `You are an expert human writer and editor. Your goal is to rewrite the provided text to sound completely natural, human, and authentic, as if a real person wrote it from scratch.

  CRITICAL INSTRUCTIONS:
  1.  **Deep Understanding**: First, fully understand the core meaning, intent, and emotional tone of the original text. Do not just swap synonyms.
  2.  **Human Perspective**: Rewrite the text from a human perspective. If the text is a personal story, make it feel personal. If it's professional, make it sound authoritative but not robotic.
  3.  **Remove AI Patterns**: Eliminate all "AI-isms" (e.g., "In conclusion," "It is important to note," "delve," "tapestry," perfectly uniform sentence lengths).
  4.  **Configuration**:
      - **Level: ${level}**:
          - *Light*: Polish the text but keep the structure.
          - *Medium*: Rephrase sentences for better flow and naturalness.
          - *Heavy*: Completely reimagine the structure and vocabulary for maximum human appeal.
      - **Mode: ${mode}**:
          - *General*: Use contractions (can't, don't), idioms, and a conversational tone.
          - *Professional*: Clear, direct, and impactful business/academic language.

  5.  **Output Format**:
      - Output **ONLY** the rewritten text.
      - Do **NOT** wrap the output in quotes.
      - Do **NOT** add any intro/outro (e.g., NO "Here is the rewritten version").
      - Do **NOT** add any explanations at the end.
  `;

  const userPrompt = `Original Text:\n"${text}"\n\nRewritten Text:`;

  try {
    const reply = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: level === 'Heavy' ? 0.85 : level === 'Medium' ? 0.7 : 0.6,
      max_tokens: 2048,
    });

    let content = reply.choices[0].message.content || "";
    
    // Post-processing to remove quotes and conversational filler
    content = content.trim();
    
    // Remove surrounding quotes
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }

    // Remove common prefixes
    const prefixesToRemove = [
      "Here is the rewritten text:",
      "Here is a rewritten version:",
      "Here's a rewritten version:",
      "Rewritten Text:",
      "Sure, here is the text:",
      "Here is the text:"
    ];

    const lines = content.split('\n');
    if (lines.length > 0) {
        const firstLine = lines[0].trim();
        for (const prefix of prefixesToRemove) {
            if (firstLine.toLowerCase().startsWith(prefix.toLowerCase())) {
                lines.shift(); // Remove the first line
                break;
            }
        }
    }

    // Remove common suffixes (often in parentheses)
    if (lines.length > 0) {
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine.startsWith('(') && lastLine.endsWith(')')) {
            lines.pop();
        }
    }

    content = lines.join('\n').trim();
    
    // Double check quotes again after stripping lines
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }

    return content;
  } catch (err) {
    console.error("Generation Error:", err);
    throw new Error("Failed to generate text.");
  }
};

export const generateAIText = async (text: string): Promise<string> => {
  if (!engine) throw new Error("AI Engine not initialized");

  const systemPrompt = `You are a highly advanced AI writing assistant. Your task is to rewrite the user's text to sound professional, structured, precise, and polished.
  
  Guidelines:
  - Use formal, academic, or business-appropriate vocabulary.
  - Ensure perfect grammar and syntax.
  - Structure the text logically (e.g., using bullet points if appropriate, or clear paragraph transitions).
  - The tone should be objective, authoritative, and efficient.
  - Output **ONLY** the rewritten text. No intro/outro.
  `;

  const userPrompt = `Original Text:\n"${text}"\n\nFormal Rewritten Text:`;

  try {
    const reply = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more deterministic/formal output
      max_tokens: 2048,
    });

    let content = reply.choices[0].message.content || "";
    
    // Post-processing
    content = content.trim();
    if (content.startsWith('"') && content.endsWith('"')) {
      content = content.slice(1, -1);
    }
    
    // Remove common prefixes
    const prefixesToRemove = [
        "Here is the formal version:",
        "Here is the rewritten text:",
        "Formal Rewritten Text:"
    ];
    const lines = content.split('\n');
    if (lines.length > 0) {
        const firstLine = lines[0].trim();
        for (const prefix of prefixesToRemove) {
            if (firstLine.toLowerCase().startsWith(prefix.toLowerCase())) {
                lines.shift();
                break;
            }
        }
    }
    content = lines.join('\n').trim();

    return content;
  } catch (err) {
    console.error("Generation Error:", err);
    throw new Error("Failed to generate text.");
  }
};

export const analyzeTextWithLLM = async (text: string): Promise<string> => {
    if (!engine) throw new Error("AI Engine not initialized");

    const systemPrompt = `You are an AI content detector and writing analyst. Analyze the following text.
    Provide a JSON response with the following fields:
    - aiProbability: number (0-100)
    - readabilityScore: number (0-100)
    - suggestions: string[] (list of 3 specific improvements)
    - toneAnalysis: string (brief description of the tone)
    
    Output ONLY valid JSON. No markdown formatting.`;

    try {
        const reply = await engine.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            temperature: 0.1, // Low temp for consistent analysis
            response_format: { type: "json_object" }
        });

        return reply.choices[0].message.content || "{}";
    } catch (err) {
        console.error("Analysis Error:", err);
        throw err;
    }
}
