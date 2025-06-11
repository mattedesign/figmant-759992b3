
export interface PromptUpdateStatus {
  status: 'idle' | 'updating' | 'success' | 'error';
  message?: string;
}

export interface PromptUpdaterProps {
  templateId: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export type CategoryType = 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'general';

export const CATEGORY_OPTIONS = [
  { value: 'master' as const, label: 'Master UX Analysis' },
  { value: 'competitor' as const, label: 'Competitor Analysis' },
  { value: 'visual_hierarchy' as const, label: 'Visual Hierarchy' },
  { value: 'copy_messaging' as const, label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue' as const, label: 'E-commerce Revenue' },
  { value: 'ab_testing' as const, label: 'A/B Testing' },
  { value: 'general' as const, label: 'General' }
];
