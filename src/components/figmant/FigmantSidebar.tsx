import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCredits } from '@/hooks/useUserCredits';
import { ChevronDown } from 'lucide-react';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarCredits } from './sidebar/SidebarCredits';
import { SidebarUserProfile } from './sidebar/SidebarUserProfile';

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
      
      {/* User Profile Section - Positioned after header when NOT collapsed */}
      {!isCollapsed && (
        <div className="flex-shrink-0 px-6 py-4">
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {profile?.full_name || user?.email?.split('@')[0] || 'Matthew Brown'}
              </h2>
              <p className="text-sm text-gray-500">
                Personal Account
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-3" />
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
