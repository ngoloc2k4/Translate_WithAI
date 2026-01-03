import React from 'react';
import styles from './ControlCenter.module.css';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  language: string;
  loading?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TranslateTextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  language,
  loading = false,
  onFocus,
  onBlur,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className={styles.textareaWrapper}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={loading}
        className={styles.textarea}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className={styles.submitBtn}
      >
        {loading ? 'Translating...' : 'Translate →'}
      </button>
    </div>
  );
};
