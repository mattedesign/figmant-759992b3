
import React, { useState, useEffect } from 'react';
import { FigmantMainContent } from './FigmantMainContent';
import { FigmantSidebar } from './FigmantSidebar';
import { MobileNavigation } from './navigation/MobileNavigation';
import { AnalysisNavigationSidebar } from './pages/analysis/components/AnalysisNavigationSidebar';
import { useChatState } from './pages/analysis/ChatStateManager';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

export const FigmantLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const chatState = useChatState();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleBackToList = () => {
    setSelectedAnalysis(null);
  };

  const handleRightSidebarModeChange = (mode: string) => {
    console.log('Right sidebar mode changed to:', mode);
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
    // Could open a modal or preview
  };

  // Show Analysis Assets panel only on chat page
  const showAnalysisAssetsPanel = activeSection === 'chat';

  // Debug the chat state connection with more detailed logging
  console.log('🔧 FIGMANT LAYOUT - Debug chat state:', {
    activeSection,
    showAnalysisAssetsPanel,
    chatStateExists: !!chatState,
    messages: chatState.messages?.length || 0,
    attachments: chatState.attachments?.length || 0,
    attachmentDetails: chatState.attachments?.map(att => ({ 
      id: att.id, 
      type: att.type, 
      name: att.name, 
      status: att.status,
      url: att.url 
    })) || [],
    setAttachmentsExists: !!chatState.setAttachments
  });

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-hidden" style={{ background: 'transparent' }}>
        {/* Mobile Header with Navigation */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">figmant</h1>
          <MobileNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        
        {/* Mobile Main Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <FigmantMainContent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            selectedAnalysis={selectedAnalysis}
            onBackToList={handleBackToList}
            onRightSidebarModeChange={handleRightSidebarModeChange}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>
      </div>
    );
  }

  // Desktop layout with fixed sidebar, main content, and optional analysis assets panel
  return (
    <div className="min-h-screen h-screen flex w-full gap-4 overflow-hidden" style={{ background: 'transparent' }}>
      <div className="flex-shrink-0">
        <FigmantSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCollapsedChange={handleSidebarCollapsedChange}
        />
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <FigmantMainContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedAnalysis={selectedAnalysis}
          onBackToList={handleBackToList}
          onRightSidebarModeChange={handleRightSidebarModeChange}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Analysis Assets Panel - Only show on chat page */}
      {showAnalysisAssetsPanel && (
        <div className="flex-shrink-0">
          <AnalysisNavigationSidebar
            messages={chatState.messages || []}
            attachments={chatState.attachments || []}
            onRemoveAttachment={chatState.setAttachments ? (id) => {
              console.log('🗑️ FIGMANT LAYOUT - Removing attachment via sidebar:', id);
              chatState.setAttachments(prev => {
                const updated = prev.filter(att => att.id !== id);
                console.log('🗑️ FIGMANT LAYOUT - Updated attachments after removal via sidebar:', updated.length);
                return updated;
              });
            } : () => {
              console.warn('🗑️ FIGMANT LAYOUT - setAttachments not available');
            }}
            onViewAttachment={handleViewAttachment}
            lastAnalysisResult={null}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>
      )}
    </div>
  );
};
