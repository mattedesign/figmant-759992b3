
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  LogOut,
  CreditCard,
  LayoutDashboard,
  Shield,
  UserCog
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarUserProfileProps {
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  isOwner,
  profile,
  user,
  subscription,
  signOut
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = async () => {
    console.log('SidebarUserProfile: Initiating sign out...');
    try {
      await signOut();
      console.log('SidebarUserProfile: Sign out successful, navigating to auth');
      navigate('/auth');
    } catch (error) {
      console.error('SidebarUserProfile: Sign out error:', error);
    }
  };

  const getSubscriptionBadge = () => {
    if (profile?.role === 'owner') {
      return <Badge variant="default" className="ml-2">Owner</Badge>;
    }
    
    if (subscription?.status === 'active') {
      return <Badge variant="default" className="ml-2">Pro</Badge>;
    }
    
    return <Badge variant="secondary" className="ml-2">Free</Badge>;
  };

  const isOnOwnerDashboard = location.pathname === '/owner';
  const isOnSubscriberDashboard = location.pathname === '/dashboard';
  const isOnFigmant = location.pathname === '/figmant';

  return (
    <div className="p-4 border-t border-gray-200/30 mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div 
            className="flex items-center gap-3 p-2 hover:bg-gray-50/50 rounded-lg cursor-pointer transition-colors"
            style={{
              borderRadius: '11px',
              border: '1px solid rgba(10, 12, 17, 0.10)',
              background: '#FFF'
            }}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{getInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 flex items-center">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                {getSubscriptionBadge()}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {profile?.email || user?.email || 'user@example.com'}
              </div>
            </div>
            <div className="w-4 h-4 text-gray-400">↓</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
