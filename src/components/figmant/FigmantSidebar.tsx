
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarCredits } from './sidebar/SidebarCredits';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';
import { cn } from '@/lib/utils';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "border-r border-gray-200/30 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-white shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )} 
    >
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />
      
      <SidebarNavigation 
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isOwner={isOwner}
        isCollapsed={isCollapsed}
      />

      {/* Credits Section - Only show for non-owners when not collapsed */}
      {!isOwner && !isCollapsed && (
        <SidebarCredits 
          currentBalance={currentBalance}
          totalPurchased={totalPurchased}
          creditsLoading={creditsLoading}
        />
      )}

      {/* User Profile - Adjust for collapsed state */}
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
