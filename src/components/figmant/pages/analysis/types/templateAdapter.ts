
import { FigmantPromptTemplate as HookTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { FigmantPromptTemplate as TypeTemplate } from '@/types/figmant';

export const adaptTemplateForComponent = (hookTemplate: HookTemplate): TypeTemplate => {
  return {
    id: hookTemplate.id,
    name: hookTemplate.title,
    displayName: hookTemplate.displayName,
    description: hookTemplate.description || '',
    category: mapCategory(hookTemplate.category),
    prompt_template: hookTemplate.prompt,
    analysis_focus: extractAnalysisFocus(hookTemplate.metadata),
    requires_context: hookTemplate.metadata?.requires_context || false,
    best_for: hookTemplate.metadata?.best_for || [],
    example_use_cases: hookTemplate.metadata?.example_use_cases || [],
    contextual_fields: hookTemplate.metadata?.contextual_fields || []
  };
};

const mapCategory = (category: string): TypeTemplate['category'] => {
  const categoryMap: Record<string, TypeTemplate['category']> = {
    'master': 'master',
    'competitor': 'competitor',
    'visual_hierarchy': 'visual_hierarchy',
    'copy_messaging': 'copy_messaging',
    'ecommerce_revenue': 'ecommerce_revenue',
    'ab_testing': 'ab_testing',
    'accessibility': 'accessibility',
    'cross_device': 'cross_device',
    'seasonal': 'seasonal',
    'design_system': 'design_system'
  };
  
  return categoryMap[category] || 'master';
};

const extractAnalysisFocus = (metadata: Record<string, any> | undefined): string[] => {
  return metadata?.analysis_focus || ['UX Design', 'Conversion Optimization'];
};

export const adaptTemplatesForComponent = (hookTemplates: HookTemplate[]): TypeTemplate[] => {
  return hookTemplates.map(adaptTemplateForComponent);
};
