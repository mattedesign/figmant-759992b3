
import React, { useState, useEffect } from 'react';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { ScreenshotModal } from '../../../analysis/ScreenshotModal';
import { useChatStateContext } from './ChatStateProvider';
import { useAnalysisChatHandler } from '../hooks/useAnalysisChatHandler';
import { useLocation } from 'react-router-dom';

export const DesktopChatLayout: React.FC = () => {
  const location = useLocation();
  const {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    getCurrentTemplate,
    sessionAttachments,
    sessionLinks,
    currentSessionId
  } = useChatStateContext();

  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [historicalAnalysisData, setHistoricalAnalysisData] = useState<any>(null);

  const selectedTemplate = getCurrentTemplate();

  const {
    handleSendMessage,
    canSend,
    isAnalyzing
  } = useAnalysisChatHandler(
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    selectedTemplate
  );

  // Check for historical analysis data from navigation
  useEffect(() => {
    if (location.state?.historicalData) {
      console.log('🖥️ DESKTOP CHAT LAYOUT - Loading historical analysis:', location.state.historicalData);
      setHistoricalAnalysisData(location.state.historicalData);
    } else {
      setHistoricalAnalysisData(null);
    }
  }, [location.state]);

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleViewAttachment = (attachment: any) => {
    setSelectedAttachment(attachment);
    setScreenshotModalOpen(true);
  };

  const allAttachments = [...sessionAttachments, ...sessionLinks];

  console.log('🖥️ DESKTOP CHAT LAYOUT - Rendering with:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    sessionAttachmentsCount: sessionAttachments.length,
    sessionLinksCount: sessionLinks.length,
    totalAttachments: allAttachments.length,
    hasHistoricalData: !!historicalAnalysisData,
    currentSessionId,
    selectedTemplate: selectedTemplate?.title
  });

  return (
    <div className="h-full flex">
      {/* Left Navigation Sidebar */}
      <div className={`${isRightPanelCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 transition-all duration-300`}>
        <AnalysisNavigationSidebar
          messages={messages}
          attachments={allAttachments}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
          lastAnalysisResult={lastAnalysisResult}
          isCollapsed={isRightPanelCollapsed}
          onToggleCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
          historicalAnalysis={historicalAnalysisData}
        />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 min-w-0">
        <DesignChatInterface
          onSendMessage={handleSendMessage}
          messages={messages}
          attachments={attachments}
          setAttachments={setAttachments}
          isProcessing={isAnalyzing}
          canSend={canSend}
          selectedTemplate={selectedTemplate}
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          onTemplateChange={setSelectedTemplateId}
          onAnalysisComplete={setLastAnalysisResult}
          placeholder="Describe your design challenge or ask for analysis..."
          hideRightPanel={true}
        />
      </div>

      {/* Screenshot Modal */}
      {screenshotModalOpen && selectedAttachment && (
        <ScreenshotModal
          isOpen={screenshotModalOpen}
          onClose={() => {
            setScreenshotModalOpen(false);
            setSelectedAttachment(null);
          }}
          screenshot={selectedAttachment}
          screenshots={[selectedAttachment]}
          currentIndex={0}
          onNext={() => {}}
          onPrevious={() => {}}
        />
      )}
    </div>
  );
};
