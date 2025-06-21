
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { SidebarLayout } from './components/SidebarLayout';
import { useSidebarResponsiveHandler } from './components/SidebarResponsiveHandler';

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

  const { handleToggleCollapse } = useSidebarResponsiveHandler({
    isCollapsed,
    setIsCollapsed,
    onCollapsedChange
  });

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  // Wrap onSectionChange with logging
  const handleSectionChange = (section: string) => {
    console.log('🔍 FIGMANT SIDEBAR - Section change triggered:', section);
    console.log('🔍 FIGMANT SIDEBAR - Current active section:', activeSection);
    onSectionChange(section);
  };

  return (
    <SidebarLayout 
      isCollapsed={isCollapsed}
      onToggleCollapse={handleToggleCollapse}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      isOwner={isOwner}
      profile={profile}
      user={user}
      subscription={subscription}
      signOut={signOut}
      currentBalance={currentBalance}
      totalPurchased={totalPurchased}
      creditsLoading={creditsLoading}
    />
  );
};
