
import { FigmantPromptTemplate } from '@/types/figmant';
import { masterTemplates } from './masterTemplates';
import { competitorTemplates } from './competitorTemplates';
import { visualTemplates } from './visualTemplates';
import { contentTemplates } from './contentTemplates';
import { ecommerceTemplates } from './ecommerceTemplates';
import { testingTemplates } from './testingTemplates';
import { accessibilityTemplates } from './accessibilityTemplates';
import { deviceTemplates } from './deviceTemplates';
import { seasonalTemplates } from './seasonalTemplates';
import { designSystemTemplates } from './designSystemTemplates';

// Combine all templates into a single array
export const figmantPromptTemplates: FigmantPromptTemplate[] = [
  ...masterTemplates,
  ...competitorTemplates,
  ...visualTemplates,
  ...contentTemplates,
  ...ecommerceTemplates,
  ...testingTemplates,
  ...accessibilityTemplates,
  ...deviceTemplates,
  ...seasonalTemplates,
  ...designSystemTemplates
];

// Template utility functions
export const getFigmantTemplate = (id: string): FigmantPromptTemplate | undefined => {
  return figmantPromptTemplates.find(template => template.id === id);
};

export const getFigmantTemplatesByCategory = (category: string): FigmantPromptTemplate[] => {
  return figmantPromptTemplates.filter(template => template.category === category);
};

// Export individual template collections for specific use cases
export {
  masterTemplates,
  competitorTemplates,
  visualTemplates,
  contentTemplates,
  ecommerceTemplates,
  testingTemplates,
  accessibilityTemplates,
  deviceTemplates,
  seasonalTemplates,
  designSystemTemplates
};
