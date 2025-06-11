
import { fetchUseCase, fetchUseCaseByName } from './databaseHelpers';

export const useCaseValidator = () => {
  const validateUseCase = async (useCaseId: string) => {
    // Handle special continuation use case
    if (useCaseId === 'continuation-analysis') {
      // Try to find existing continuation use case
      let useCase = await fetchUseCaseByName('Continuation Analysis');
      
      if (!useCase) {
        // If it doesn't exist, fall back to a general analysis use case
        useCase = await fetchUseCaseByName('Landing Page Analysis');
        console.log('Using fallback use case for continuation analysis');
      }
      
      return useCase;
    }

    // Regular use case validation
    const useCase = await fetchUseCase(useCaseId);
    if (!useCase) {
      throw new Error(`Use case not found: ${useCaseId}`);
    }
    
    return useCase;
  };

  return { validateUseCase };
};
