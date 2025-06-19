
import { useMemo } from 'react';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';
import { isPremiumAnalysis, getAnalysisCost } from '@/hooks/premium-analysis/creditCostManager';

export const useTemplateSelection = (selectedType: string) => {
  const { data: premiumPrompts } = useClaudePromptExamplesByCategory('premium');

  const selectedTemplate = useMemo(() => {
    console.log(`Looking for template with ID: ${selectedType}`);
    
    // First try to find in figmant templates (our enhanced local templates)
    const figmantTemplate = figmantPromptTemplates.find(template => template.id === selectedType);
    if (figmantTemplate) {
      console.log(`Found template in figmant templates: ${figmantTemplate.name}`);
      return {
        id: figmantTemplate.id,
        title: figmantTemplate.displayName,
        category: figmantTemplate.category,
        original_prompt: figmantTemplate.prompt_template,
        credit_cost: getAnalysisCost(figmantTemplate.id),
        is_premium: isPremiumAnalysis(figmantTemplate.id),
        best_for: figmantTemplate.best_for,
        analysis_focus: figmantTemplate.analysis_focus
      };
    }
    
    // Fallback to premium prompts from database
    if (premiumPrompts?.length > 0) {
      const premiumTemplate = premiumPrompts.find(prompt => prompt.id === selectedType);
      if (premiumTemplate) {
        console.log(`Found template in premium prompts: ${premiumTemplate.title}`);
        return {
          id: premiumTemplate.id,
          title: premiumTemplate.title,
          category: premiumTemplate.category,
          original_prompt: premiumTemplate.original_prompt,
          credit_cost: getAnalysisCost(premiumTemplate.id),
          is_premium: isPremiumAnalysis(premiumTemplate.id)
        };
      }
    }
    
    console.log(`Template not found in either source`);
    console.log(`Available figmant template IDs: ${figmantPromptTemplates.map(t => t.id).join(', ')}`);
    console.log(`Available premium prompt IDs: ${(premiumPrompts || []).map(p => p.id).join(', ')}`);
    return null;
  }, [selectedType, premiumPrompts]);

  return { selectedTemplate, premiumPrompts };
};
