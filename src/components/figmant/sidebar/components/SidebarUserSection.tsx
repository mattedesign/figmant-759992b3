
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut,
  CreditCard,
  LayoutDashboard,
  Shield,
  UserCog,
  Settings
} from 'lucide-react';

interface SidebarUserSectionProps {
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
}

export const SidebarUserSection: React.FC<SidebarUserSectionProps> = ({
  isOwner,
  profile,
  user,
  subscription,
  signOut
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    console.log('SidebarUserSection: Initiating sign out...');
    try {
      await signOut();
      console.log('SidebarUserSection: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('SidebarUserSection: Sign out error:', error);
    }
  };

  const isOnOwnerDashboard = location.pathname === '/owner';
  const isOnSubscriberDashboard = location.pathname === '/dashboard';
  const isOnFigmant = location.pathname === '/figmant';

  return (
    <div className="px-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50/50 rounded-lg p-2 transition-colors">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gray-100">
                <User className="h-5 w-5 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {profile?.full_name || user?.email?.split('@')[0] || 'Matthew Brown'}
              </h2>
              <p className="text-sm text-gray-500">Personal Account</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Profile Management */}
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <Settings className="mr-2 h-4 w-4" />
            Profile & Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Dashboard Navigation - Only show for owners */}
          {isOwner && (
            <>
              <DropdownMenuItem 
                onClick={() => navigate('/dashboard')}
                className={isOnSubscriberDashboard ? 'bg-accent' : ''}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Subscriber Dashboard
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => navigate('/owner')}
                className={isOnOwnerDashboard ? 'bg-accent' : ''}
              >
                <Shield className="mr-2 h-4 w-4" />
                Owner Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => navigate('/figmant', { state: { activeSection: 'admin' } })}
                className={isOnFigmant && location.state?.activeSection === 'admin' ? 'bg-accent' : ''}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Admin
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
            </>
          )}

          {/* Regular dashboard link for non-owners */}
          {!isOwner && (
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => navigate('/subscription')}>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscription
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
