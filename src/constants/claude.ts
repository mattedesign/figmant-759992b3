
export const CLAUDE_MODELS = [
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet (Latest)',
    description: 'Most capable model for complex reasoning and analysis',
    value: 'claude-3-5-sonnet-20241022',
    label: 'Claude 3.5 Sonnet (Latest)',
    recommended: true
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku (Latest)',
    description: 'Fast and cost-effective for simpler tasks',
    value: 'claude-3-5-haiku-20241022',
    label: 'Claude 3.5 Haiku (Latest)'
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Most powerful model for highly complex tasks',
    value: 'claude-3-opus-20240229',
    label: 'Claude 3 Opus'
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    value: 'claude-3-sonnet-20240229',
    label: 'Claude 3 Sonnet'
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Fastest model for quick responses',
    value: 'claude-3-haiku-20240307',
    label: 'Claude 3 Haiku'
  }
];

export const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey) return false;
  return apiKey.startsWith('sk-ant-') && apiKey.length >= 20;
};

export const maskApiKey = (apiKey: string): string => {
  if (!apiKey) return '';
  if (apiKey.length <= 10) return apiKey;
  return apiKey.substring(0, 10) + '***' + apiKey.substring(apiKey.length - 4);
};
