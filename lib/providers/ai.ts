import { Mode, Tone, CreativityLevel, Flashcard } from '../types';

export interface AIProviderConfig {
  apiKey: string;
  model?: string;
}

function getCreativityTemperature(level: CreativityLevel): number {
  switch (level) {
    case CreativityLevel.NORMAL:
      return 0.1;
    case CreativityLevel.BALANCED:
      return 0.5;
    case CreativityLevel.CREATIVE:
      return 0.9;
    default:
      return 0.5;
  }
}

function getToneInstruction(tone: Tone): string {
  const toneMap: Record<Tone, string> = {
    [Tone.FORMAL]: 'Use formal and professional language with proper grammar.',
    [Tone.CASUAL]: 'Use casual, friendly, and conversational language.',
    [Tone.HUMOROUS]: 'Add humor and witty touches while maintaining clarity.',
    [Tone.PROFESSIONAL]: 'Use professional, polished language suitable for business contexts.',
    [Tone.POETIC]: 'Use poetic, artistic language with metaphors and expressive style.',
    [Tone.SLANG]: 'Use modern slang and colloquial expressions.',
  };
  return toneMap[tone] || toneMap[Tone.FORMAL];
}

function getModeInstruction(mode: Mode): string {
  const modeMap: Record<Mode, string> = {
    [Mode.DEFAULT]: 'Provide a natural, fluent translation.',
    [Mode.VOCABULARY]: 'Analyze key vocabulary and provide learning insights.',
    [Mode.PARALLEL]: 'Create a side-by-side parallel translation preserving structure.',
    [Mode.SUMMARY]: 'Summarize the content concisely while maintaining meaning.',
    [Mode.MIXED]: 'Preserve technical/domain-specific terms while translating.',
  };
  return modeMap[mode] || modeMap[Mode.DEFAULT];
}

export function buildSystemPrompt(
  mode: Mode,
  tone: Tone,
  sourceLanguage: string,
  targetLanguage: string
): string {
  return `You are an expert translator and language educator.

Translation Task:
- Source Language: ${sourceLanguage}
- Target Language: ${targetLanguage}
- Mode: ${mode}
- Tone: ${getToneInstruction(tone)}
- Mode Instruction: ${getModeInstruction(mode)}

${mode === Mode.VOCABULARY ? `
Output JSON format:
{
  "translation": "translated text",
  "flashcards": [
    {
      "word": "term in source language",
      "pronunciation": "IPA or romanization",
      "meaning": "definition in target language",
      "explanation": "context/cultural/etymology",
      "example": "usage example"
    }
  ]
}
` : 'Provide the translation directly.'}

${mode === Mode.MIXED ? 'Preserve technical terms (IT, medical, scientific) with original form.' : ''}

Always ensure accuracy and natural expression in the target language.`;
}

// Gemini Provider (Google)
export async function translateWithGemini(
  text: string,
  baseTranslation: string,
  mode: Mode,
  tone: Tone,
  creativity: CreativityLevel,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<string | Flashcard[]> {
  try {
    const temperature = getCreativityTemperature(creativity);
    const systemPrompt = buildSystemPrompt(mode, tone, sourceLanguage, targetLanguage);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nOriginal text:\n${text}\n\nBase translation:\n${baseTranslation}\n\nProvide the refined translation:`,
            }],
          }],
          generationConfig: {
            temperature,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );
    
    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || baseTranslation;
    
    if (mode === Mode.VOCABULARY) {
      try {
        return JSON.parse(result).flashcards || [];
      } catch {
        return [];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Failed to refine with Gemini');
  }
}

// OpenRouter Provider
export async function translateWithOpenRouter(
  text: string,
  baseTranslation: string,
  mode: Mode,
  tone: Tone,
  creativity: CreativityLevel,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<string | Flashcard[]> {
  try {
    const temperature = getCreativityTemperature(creativity);
    const systemPrompt = buildSystemPrompt(mode, tone, sourceLanguage, targetLanguage);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'auto',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Original text:\n${text}\n\nBase translation:\n${baseTranslation}\n\nProvide the refined translation:`,
          },
        ],
        temperature,
        max_tokens: 2048,
      }),
    });
    
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || baseTranslation;
    
    if (mode === Mode.VOCABULARY) {
      try {
        return JSON.parse(result).flashcards || [];
      } catch {
        return [];
      }
    }
    
    return result;
  } catch (error) {
    console.error('OpenRouter error:', error);
    throw new Error('Failed to refine with OpenRouter');
  }
}

// Nvidia NIM Provider
export async function translateWithNvidia(
  text: string,
  baseTranslation: string,
  mode: Mode,
  tone: Tone,
  creativity: CreativityLevel,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<string | Flashcard[]> {
  try {
    const temperature = getCreativityTemperature(creativity);
    const systemPrompt = buildSystemPrompt(mode, tone, sourceLanguage, targetLanguage);
    
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Original text:\n${text}\n\nBase translation:\n${baseTranslation}\n\nProvide the refined translation:`,
          },
        ],
        temperature,
        max_tokens: 2048,
      }),
    });
    
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || baseTranslation;
    
    if (mode === Mode.VOCABULARY) {
      try {
        return JSON.parse(result).flashcards || [];
      } catch {
        return [];
      }
    }
    
    return result;
  } catch (error) {
    console.error('Nvidia NIM error:', error);
    throw new Error('Failed to refine with Nvidia NIM');
  }
}
