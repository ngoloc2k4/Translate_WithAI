import React, { useState, useRef, useEffect } from 'react';
import { ControlCenter } from '@/components/ControlCenter';
import { TranslateTextArea } from '@/components/TranslateTextArea';
import { OutputPanel } from '@/components/OutputPanel';
import { Insights } from '@/components/Insights';
import { History } from '@/components/History';
import { Mode, Tone, CreativityLevel, Provider, Flashcard, HistoryEntry } from '@/lib/types';
import { detectLanguage } from '@/lib/utils';
import { getHistory, addToHistory, deleteHistoryEntry, clearHistory, getStoredApiKeys, saveApiKey } from '@/lib/storage';
import styles from '@/components/ControlCenter.module.css';

export default function Home() {
  // State - Languages
  const [sourceLanguage, setSourceLanguage] = useState('vi');
  const [targetLanguage, setTargetLanguage] = useState('en');

  // State - Source/Target text
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');

  // State - Translation results
  const [basicTranslation, setBasicTranslation] = useState('');
  const [aiTranslations, setAiTranslations] = useState<{
    normal?: string;
    balanced?: string;
    creative?: string;
  }>({});
  const [insights, setInsights] = useState<Flashcard[]>([]);

  // State - Settings
  const [mode, setMode] = useState<Mode>(Mode.DEFAULT);
  const [tone, setTone] = useState<Tone>(Tone.FORMAL);
  const [creativity, setCreativity] = useState<CreativityLevel>(CreativityLevel.BALANCED);
  const [allVersions, setAllVersions] = useState(false);
  const [basicProvider, setBasicProvider] = useState<Provider>(Provider.GOOGLE);
  const [aiProvider, setAiProvider] = useState<Provider | undefined>();

  // State - API Keys
  const [deepLApiKey, setDeepLApiKey] = useState('');
  const [aiApiKey, setAiApiKey] = useState('');

  // State - Loading & History
  const [loading, setLoading] = useState(false);
  const [basicLoading, setBasicLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [focusedField, setFocusedField] = useState<'source' | 'target'>('source');

  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const targetRef = useRef<HTMLTextAreaElement>(null);

  // Load history and preferences on mount
  useEffect(() => {
    const storedHistory = getHistory();
    setHistory(storedHistory);

    const keys = getStoredApiKeys();
    if (keys.deepl) setDeepLApiKey(keys.deepl);
    if (keys.gemini) setAiApiKey(keys.gemini);
  }, []);

  // Handle API key changes
  const handleApiKeyChange = (type: 'deepl' | 'ai', key: string) => {
    if (type === 'deepl') {
      setDeepLApiKey(key);
      saveApiKey('deepl', key);
    } else {
      setAiApiKey(key);
      const provider = aiProvider || Provider.GEMINI;
      saveApiKey(provider, key);
    }
  };

  // Translation submit handler
  const handleTranslate = async () => {
    const isSourceFocus = focusedField === 'source';
    const textToTranslate = isSourceFocus ? sourceText : targetText;

    if (!textToTranslate.trim()) return;

    setLoading(true);
    setBasicLoading(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLanguage: isSourceFocus ? sourceLanguage : targetLanguage,
          targetLanguage: isSourceFocus ? targetLanguage : sourceLanguage,
          mode,
          tone,
          creativity,
          basicProvider,
          aiProvider,
          allVersions,
          deepLApiKey: basicProvider === Provider.DEEPL ? deepLApiKey : undefined,
          aiApiKey: aiProvider ? aiApiKey : undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Translation failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        alert(`Error: ${errorMessage}`);
        setBasicLoading(false);
        return;
      }

      const data = await response.json();

      setBasicTranslation(data.basicTranslation);
      setBasicLoading(false);

      if (isSourceFocus) {
        setTargetText(data.basicTranslation);
      } else {
        setSourceText(data.basicTranslation);
      }

      if (data.aiTranslations) {
        setAiTranslations(data.aiTranslations);
      }

      if (data.insights && data.insights.length > 0) {
        setInsights(data.insights);
      }

      // Add to history
      const historyEntry = addToHistory({
        sourceText: isSourceFocus ? textToTranslate : data.basicTranslation,
        translatedText: isSourceFocus ? data.basicTranslation : textToTranslate,
        sourceLanguage: isSourceFocus ? sourceLanguage : targetLanguage,
        targetLanguage: isSourceFocus ? targetLanguage : sourceLanguage,
        mode,
        tone,
        timestamp: new Date().toISOString(),
        basicProvider,
        aiProvider,
      });

      setHistory([historyEntry, ...history]);
    } catch (error) {
      alert(`Failed to translate: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setSourceText(entry.sourceText);
    setBasicTranslation(entry.translatedText);
    setSourceLanguage(entry.sourceLanguage);
    setTargetLanguage(entry.targetLanguage);
    setMode(entry.mode);
    setTone(entry.tone);
  };

  const handleDeleteHistory = (id: string) => {
    deleteHistoryEntry(id);
    setHistory(history.filter(e => e.id !== id));
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  return (
    <div className={styles.container}>
      <h1>Lobie Translate</h1>

      <ControlCenter
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        mode={mode}
        tone={tone}
        creativity={creativity}
        allVersions={allVersions}
        basicProvider={basicProvider}
        aiProvider={aiProvider}
        deepLApiKey={deepLApiKey}
        aiApiKey={aiApiKey}
        onSourceLanguageChange={setSourceLanguage}
        onTargetLanguageChange={setTargetLanguage}
        onModeChange={setMode}
        onToneChange={setTone}
        onCreativityChange={setCreativity}
        onAllVersionsChange={setAllVersions}
        onBasicProviderChange={setBasicProvider}
        onAiProviderChange={setAiProvider}
        onApiKeyChange={handleApiKeyChange}
      />

      <div className={styles.mainLayout}>
        <div className={styles.column}>
          <h3>{sourceLanguage.toUpperCase()}</h3>
          <TranslateTextArea
            value={sourceText}
            onChange={setSourceText}
            onSubmit={handleTranslate}
            placeholder={`Enter text in ${sourceLanguage.toUpperCase()}...`}
            language={sourceLanguage}
            loading={loading}
            onFocus={() => setFocusedField('source')}
          />
        </div>

        <div className={styles.column}>
          <h3>{targetLanguage.toUpperCase()}</h3>
          <OutputPanel
            basicTranslation={basicTranslation}
            aiTranslations={aiTranslations}
            mode={mode}
            language={targetLanguage}
            loading={basicLoading}
          />
        </div>
      </div>

      {mode === Mode.VOCABULARY && insights.length > 0 && (
        <Insights flashcards={insights} />
      )}

      <History
        entries={history}
        onSelectEntry={handleSelectHistory}
        onDeleteEntry={handleDeleteHistory}
      />
    </div>
  );
}
