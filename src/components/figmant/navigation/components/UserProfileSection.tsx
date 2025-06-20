
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, CreditCard, User, LogOut, Shield, LayoutDashboard, UserCog } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfileSectionProps {
  onNavigate: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  onNavigate,
  activeSection,
  onSectionChange
}) => {
  const { isOwner, user, profile, signOut } = useAuth();
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

  const handleSectionNavigation = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
      onNavigate();
    } else {
      // Fallback to direct navigation if section change not available
      const routeMap: Record<string, string> = {
        'dashboard': '/figmant',
        'admin': '/figmant',
        'owner': '/owner',
        'subscriber': '/dashboard'
      };
      
      const route = routeMap[section] || '/figmant';
      if (section === 'admin') {
        navigate(route, { state: { activeSection: 'admin' } });
      } else {
        navigate(route);
      }
      onNavigate();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-gray-100">
            <User className="h-5 w-5 text-gray-500" />
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

      {/* Quick Dashboard Actions */}
      <div className="space-y-1 mb-4">
        {isOwner && (
          <>
            {/* Main Figmant Dashboard */}
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-sm ${
                activeSection === 'dashboard' ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => handleSectionNavigation('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Main Dashboard
            </Button>
            
            {/* Admin Section */}
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-sm ${
                activeSection === 'admin' ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => handleSectionNavigation('admin')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>

            {/* Legacy Owner Dashboard (External) */}
            <Button
              variant="ghost"
              className="w-full justify-start h-10 text-sm border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              onClick={() => handleProfileNavigation('/owner')}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Legacy Owner Dashboard
            </Button>

            {/* Legacy Subscriber Dashboard (External) */}
            <Button
              variant="ghost"
              className="w-full justify-start h-10 text-sm border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => handleProfileNavigation('/dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Legacy Subscriber Dashboard
            </Button>
          </>
        )}
        
        {!isOwner && (
          <>
            {/* Main Dashboard for Non-Owners */}
            <Button
              variant="ghost"
              className={`w-full justify-start h-10 text-sm ${
                activeSection === 'dashboard' ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => handleSectionNavigation('dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            {/* Legacy Subscriber Dashboard for Non-Owners */}
            <Button
              variant="ghost"
              className="w-full justify-start h-10 text-sm border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              onClick={() => handleProfileNavigation('/dashboard')}
            >
              <User className="mr-2 h-4 w-4" />
              Legacy Dashboard
            </Button>
          </>
        )}
      </div>

      {/* Profile & Account Actions */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-sm"
          onClick={() => handleProfileNavigation('/profile')}
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
