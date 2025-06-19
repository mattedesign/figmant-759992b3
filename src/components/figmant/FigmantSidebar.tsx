
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { ChevronDown } from 'lucide-react';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarCredits } from './sidebar/SidebarCredits';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
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
  Settings,
  User
} from 'lucide-react';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange,
  onCollapsedChange
}) => {
  const { isOwner, profile, user, subscription, signOut } = useAuth();
  const { credits, creditsLoading } = useUserCredits();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  const handleSignOut = async () => {
    console.log('FigmantSidebar: Initiating sign out...');
    try {
      await signOut();
      console.log('FigmantSidebar: Sign out successful, navigating to auth');
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('FigmantSidebar: Sign out error:', error);
    }
  };

  const isOnOwnerDashboard = location.pathname === '/owner';
  const isOnSubscriberDashboard = location.pathname === '/dashboard';
  const isOnFigmant = location.pathname === '/figmant';

  return (
    <div 
      className={`h-screen flex flex-col transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
      style={{ 
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        background: 'var(--Surface-01, #FCFCFC)'
      }}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* User Profile Section - Positioned after header when NOT collapsed */}
      {!isCollapsed && (
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
      )}
      
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isOwner={isOwner}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Credits Section - Only show for non-owners and when not collapsed */}
      {!isOwner && !isCollapsed && (
        <div className="flex-shrink-0">
          <SidebarCredits 
            currentBalance={currentBalance}
            totalPurchased={totalPurchased}
            creditsLoading={creditsLoading}
          />
        </div>
      )}

      {/* Keep the original user profile at bottom for collapsed state only */}
      {isCollapsed && (
        <div className="flex-shrink-0">
          <SidebarUserProfile 
            isOwner={isOwner}
            profile={profile}
            user={user}
            subscription={subscription}
            signOut={signOut}
            isCollapsed={isCollapsed}
          />
        </div>
      )}
    </div>
  );
};
