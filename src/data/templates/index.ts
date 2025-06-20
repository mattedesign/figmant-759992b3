
import { FigmantPromptTemplate } from '@/types/figmant';

// Legacy hardcoded templates - now deprecated in favor of database templates
// All templates should now be managed through the admin panel in the database
export const figmantPromptTemplates: FigmantPromptTemplate[] = [];

// Utility function to get a template by ID - now returns null as all templates come from database
export const getFigmantTemplate = (templateId: string): FigmantPromptTemplate | null => {
  console.warn('getFigmantTemplate is deprecated. Use database templates via useClaudePromptExamples hook instead.');
  return null;
};
