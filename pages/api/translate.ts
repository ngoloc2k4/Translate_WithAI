import { NextRequest, NextResponse } from 'next/server';
import { translateBasic } from '@/lib/providers/basic';
import { 
  translateWithGemini, 
  translateWithOpenRouter, 
  translateWithNvidia 
} from '@/lib/providers/ai';
import { Provider, CreativityLevel, Mode } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const {
      text,
      sourceLanguage,
      targetLanguage,
      mode = Mode.DEFAULT,
      tone,
      creativity = CreativityLevel.BALANCED,
      basicProvider = Provider.GOOGLE,
      aiProvider,
      allVersions = false,
      deepLApiKey,
      aiApiKey,
    } = await request.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Get basic translation
    let basicTranslation: string;
    try {
      basicTranslation = await translateBasic(
        text,
        sourceLanguage,
        targetLanguage,
        basicProvider === Provider.DEEPL ? deepLApiKey : undefined
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Translation failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
        { status: 500 }
      );
    }

    const response: any = {
      basicTranslation,
      metadata: {
        sourceLanguage,
        targetLanguage,
        mode,
        tone,
        timestamp: new Date().toISOString(),
      },
    };

    // Step 2: AI Polish if provider is specified
    if (aiProvider && aiApiKey) {
      try {
        if (allVersions) {
          // Get all 3 versions with different temperatures
          const versions = await Promise.all([
            getAIRefinement(
              text,
              basicTranslation,
              mode,
              tone,
              CreativityLevel.NORMAL,
              sourceLanguage,
              targetLanguage,
              aiProvider,
              aiApiKey
            ),
            getAIRefinement(
              text,
              basicTranslation,
              mode,
              tone,
              CreativityLevel.BALANCED,
              sourceLanguage,
              targetLanguage,
              aiProvider,
              aiApiKey
            ),
            getAIRefinement(
              text,
              basicTranslation,
              mode,
              tone,
              CreativityLevel.CREATIVE,
              sourceLanguage,
              targetLanguage,
              aiProvider,
              aiApiKey
            ),
          ]);

          response.aiTranslations = {
            normal: versions[0],
            balanced: versions[1],
            creative: versions[2],
          };
        } else {
          const aiResult = await getAIRefinement(
            text,
            basicTranslation,
            mode,
            tone,
            creativity,
            sourceLanguage,
            targetLanguage,
            aiProvider,
            aiApiKey
          );

          if (mode === Mode.VOCABULARY && typeof aiResult !== 'string') {
            response.insights = aiResult;
          } else {
            response.aiTranslations = {
              [creativity]: aiResult,
            };
          }
        }
      } catch (error) {
        console.error('AI refinement error:', error);
        // Continue with basic translation if AI fails
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getAIRefinement(
  text: string,
  basicTranslation: string,
  mode: Mode,
  tone: string,
  creativity: CreativityLevel,
  sourceLanguage: string,
  targetLanguage: string,
  provider: Provider,
  apiKey: string
): Promise<string | any> {
  switch (provider) {
    case Provider.GEMINI:
      return await translateWithGemini(
        text,
        basicTranslation,
        mode,
        tone as any,
        creativity,
        sourceLanguage,
        targetLanguage,
        apiKey
      );
    case Provider.OPENROUTER:
      return await translateWithOpenRouter(
        text,
        basicTranslation,
        mode,
        tone as any,
        creativity,
        sourceLanguage,
        targetLanguage,
        apiKey
      );
    case Provider.NVIDIA:
      return await translateWithNvidia(
        text,
        basicTranslation,
        mode,
        tone as any,
        creativity,
        sourceLanguage,
        targetLanguage,
        apiKey
      );
    default:
      return basicTranslation;
  }
}
