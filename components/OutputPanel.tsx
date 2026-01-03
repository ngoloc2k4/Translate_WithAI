import React, { useState } from 'react';
import { copyToClipboard, speak } from '@/lib/utils';
import styles from './ControlCenter.module.css';

interface OutputPanelProps {
  basicTranslation: string;
  aiTranslations?: {
    normal?: string;
    balanced?: string;
    creative?: string;
  };
  mode?: string;
  language: string;
  loading?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  basicTranslation,
  aiTranslations,
  mode,
  language,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'ai'>('basic');
  const [activeSubTab, setActiveSubTab] = useState<'normal' | 'balanced' | 'creative'>('balanced');

  const displayText =
    activeTab === 'basic'
      ? basicTranslation
      : aiTranslations?.[activeSubTab] || basicTranslation;

  const handleCopy = async () => {
    try {
      await copyToClipboard(displayText);
      alert('Copied to clipboard!');
    } catch {
      alert('Failed to copy');
    }
  };

  const handleSpeak = () => {
    speak(displayText, language);
  };

  return (
    <div className={styles.outputPanel}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'basic' ? styles.active : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Google Free
        </button>
        {aiTranslations && (
          <button
            className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Polished
          </button>
        )}
      </div>

      {activeTab === 'ai' && aiTranslations && (
        <div className={styles.subTabs}>
          {aiTranslations.normal && (
            <button
              className={`${styles.subTab} ${activeSubTab === 'normal' ? styles.active : ''}`}
              onClick={() => setActiveSubTab('normal')}
            >
              Safe
            </button>
          )}
          {aiTranslations.balanced && (
            <button
              className={`${styles.subTab} ${activeSubTab === 'balanced' ? styles.active : ''}`}
              onClick={() => setActiveSubTab('balanced')}
            >
              Balanced
            </button>
          )}
          {aiTranslations.creative && (
            <button
              className={`${styles.subTab} ${activeSubTab === 'creative' ? styles.active : ''}`}
              onClick={() => setActiveSubTab('creative')}
            >
              Creative
            </button>
          )}
        </div>
      )}

      <div className={styles.outputContent}>
        <textarea
          readOnly
          value={displayText}
          className={styles.outputTextarea}
        />
        <div className={styles.controls}>
          <button onClick={handleCopy} title="Copy to clipboard">
            📋 Copy
          </button>
          <button onClick={handleSpeak} title="Text to Speech">
            🔊 Speak
          </button>
          <button
            onClick={() => {
              // Will be implemented to allow editing
            }}
            title="Edit translation"
          >
            ✏️ Edit
          </button>
        </div>
      </div>
    </div>
  );
};
