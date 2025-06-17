
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarCredits } from './sidebar/SidebarCredits';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const { isOwner, profile, user, subscription, signOut } = useAuth();
  const { credits, creditsLoading } = useUserCredits();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div 
      className={`border-r border-gray-200/30 flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64 xl:max-w-[240px]'
      }`}
      style={{ background: 'transparent' }}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse} 
      />
      
      <SidebarNavigation 
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isOwner={isOwner}
        isCollapsed={isCollapsed}
      />

      {/* Credits Section - Only show for non-owners and when not collapsed */}
      {!isOwner && !isCollapsed && (
        <SidebarCredits 
          currentBalance={currentBalance}
          totalPurchased={totalPurchased}
          creditsLoading={creditsLoading}
        />
      )}

      <SidebarUserProfile 
        isOwner={isOwner}
        profile={profile}
        user={user}
        subscription={subscription}
        signOut={signOut}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};
