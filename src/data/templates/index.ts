
import { visualHierarchyTemplates } from './visualHierarchyTemplates';
import { copyMessagingTemplates } from './copyMessagingTemplates';
import { abTestingTemplates } from './abTestingTemplates';
import { designSystemTemplates } from './designSystemTemplates';
import { accessibilityTemplates } from './accessibilityTemplates';
import { crossDeviceTemplates } from './crossDeviceTemplates';
import { seasonalTemplates } from './seasonalTemplates';
import { FigmantPromptTemplate } from '@/types/figmant';
export * from './competitorAnalysisTemplates';
export * from './ecommerceTemplates';
import { competitorAnalysisTemplates } from './competitorAnalysisTemplates';
import { ecommerceTemplates } from './ecommerceTemplates';

export const figmantPromptTemplates: FigmantPromptTemplate[] = [
  ...visualHierarchyTemplates,
  ...copyMessagingTemplates,
  ...abTestingTemplates,
  ...designSystemTemplates,
  ...accessibilityTemplates,
  ...crossDeviceTemplates,
  ...seasonalTemplates,
  ...competitorAnalysisTemplates,
  ...ecommerceTemplates
];

// Utility function to get a template by ID
export const getFigmantTemplate = (templateId: string): FigmantPromptTemplate | null => {
  return figmantPromptTemplates.find(template => template.id === templateId) || null;
};
