import { HistoryEntry } from '../types';
import { generateId } from './utils';

const HISTORY_KEY = 'lobie-translate-history';
const MAX_HISTORY = 50;

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addToHistory(entry: Omit<HistoryEntry, 'id'>): HistoryEntry {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: generateId(),
  };
  
  const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  
  return newEntry;
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory();
  const updated = history.filter(entry => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// API Keys storage
const API_KEYS_KEY = 'lobie-translate-keys';

export interface StoredApiKeys {
  deepl?: string;
  gemini?: string;
  openrouter?: string;
  nvidia?: string;
}

export function getStoredApiKeys(): StoredApiKeys {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(API_KEYS_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function saveApiKey(provider: string, key: string): void {
  const keys = getStoredApiKeys();
  keys[provider as keyof StoredApiKeys] = key;
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
}

export function deleteApiKey(provider: string): void {
  const keys = getStoredApiKeys();
  delete keys[provider as keyof StoredApiKeys];
  localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
}

// User preferences
const PREFERENCES_KEY = 'lobie-translate-prefs';

export interface UserPreferences {
  sourceLanguage: string;
  targetLanguage: string;
  defaultMode: string;
  defaultTone: string;
  defaultCreativity: string;
  defaultBasicProvider: string;
  defaultAiProvider?: string;
}

export function getPreferences(): Partial<UserPreferences> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(PREFERENCES_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
}
