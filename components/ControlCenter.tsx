import React, { useState, useCallback, useRef } from 'react';
import { Mode, Tone, CreativityLevel, Provider } from '@/lib/types';
import styles from './ControlCenter.module.css';

interface ControlCenterProps {
  sourceLanguage: string;
  targetLanguage: string;
  mode: Mode;
  tone: Tone;
  creativity: CreativityLevel;
  allVersions: boolean;
  basicProvider: Provider;
  aiProvider?: Provider;
  deepLApiKey?: string;
  aiApiKey?: string;
  onSourceLanguageChange: (lang: string) => void;
  onTargetLanguageChange: (lang: string) => void;
  onModeChange: (mode: Mode) => void;
  onToneChange: (tone: Tone) => void;
  onCreativityChange: (creativity: CreativityLevel) => void;
  onAllVersionsChange: (all: boolean) => void;
  onBasicProviderChange: (provider: Provider) => void;
  onAiProviderChange: (provider?: Provider) => void;
  onApiKeyChange: (type: 'deepl' | 'ai', key: string) => void;
}

const LANGUAGES = {
  vi: 'Tiếng Việt',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
};

const MODES = [
  { value: Mode.DEFAULT, label: 'Default' },
  { value: Mode.VOCABULARY, label: 'Vocabulary' },
  { value: Mode.PARALLEL, label: 'Parallel' },
  { value: Mode.SUMMARY, label: 'Summary' },
  { value: Mode.MIXED, label: 'Mixed' },
];

const TONES = [
  { value: Tone.FORMAL, label: 'Formal' },
  { value: Tone.CASUAL, label: 'Casual' },
  { value: Tone.HUMOROUS, label: 'Humorous' },
  { value: Tone.PROFESSIONAL, label: 'Professional' },
  { value: Tone.POETIC, label: 'Poetic' },
  { value: Tone.SLANG, label: 'Slang' },
];

const BASIC_PROVIDERS = [
  { value: Provider.GOOGLE, label: 'Google Free' },
  { value: Provider.DEEPL, label: 'DeepL' },
  { value: Provider.LIBRE, label: 'LibreTranslate' },
];

const AI_PROVIDERS = [
  { value: Provider.GEMINI, label: 'Gemini' },
  { value: Provider.OPENROUTER, label: 'OpenRouter' },
  { value: Provider.NVIDIA, label: 'Nvidia NIM' },
];

export const ControlCenter: React.FC<ControlCenterProps> = ({
  sourceLanguage,
  targetLanguage,
  mode,
  tone,
  creativity,
  allVersions,
  basicProvider,
  aiProvider,
  deepLApiKey,
  aiApiKey,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onModeChange,
  onToneChange,
  onCreativityChange,
  onAllVersionsChange,
  onBasicProviderChange,
  onAiProviderChange,
  onApiKeyChange,
}) => {
  const [showDeepLKey, setShowDeepLKey] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const deepLKeyRef = useRef<HTMLInputElement>(null);
  const aiKeyRef = useRef<HTMLInputElement>(null);

  const handleSwapLanguages = useCallback(() => {
    onSourceLanguageChange(targetLanguage);
    onTargetLanguageChange(sourceLanguage);
  }, [sourceLanguage, targetLanguage, onSourceLanguageChange, onTargetLanguageChange]);

  const creativetyValue = creativity === CreativityLevel.NORMAL ? 0.1 : 
                          creativity === CreativityLevel.BALANCED ? 0.5 : 0.9;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.group}>
          <label>Source Language</label>
          <select value={sourceLanguage} onChange={(e) => onSourceLanguageChange(e.target.value)}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <button className={styles.swapBtn} onClick={handleSwapLanguages} title="Swap languages">
          ↔
        </button>

        <div className={styles.group}>
          <label>Target Language</label>
          <select value={targetLanguage} onChange={(e) => onTargetLanguageChange(e.target.value)}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label>Mode</label>
          <select value={mode} onChange={(e) => onModeChange(e.target.value as Mode)}>
            {MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label>Tone</label>
          <select value={tone} onChange={(e) => onToneChange(e.target.value as Tone)}>
            {TONES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label>Creativity</label>
          <div className={styles.creativityControl}>
            <input
              type="range"
              min="0"
              max="100"
              value={creativetyValue * 100}
              onChange={(e) => {
                const val = parseFloat(e.target.value) / 100;
                if (val < 0.3) onCreativityChange(CreativityLevel.NORMAL);
                else if (val < 0.7) onCreativityChange(CreativityLevel.BALANCED);
                else onCreativityChange(CreativityLevel.CREATIVE);
              }}
            />
            <span className={styles.label}>{creativity}</span>
          </div>
        </div>

        <div className={styles.group}>
          <label>
            <input
              type="checkbox"
              checked={allVersions}
              onChange={(e) => onAllVersionsChange(e.target.checked)}
            />
            All Versions
          </label>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label>Basic Provider</label>
          <select value={basicProvider} onChange={(e) => onBasicProviderChange(e.target.value as Provider)}>
            {BASIC_PROVIDERS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label>AI Provider (Optional)</label>
          <select value={aiProvider || ''} onChange={(e) => onAiProviderChange(e.target.value as Provider || undefined)}>
            <option value="">None</option>
            {AI_PROVIDERS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {basicProvider === Provider.DEEPL && (
          <div className={styles.group}>
            <label>DeepL Key</label>
            <div className={styles.keyInput}>
              <input
                ref={deepLKeyRef}
                type={showDeepLKey ? 'text' : 'password'}
                value={deepLApiKey || ''}
                onChange={(e) => onApiKeyChange('deepl', e.target.value)}
                placeholder="Enter DeepL API key"
              />
              <button onClick={() => setShowDeepLKey(!showDeepLKey)}>
                {showDeepLKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        )}

        {aiProvider && (
          <div className={styles.group}>
            <label>AI Key</label>
            <div className={styles.keyInput}>
              <input
                ref={aiKeyRef}
                type={showAiKey ? 'text' : 'password'}
                value={aiApiKey || ''}
                onChange={(e) => onApiKeyChange('ai', e.target.value)}
                placeholder="Enter API key"
              />
              <button onClick={() => setShowAiKey(!showAiKey)}>
                {showAiKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
