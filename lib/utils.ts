// Utility functions for language detection and other helpers

export const LANGUAGES = {
  vi: 'Vietnamese',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  th: 'Thai',
};

export function detectLanguage(text: string): string {
  // Simple heuristic detection based on character ranges
  const vietnameseChars = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  const chineseChars = /[\u4e00-\u9fff]/;
  const japaneseChars = /[\u3040-\u309f\u30a0-\u30ff]/;
  const cyrillicChars = /[\u0400-\u04ff]/;
  const arabicChars = /[\u0600-\u06ff]/;
  const thaiChars = /[\u0e00-\u0e7f]/;
  const koreanChars = /[\uac00-\ud7af]/;

  if (vietnameseChars.test(text)) return 'vi';
  if (chineseChars.test(text)) return 'zh';
  if (japaneseChars.test(text)) return 'ja';
  if (cyrillicChars.test(text)) return 'ru';
  if (arabicChars.test(text)) return 'ar';
  if (thaiChars.test(text)) return 'th';
  if (koreanChars.test(text)) return 'ko';
  
  // Default to English for Latin script
  return 'en';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date: Date): string {
  return date.toLocaleString('vi-VN');
}

// Text-to-Speech support detection
export function supportsTTS(): boolean {
  if (typeof window === 'undefined') return false;
  const speech = window.SpeechSynthesisUtterance;
  return speech !== undefined;
}

// Text-to-Speech function
export function speak(text: string, lang: string = 'en'): void {
  if (!supportsTTS()) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (error) {
      reject(error);
    }
    document.body.removeChild(textArea);
  });
}
