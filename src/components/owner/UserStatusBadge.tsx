
import { Badge } from '@/components/ui/badge';
import { UserManagementProfile, UserCreditsData } from '@/types/userManagement';

interface UserStatusBadgeProps {
  user: UserManagementProfile;
  creditsMap: Map<string, UserCreditsData> | undefined;
}

export const UserStatusBadge = ({ user, creditsMap }: UserStatusBadgeProps) => {
  const getUserActivityStatus = (user: UserManagementProfile) => {
    const subscription = user.subscriptions?.[0];
    const credits = creditsMap?.get(user.id);
    
    if (user.role === 'owner') return 'Active (Owner)';
    if (subscription?.status === 'active') return 'Active (Subscribed)';
    if (credits && credits.current_balance > 0) return `Active (${credits.current_balance} credits)`;
    return 'Inactive';
  };

  const status = getUserActivityStatus(user);
  const isActive = status.startsWith('Active');
  
  return (
    <Badge variant={isActive ? 'default' : 'outline'}>
      {status}
    </Badge>
  );
};
