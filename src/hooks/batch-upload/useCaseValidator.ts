
import { fetchUseCase } from './databaseHelpers';

export const useUseCaseValidator = () => {
  const validateAndFetchUseCase = async (useCaseId: string) => {
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
