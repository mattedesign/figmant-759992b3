// src/components/layout/UserMenu.tsx

import { User, Settings, LogOut, CreditCard, UserCog, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

export const UserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    console.log('UserMenu: Initiating sign out...');
    try {
      await signOut();
      console.log('UserMenu: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('UserMenu: Sign out error:', error);
    }
  };

  const isOwner = profile?.role === 'owner';
  const isOnFigmant = location.pathname.startsWith('/figmant');
  const currentSection = location.pathname.split('/')[2]; // Get section from /figmant/section

  // Get avatar URL from the profiles table data
  const avatarUrl = profile ? (profile as any).avatar_url : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gray-100">
              <User className="h-4 w-4 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">
              {profile?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.email}
            </div>
          </div>
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
        
        {/* Main App - Unified Dashboard */}
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
  );
};