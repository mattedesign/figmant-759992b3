
import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarCollapsedViewProps {
  mainMenuItems: MenuItem[];
  supportItems: MenuItem[];
  adminItems?: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleCollapse: (collapsed: boolean) => void;
  isOwner: boolean;
  profile: any;
  user: any;
  subscription: any;
  signOut: () => Promise<void>;
}

export const SidebarCollapsedView: React.FC<SidebarCollapsedViewProps> = () => {
  // This component is disabled - navigation is now handled by SidebarNavigation
  return null;
};
