
import { ClaudeModel } from '@/types/claude';

export const CLAUDE_MODELS: ClaudeModel[] = [
  { value: 'claude-opus-4-20250514', label: 'Claude 4 Opus (Most Capable)', recommended: true },
  { value: 'claude-sonnet-4-20250514', label: 'Claude 4 Sonnet (Balanced)', recommended: true },
  { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Fast)', recommended: true },
  { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet (Extended)' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Legacy)' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Legacy)' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Legacy)' }
];

export const DEFAULT_SYSTEM_PROMPT = 'You are a UX analytics expert that provides insights on user behavior and experience patterns. Analyze data and provide actionable recommendations for improving user experience, conversion rates, and engagement.';

export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

export const validateApiKey = (key: string): boolean => {
  return key.length >= 20 && key.startsWith('sk-ant-');
};

export const maskApiKey = (key: string): string => {
  if (!key || key.length < 8) return key;
  return key.substring(0, 8) + '•'.repeat(Math.min(key.length - 8, 20));
};
