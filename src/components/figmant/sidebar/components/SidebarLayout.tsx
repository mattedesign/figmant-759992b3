
import React from 'react';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarNavigation } from '../../navigation/components/SidebarNavigation';
import { SidebarCredits } from '../SidebarCredits';
import { UserProfileDropdown } from './UserProfileDropdown';

interface SidebarLayoutProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
  currentBalance: number;
  totalPurchased: number;
  creditsLoading: boolean;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeSection,
  onSectionChange,
  isOwner,
  profile,
  user,
  subscription,
  signOut,
  currentBalance,
  totalPurchased,
  creditsLoading
}) => {
  return (
    <div 
      className={`h-screen flex flex-col transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{ 
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        backgroundColor: isCollapsed ? '#F8F9FA' : 'white'
      }}
    >
      <SidebarHeader 
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      
      {/* User Profile Section - Positioned after header when NOT collapsed */}
      {!isCollapsed && (
        <UserProfileDropdown 
          isOwner={isOwner}
          profile={profile}
          user={user}
          onSignOut={signOut}
        />
      )}
      
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isOwner={isOwner}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
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
