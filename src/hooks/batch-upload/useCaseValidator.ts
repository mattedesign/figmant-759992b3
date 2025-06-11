
import { fetchUseCase } from './databaseHelpers';
import { getFigmantTemplate } from '@/data/figmantPromptTemplates';

export const useUseCaseValidator = () => {
  const validateAndFetchUseCase = async (useCaseId: string) => {
    // Handle Figmant template IDs by fetching from database using name matching
    if (useCaseId.startsWith('figmant_')) {
      const templateId = useCaseId.replace('figmant_', '');
      const template = getFigmantTemplate(templateId);
      
      if (template) {
        // Fetch from database using the template name
        const useCase = await fetchUseCaseByName(template.name);
        if (!useCase) {
          throw new Error(`Figmant template "${template.name}" not found in database`);
        }
        return useCase;
      } else {
        throw new Error(`Figmant template not found: ${templateId}`);
      }
    }
    
    // Handle regular UUID-based use case IDs
    const useCase = await fetchUseCase(useCaseId);
    
    if (!useCase) {
      throw new Error(`Use case not found: ${useCaseId}`);
    }

    return useCase;
  };

  const validateUseCaseExists = (useCaseId: string): boolean => {
    return Boolean(useCaseId && useCaseId.trim().length > 0);
  };

  return {
    validateAndFetchUseCase,
    validateUseCaseExists
  };
};

// Helper function to fetch use case by name
const fetchUseCaseByName = async (name: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase
    .from('design_use_cases')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('Error fetching use case by name:', error);
    return null;
  }

  return data;
};
