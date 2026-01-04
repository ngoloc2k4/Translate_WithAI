// Google Translate Unofficial Provider
export async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    // Using unofficial Google Translate API via mymemory or similar
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error(`Google Translate API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error('Google Translate error:', error);
    throw new Error('Failed to translate with Google');
  }
}

// DeepL Free API Provider
export async function translateWithDeepL(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  try {
    const response = await fetch('https://api-free.deepl.com/v1/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: sourceLang.toUpperCase(),
        target_lang: targetLang.toUpperCase(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`DeepL API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.translations?.[0]?.text || text;
  } catch (error) {
    console.error('DeepL error:', error);
    throw new Error('Failed to translate with DeepL');
  }
}

// LibreTranslate Provider (with fallback instances)
const LIBRE_INSTANCES = [
  'https://libretranslate.de/translate',
  'https://translate.terraprint.com/translate',
  'https://libretranslate.np.com.br/translate',
];

export async function translateWithLibre(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  for (const instance of LIBRE_INSTANCES) {
    try {
      const response = await fetch(instance, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.translatedText || text;
      }
    } catch (error) {
      console.error(`LibreTranslate error on ${instance}:`, error);
      continue;
    }
  }
  
  throw new Error('All LibreTranslate instances failed');
}

// Provider fallback chain
export async function translateBasic(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey?: string
): Promise<string> {
  // Try in order: DeepL → Google → LibreTranslate
  
  if (apiKey) {
    try {
      return await translateWithDeepL(text, sourceLang, targetLang, apiKey);
    } catch (error) {
      console.error('DeepL fallback error:', error);
    }
  }
  
  try {
    return await translateWithGoogle(text, sourceLang, targetLang);
  } catch (error) {
    console.error('Google fallback error:', error);
  }
  
  try {
    return await translateWithLibre(text, sourceLang, targetLang);
  } catch (error) {
    console.error('LibreTranslate fallback error:', error);
  }
  
  throw new Error('All translation providers failed');
}
