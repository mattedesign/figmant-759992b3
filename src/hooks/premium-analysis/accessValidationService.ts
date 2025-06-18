
import { useCreditAccess } from '@/hooks/credits/useCreditAccess';

export class AccessValidationService {
  constructor(
    private checkUserAccess: () => Promise<boolean>,
    private deductAnalysisCredits: (amount: number, description: string) => Promise<boolean>
  ) {}

  async validateAndDeductCredits(selectedPrompt: any): Promise<void> {
    console.log('🔍 PREMIUM ANALYSIS - Checking user access...');
    const hasAccess = await this.checkUserAccess();
    if (!hasAccess) {
      console.error('🔍 PREMIUM ANALYSIS - User does not have access');
      throw new Error('You need credits to perform premium analysis. Please purchase credits to continue.');
    }
    console.log('🔍 PREMIUM ANALYSIS - User has access confirmed');

    // Deduct credits for premium analysis (5 credits for premium analysis)
    // Owners get unlimited access (tracked but not charged)
    // All other users get charged 5 credits
    console.log('🔍 PREMIUM ANALYSIS - Attempting to deduct credits...');
    const creditsDeducted = await this.deductAnalysisCredits(5, `Premium analysis: ${selectedPrompt.category}`);
    if (!creditsDeducted) {
      console.error('🔍 PREMIUM ANALYSIS - Failed to process credits');
      throw new Error('Unable to process premium analysis. Please check your credit balance.');
    }
    console.log('🔍 PREMIUM ANALYSIS - Credits processed successfully');
  }
}

export const useAccessValidationService = () => {
  const { checkUserAccess, deductAnalysisCredits } = useCreditAccess();
  
  return new AccessValidationService(checkUserAccess, deductAnalysisCredits);
};
