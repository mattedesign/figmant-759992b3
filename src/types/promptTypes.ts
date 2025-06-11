
export type CategoryType = 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'general';

export const CATEGORY_OPTIONS = [
  { value: 'master', label: 'Master UX Analysis' },
  { value: 'competitor', label: 'Competitor Analysis' },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy' },
  { value: 'copy_messaging', label: 'Copy & Messaging' },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue' },
  { value: 'ab_testing', label: 'A/B Testing' },
  { value: 'general', label: 'General' }
] as const;
