
import { useUserCredits } from '@/hooks/useUserCredits';

export class AccessValidationService {
  constructor(
    private checkUserAccess: () => Promise<boolean>,
    private deductAnalysisCredits: (amount: number, description: string) => Promise<boolean>
  ) {}

  async validateAndDeductCredits(selectedPrompt: any): Promise<void> {
    console.log('🔍 Checking user access...');
    const hasAccess = await this.checkUserAccess();
    if (!hasAccess) {
      console.error('🔍 User does not have access');
      throw new Error('You need an active subscription or credits to perform premium analysis. Please upgrade your plan or purchase credits.');
    }
    console.log('🔍 User has access confirmed');

    // Deduct credits for premium analysis (5 credits)
    console.log('🔍 Attempting to deduct 5 credits...');
    const creditsDeducted = await this.deductAnalysisCredits(5, `Premium analysis: ${selectedPrompt.category}`);
    if (!creditsDeducted) {
      console.error('🔍 Failed to deduct credits');
      throw new Error('Unable to deduct credits for premium analysis. Please check your credit balance.');
    }
    console.log('🔍 Credits deducted successfully');
  }
}

export const useAccessValidationService = () => {
  const { checkUserAccess, deductAnalysisCredits } = useUserCredits();
  
  return new AccessValidationService(checkUserAccess, deductAnalysisCredits);
};
