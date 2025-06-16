
import React from 'react';
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

  const currentBalance = credits?.current_balance || 0;
  const totalPurchased = credits?.total_purchased || 0;

  return (
    <div className="w-64 bg-transparent border-r border-gray-200/30 flex flex-col min-h-screen backdrop-blur-sm">
      <SidebarHeader />
      
      <SidebarNavigation 
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        isOwner={isOwner}
      />

      {/* Credits Section - Only show for non-owners */}
      {!isOwner && (
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
      />
    </div>
  );
};
