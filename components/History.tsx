import React, { useState } from 'react';
import { HistoryEntry } from '@/lib/types';
import { formatDate, copyToClipboard } from '@/lib/utils';
import styles from './ControlCenter.module.css';

interface HistoryProps {
  entries: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ entries, onSelectEntry, onDeleteEntry }) => {
  const [expanded, setExpanded] = useState(false);

  if (entries.length === 0) {
    return <div className={styles.noHistory}>No history yet</div>;
  }

  return (
    <div className={styles.history}>
      <button
        className={styles.historyToggle}
        onClick={() => setExpanded(!expanded)}
      >
        History ({entries.length}) {expanded ? '▼' : '▶'}
      </button>

      {expanded && (
        <div className={styles.historyList}>
          {entries.map((entry) => (
            <div key={entry.id} className={styles.historyEntry}>
              <div
                className={styles.historyContent}
                onClick={() => onSelectEntry(entry)}
              >
                <div className={styles.historyText}>
                  <div className={styles.source}>{entry.sourceText.substring(0, 50)}...</div>
                  <div className={styles.target}>{entry.translatedText.substring(0, 50)}...</div>
                </div>
                <div className={styles.historyMeta}>
                  <span className={styles.mode}>{entry.mode}</span>
                  <span className={styles.time}>{formatDate(new Date(entry.timestamp))}</span>
                </div>
              </div>
              <button
                className={styles.copyBtn}
                onClick={() => copyToClipboard(entry.translatedText)}
                title="Copy translation"
              >
                📋
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => onDeleteEntry(entry.id)}
                title="Delete entry"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
