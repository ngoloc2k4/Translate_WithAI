import React, { useState } from 'react';
import { Flashcard } from '@/lib/types';
import styles from './ControlCenter.module.css';

interface InsightsProps {
  flashcards: Flashcard[];
}

export const Insights: React.FC<InsightsProps> = ({ flashcards }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  return (
    <div className={styles.insights}>
      <h3>Vocabulary Insights</h3>
      <div className={styles.flashcardsGrid}>
        {flashcards.map((card, idx) => (
          <div
            key={idx}
            className={`${styles.flashcard} ${expandedId === String(idx) ? styles.expanded : ''}`}
            onClick={() => setExpandedId(expandedId === String(idx) ? null : String(idx))}
          >
            <div className={styles.flashcardFront}>
              <div className={styles.word}>{card.word}</div>
              {card.pronunciation && (
                <div className={styles.pronunciation}>{card.pronunciation}</div>
              )}
            </div>
            {expandedId === String(idx) && (
              <div className={styles.flashcardBack}>
                <div className={styles.meaning}><strong>Meaning:</strong> {card.meaning}</div>
                <div className={styles.explanation}><strong>Explanation:</strong> {card.explanation}</div>
                <div className={styles.example}><strong>Example:</strong> {card.example}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
