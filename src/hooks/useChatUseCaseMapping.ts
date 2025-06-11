
import { useDesignUseCases } from './useDesignUseCases';

export const useChatUseCaseMapping = () => {
  const { data: useCases = [] } = useDesignUseCases();

  const getCategoryForUseCase = (message: string): string => {
    const messageLower = message.toLowerCase();
    
    // Try to find a matching use case based on keywords
    const matchingUseCase = useCases.find(useCase => {
      const keywords = [
        ...useCase.name.toLowerCase().split(' '),
        ...useCase.description.toLowerCase().split(' ')
      ];
      
      return keywords.some(keyword => 
        messageLower.includes(keyword) && keyword.length > 3
      );
    });

    // Return the matched use case ID or fall back to a general one
    if (matchingUseCase) {
      return matchingUseCase.id;
    }

    // Default fallback - find the first general use case or use the first available
    const generalUseCase = useCases.find(uc => 
      uc.name.toLowerCase().includes('general') || 
      uc.name.toLowerCase().includes('comprehensive')
    );
    
    return generalUseCase?.id || useCases[0]?.id || 'general';
  };

  return { getCategoryForUseCase };
};
