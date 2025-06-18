
import { useUserCredits } from '@/hooks/useUserCredits';

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
      throw new Error('You need an active subscription or credits to perform premium analysis. Please upgrade your plan or purchase credits.');
    }
    console.log('🔍 PREMIUM ANALYSIS - User has access confirmed');

    // FEATURE PARITY: Deduct credits for premium analysis
    // Active subscribers and owners get unlimited access (tracked but not charged)
    // Inactive users with credits get charged
    console.log('🔍 PREMIUM ANALYSIS - Attempting to deduct credits...');
    const creditsDeducted = await this.deductAnalysisCredits(5, `Premium analysis: ${selectedPrompt.category}`);
    if (!creditsDeducted) {
      console.error('🔍 PREMIUM ANALYSIS - Failed to process credits');
      throw new Error('Unable to process premium analysis. Please check your subscription status or credit balance.');
    }
    console.log('🔍 PREMIUM ANALYSIS - Credits processed successfully');
  }
}

export const useAccessValidationService = () => {
  const { checkUserAccess, deductAnalysisCredits } = useUserCredits();
  
  return new AccessValidationService(checkUserAccess, deductAnalysisCredits);
};
