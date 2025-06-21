
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfileSectionProps {
  onNavigate: () => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  onNavigate
}) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log('MobileNavigation: Initiating sign out...');
    try {
      await signOut();
      console.log('MobileNavigation: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
      onNavigate();
    } catch (error) {
      console.error('MobileNavigation: Sign out error:', error);
    }
  };

  const handleProfileNavigation = (path: string) => {
    navigate(path);
    onNavigate();
  };

  return (
    <div className="border-t border-gray-200 p-4 mt-auto">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-gray-100">
            <div className="text-sm font-medium">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {user?.email}
          </div>
        </div>
      </div>

      {/* Profile Actions Only - NO duplicate navigation */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-sm"
          onClick={() => handleProfileNavigation('/figmant/profile')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Profile & Settings
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-sm"
          onClick={() => handleProfileNavigation('/subscription')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Subscription
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
