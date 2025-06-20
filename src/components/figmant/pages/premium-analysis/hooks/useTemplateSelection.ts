
import { useMemo } from 'react';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { isPremiumAnalysis, getAnalysisCost } from '@/hooks/premium-analysis/creditCostManager';
import { ContextualField } from '@/types/figmant';

export const useTemplateSelection = (selectedType: string) => {
  const { data: premiumPrompts } = useClaudePromptExamplesByCategory('premium');
  const { data: allPrompts } = useClaudePromptExamplesByCategory('all');

  const selectedTemplate = useMemo(() => {
    console.log(`Looking for template with ID: ${selectedType}`);
    
    // Get all available prompts from database
    const availablePrompts = [...(premiumPrompts || []), ...(allPrompts || [])];
    
    if (availablePrompts.length > 0) {
      const template = availablePrompts.find(prompt => prompt.id === selectedType);
      if (template) {
        console.log(`Found template in database: ${template.title}`);
        
        // Safely extract contextual_fields from metadata with proper type checking
        let contextualFields: ContextualField[] = [];
        if (template.metadata && typeof template.metadata === 'object' && template.metadata !== null) {
          const metadata = template.metadata as Record<string, any>;
          contextualFields = Array.isArray(metadata.contextual_fields) ? metadata.contextual_fields : [];
        }
        
        return {
          id: template.id,
          title: template.title,
          displayName: template.display_name || template.title,
          category: template.category,
          original_prompt: template.original_prompt,
          credit_cost: getAnalysisCost(template.id),
          is_premium: isPremiumAnalysis(template.id),
          contextual_fields: contextualFields,
          description: template.description,
          effectiveness_rating: template.effectiveness_rating
        };
      }
    }
    
    console.log(`Template not found in database`);
    console.log(`Available prompt IDs: ${availablePrompts.map(p => p.id).join(', ')}`);
    return null;
  }, [selectedType, premiumPrompts, allPrompts]);

  return { selectedTemplate, premiumPrompts };
};
