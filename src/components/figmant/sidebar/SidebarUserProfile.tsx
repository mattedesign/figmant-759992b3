
import React from 'react';
import { 
  User,
  LogOut,
  CreditCard,
  UserCog,
  Settings,
  Home
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarUserProfileProps {
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
  isCollapsed?: boolean;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  isOwner,
  profile,
  user,
  subscription,
  signOut,
  isCollapsed = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    console.log('SidebarUserProfile: Initiating sign out...');
    try {
      await signOut();
      console.log('SidebarUserProfile: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('SidebarUserProfile: Sign out error:', error);
    }
  };

  const isOnFigmant = location.pathname.startsWith('/figmant');
  const currentSection = location.pathname.split('/')[2];

  if (isCollapsed) {
    return (
      <div className="p-2 border-t border-gray-200/30 mt-auto flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
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
            
            {/* Main App */}
            <DropdownMenuItem 
              onClick={() => navigate('/figmant/dashboard')}
              className={isOnFigmant && currentSection === 'dashboard' ? 'bg-accent' : ''}
            >
              <Home className="mr-2 h-4 w-4" />
              Main App
            </DropdownMenuItem>

            {/* Admin Access for Owners */}
            {isOwner && (
              <DropdownMenuItem 
                onClick={() => navigate('/figmant/admin')}
                className={isOnFigmant && currentSection === 'admin' ? 'bg-accent' : ''}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Admin
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
  }

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
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
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
          
          {/* Profile Management */}
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <Settings className="mr-2 h-4 w-4" />
            Profile & Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Main App */}
          <DropdownMenuItem 
            onClick={() => navigate('/figmant/dashboard')}
            className={isOnFigmant && currentSection === 'dashboard' ? 'bg-accent' : ''}
          >
            <Home className="mr-2 h-4 w-4" />
            Main App
          </DropdownMenuItem>

          {/* Admin Access for Owners */}
          {isOwner && (
            <DropdownMenuItem 
              onClick={() => navigate('/figmant/admin')}
              className={isOnFigmant && currentSection === 'admin' ? 'bg-accent' : ''}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Admin
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
