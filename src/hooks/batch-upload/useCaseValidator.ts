
import { fetchUseCase, fetchUseCaseByName } from './databaseHelpers';
import { getFigmantTemplate } from '@/data/figmantPromptTemplates';

export const useUseCaseValidator = () => {
  const validateAndFetchUseCase = async (useCaseId: string) => {
    // Handle Figmant template IDs by fetching from database using name matching
    if (useCaseId.startsWith('figmant_')) {
      const templateId = useCaseId.replace('figmant_', '');
      const template = getFigmantTemplate(templateId);
      
      if (template) {
        // Fetch from database using the template name (now without "Figmant:" prefix)
        const useCase = await fetchUseCaseByName(template.name);
        if (!useCase) {
          console.error(`Template "${template.name}" not found in database. Available templates should include this name.`);
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
