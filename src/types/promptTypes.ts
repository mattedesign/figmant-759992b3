
export interface PromptUpdateStatus {
  status: 'idle' | 'updating' | 'success' | 'error';
  message?: string;
}

export interface PromptUpdaterProps {
  templateId: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}
