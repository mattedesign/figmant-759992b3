
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarHeader } from './SidebarHeader';
import { SidebarUserSection } from './components/SidebarUserSection';
import { SidebarNavigation } from '../navigation/components/SidebarNavigation';
import { SidebarCredits } from './SidebarCredits';
import { SidebarUserProfile } from './SidebarUserProfile';

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

  // Listen for parent layout's responsive state changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Let the parent layout control responsive behavior
      // This component just syncs with whatever the parent decides
      if (width >= 768 && width < 1024) {
        // Tablet range - should be collapsed
        if (!isCollapsed) {
          setIsCollapsed(true);
          onCollapsedChange?.(true);
        }
      } else if (width >= 1024) {
        // Desktop range - should be expanded
        if (isCollapsed) {
          setIsCollapsed(false);
          onCollapsedChange?.(false);
        }
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, onCollapsedChange]);

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  return (
    <div 
      className={`flex flex-col transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
      style={{ 
        height: 'calc(100vh - 24px)', // Account for the 12px padding on top and bottom
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
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200/30">
          <div 
            className="flex items-center gap-3 p-2 rounded-lg"
            style={{
              borderRadius: '11px',
              border: '1px solid rgba(10, 12, 17, 0.10)',
              background: '#FFF'
            }}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {profile?.email || user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isOwner={isOwner}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          profile={profile}
          user={user}
          subscription={subscription}
          signOut={signOut}
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
