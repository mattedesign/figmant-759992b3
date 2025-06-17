
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';

// Map of analysis types to display names
const ANALYSIS_TYPE_DISPLAY_NAMES: Record<string, string> = {
  'master': 'Master UX Analysis',
  'competitor': 'Competitive Analysis', 
  'visual_hierarchy': 'Visual Hierarchy',
  'copy_messaging': 'Copy & Messaging',
  'ecommerce_revenue': 'E-commerce Revenue',
  'ab_testing': 'A/B Testing Strategy',
  'premium': 'Premium Analysis',
  'general': 'General Analysis',
  'figmant_chat': 'Master Analysis',
  'Master Analysis': 'Master Analysis',
  'Competitive Analysis': 'Competitive Analysis',
  'Visual Hierarchy': 'Visual Hierarchy',
  'Copy & Messaging': 'Copy & Messaging',
  'E-commerce Revenue': 'E-commerce Revenue',
  'A/B Testing Strategy': 'A/B Testing Strategy'
};

export const getAnalysisDisplayName = (analysisType?: string): string => {
  if (!analysisType) {
    return 'Master Analysis';
  }

  // First try to find exact match
  if (ANALYSIS_TYPE_DISPLAY_NAMES[analysisType]) {
    return ANALYSIS_TYPE_DISPLAY_NAMES[analysisType];
  }

  // Try to find a template with matching category or name
  const template = figmantPromptTemplates.find(t => 
    t.category === analysisType.toLowerCase() || 
    t.name.toLowerCase() === analysisType.toLowerCase() ||
    t.id === analysisType
  );

  if (template) {
    return template.displayName;
  }

  // Check for partial matches (case insensitive)
  const lowerType = analysisType.toLowerCase();
  for (const [key, displayName] of Object.entries(ANALYSIS_TYPE_DISPLAY_NAMES)) {
    if (lowerType.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerType)) {
      return displayName;
    }
  }

  // If no match found, return the original type with proper casing
  return analysisType.charAt(0).toUpperCase() + analysisType.slice(1);
};
