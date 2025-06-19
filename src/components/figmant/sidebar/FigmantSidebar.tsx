
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarUserSection } from './components/SidebarUserSection';
import { SidebarNavigation } from '../SidebarNavigation';
import { SidebarCredits } from '../SidebarCredits';
import { SidebarUserProfile } from '../SidebarUserProfile';

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

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

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
      
      {/* User Profile Section - Positioned right after header when NOT collapsed */}
      {!isCollapsed && (
        <SidebarUserSection
          isOwner={isOwner}
          profile={profile}
          user={user}
          subscription={subscription}
          signOut={signOut}
        />
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

      {/* Keep the original user profile at bottom for collapsed state */}
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
