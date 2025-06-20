
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from '../navigation/components/SidebarNavigation';
import { SidebarCredits } from './SidebarCredits';
import { SidebarUserProfile } from './SidebarUserProfile';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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

  const getSidebarClasses = () => {
    const baseClasses = "flex flex-col transition-all duration-300 overflow-hidden";
    const widthClasses = isCollapsed ? 'w-16' : (isTablet ? 'w-64' : 'w-72');
    return `${baseClasses} ${widthClasses}`;
  };

  const getSidebarStyle = () => {
    return { 
      height: 'calc(100vh - 24px)', // Account for the 12px padding on top and bottom
      borderRadius: isTablet ? '16px' : '20px',
      border: '1px solid var(--Stroke-01, #ECECEC)',
      background: 'var(--Surface-01, #FCFCFC)'
    };
  };

  const getUserProfileClasses = () => {
    if (isTablet) {
      return "flex-shrink-0 px-3 py-2 border-b border-gray-200/30";
    }
    return "flex-shrink-0 px-4 py-3 border-b border-gray-200/30";
  };

  const getUserProfileCardClasses = () => {
    if (isTablet) {
      return "flex items-center gap-2 p-2 rounded-lg";
    }
    return "flex items-center gap-3 p-2 rounded-lg";
  };

  const getAvatarClasses = () => {
    if (isTablet) {
      return "w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0";
    }
    return "w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0";
  };

  const getAvatarTextClasses = () => {
    if (isTablet) {
      return "text-xs font-medium text-gray-600";
    }
    return "text-sm font-medium text-gray-600";
  };

  const getUserNameClasses = () => {
    if (isTablet) {
      return "text-sm font-medium text-gray-900 truncate";
    }
    return "text-sm font-medium text-gray-900 truncate";
  };

  const getUserEmailClasses = () => {
    if (isTablet) {
      return "text-xs text-gray-500 truncate";
    }
    return "text-xs text-gray-500 truncate";
  };

  return (
    <div 
      className={getSidebarClasses()}
      style={getSidebarStyle()}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* User Profile Section - Positioned after header when NOT collapsed */}
      {!isCollapsed && (
        <div className={getUserProfileClasses()}>
          <div 
            className={getUserProfileCardClasses()}
            style={{
              borderRadius: isTablet ? '8px' : '11px',
              border: '1px solid rgba(10, 12, 17, 0.10)',
              background: '#FFF'
            }}
          >
            <div className={getAvatarClasses()}>
              <span className={getAvatarTextClasses()}>
                {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className={getUserNameClasses()}>
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div className={getUserEmailClasses()}>
                {profile?.email || user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation - Takes remaining space, no overflow issues */}
      <div className="flex-1 min-h-0 overflow-hidden">
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
    </div>
  );
};
