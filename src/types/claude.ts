
export interface ClaudeFormData {
  enabled: boolean;
  apiKey: string;
  model: string;
  systemPrompt: string;
}

export interface ClaudeSettings {
  claude_ai_enabled?: boolean;
  claude_api_key?: string;
  claude_model?: string;
  claude_system_prompt?: string;
}

export interface ClaudeUsageStats {
  totalTokens: number;
  totalCost: number;
  requestCount: number;
  successfulRequests: number;
  errorRate: string;
}

export interface ClaudeModel {
  value: string;
  label: string;
  recommended?: boolean;
}

export interface ConnectionStatus {
  status: 'disabled' | 'error' | 'ready';
  icon: any;
  color: string;
  text: string;
}
