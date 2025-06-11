
import { Button } from '@/components/ui/button';
import { Edit, Coins } from 'lucide-react';
import { UserManagementProfile } from '@/types/userManagement';
import { useAuth } from '@/contexts/AuthContext';

interface UserActionsProps {
  user: UserManagementProfile;
  onEditUser: (user: UserManagementProfile) => void;
  onManageCredits: (user: UserManagementProfile) => void;
  onUpdateUserRole: (userId: string, newRole: 'owner' | 'subscriber') => void;
}

export const UserActions = ({ 
  user, 
  onEditUser, 
  onManageCredits, 
  onUpdateUserRole 
}: UserActionsProps) => {
  const { user: currentUser } = useAuth();

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEditUser(user)}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onManageCredits(user)}
      >
        <Coins className="h-4 w-4 mr-1" />
        Credits
      </Button>
      {user.role === 'subscriber' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateUserRole(user.id, 'owner')}
        >
          Make Owner
        </Button>
      )}
      {user.role === 'owner' && user.id !== currentUser?.id && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateUserRole(user.id, 'subscriber')}
        >
          Remove Owner
        </Button>
      )}
    </div>
  );
};
