
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FigmantSidebar } from './sidebar/FigmantSidebar';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useScreenSize } from '@/hooks/use-mobile';
import { useAutomaticProfileRecovery } from '@/hooks/useAutomaticProfileRecovery';

interface FigmantLayoutProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  children?: React.ReactNode;
}

export const FigmantLayout: React.FC<FigmantLayoutProps> = ({
  activeSection,
  onSectionChange,
  children
}) => {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isRecovering } = useAutomaticProfileRecovery();

  // Responsive sidebar state management
  useEffect(() => {
    if (isTablet && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    } else if (isDesktop && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isTablet, isDesktop, sidebarCollapsed]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isRecovering) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Recovering your profile...</p>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Navigation - Fixed positioned hamburger menu */}
        <MobileNavigation 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        
        {/* Main Content - Full width on mobile */}
        <div className="pt-16 px-4 pb-6">
          <FigmantMainContent activeSection={activeSection} />
          {children}
        </div>
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Hidden on mobile, responsive on tablet/desktop */}
        <div className="flex-shrink-0 p-3">
          <FigmantSidebar
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            onCollapsedChange={setSidebarCollapsed}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <FigmantMainContent activeSection={activeSection} />
            {children}
          </div>

          {/* Right Sidebar - Only show on desktop when needed */}
          {isDesktop && (
            <div className="w-80 flex-shrink-0 p-3 pl-0">
              <FigmantRightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
