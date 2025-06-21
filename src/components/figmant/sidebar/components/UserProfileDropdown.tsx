
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LogOut,
  CreditCard,
  UserCog,
  Settings,
  Home
} from 'lucide-react';

interface UserProfileDropdownProps {
  isOwner: boolean;
  profile: any;
  user: any;
  onSignOut: () => Promise<void>;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOwner,
  profile,
  user,
  onSignOut
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    console.log('FigmantSidebar: Initiating sign out...');
    try {
      await onSignOut();
      console.log('FigmantSidebar: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('FigmantSidebar: Sign out error:', error);
    }
  };

  const isOnFigmant = location.pathname.startsWith('/figmant');
  const currentSection = location.pathname.split('/')[2];

  return (
    <div className="flex-shrink-0 px-6 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex-1">
              <h2 
                style={{
                  overflow: 'hidden',
                  color: 'var(--Text-Primary, #121212)',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '24px',
                  letterSpacing: '-0.3px',
                  marginBottom: '4px'
                }}
              >
                {profile?.full_name || user?.email?.split('@')[0] || 'Matthew Brown'}
              </h2>
              <p 
                style={{
                  overflow: 'hidden',
                  color: 'var(--Text-Secondary, #7B7B7B)',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '16px',
                  letterSpacing: '-0.12px'
                }}
              >
                Personal Account
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-3" />
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
