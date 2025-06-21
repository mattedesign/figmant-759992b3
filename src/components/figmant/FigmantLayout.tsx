
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FigmantSidebar } from './sidebar/FigmantSidebar';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantRightSidebar } from './FigmantRightSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { useScreenSize } from '@/hooks/use-mobile';
import { useAutomaticProfileRecovery } from '@/hooks/useAutomaticProfileRecovery';

interface FigmantLayoutProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  children?: React.ReactNode;
}

export const FigmantLayout: React.FC<FigmantLayoutProps> = ({
  activeSection: propActiveSection,
  onSectionChange: propOnSectionChange,
  children
}) => {
  const { user } = useAuth();
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isRecovering } = useAutomaticProfileRecovery();
  const { section } = useParams();
  const navigate = useNavigate();

  // Internal state management for navigation
  const [internalActiveSection, setInternalActiveSection] = useState(section || 'dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [rightSidebarMode, setRightSidebarMode] = useState('attachments');

  // Use external props if provided, otherwise use internal state
  const activeSection = propActiveSection || internalActiveSection;
  const onSectionChange = propOnSectionChange || ((newSection: string) => {
    setInternalActiveSection(newSection);
    navigate(`/figmant/${newSection}`);
  });

  // Update internal state when URL params change
  useEffect(() => {
    if (section && section !== internalActiveSection) {
      setInternalActiveSection(section);
    }
  }, [section, internalActiveSection]);

  // Responsive sidebar state management
  useEffect(() => {
    if (isTablet && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    } else if (isDesktop && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isTablet, isDesktop, sidebarCollapsed]);

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    setRightSidebarMode(mode);
  };

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
          <FigmantMainContent 
            activeSection={activeSection}
            setActiveSection={onSectionChange}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={handleRightSidebarModeChange}
            isSidebarCollapsed={sidebarCollapsed}
          />
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
            <FigmantMainContent 
              activeSection={activeSection}
              setActiveSection={onSectionChange}
              selectedAnalysis={selectedAnalysis}
              onBackToList={handleBackToList}
              onRightSidebarModeChange={handleRightSidebarModeChange}
              isSidebarCollapsed={sidebarCollapsed}
            />
            {children}
          </div>

          {/* Right Sidebar - Only show on desktop when needed */}
          {isDesktop && (
            <div className="w-80 flex-shrink-0 p-3 pl-0">
              <FigmantRightSidebar 
                mode={rightSidebarMode}
                activeSection={activeSection}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
