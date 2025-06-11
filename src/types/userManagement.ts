
import { UserProfile } from '@/types/auth';

// Extended interface for user management that includes subscription data
export interface UserManagementProfile extends UserProfile {
  subscriptions?: Array<{
    status: string;
    current_period_end: string | null;
    stripe_customer_id: string | null;
  }>;
}

export interface UserCreditsData {
  user_id: string;
  current_balance: number;
  total_purchased: number;
  total_used: number;
}
