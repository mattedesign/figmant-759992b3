
import React, { useState, useEffect } from 'react';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { NavigationSectionList } from './components/NavigationSectionList';
import { AnalysisRightPanelHeader } from './components/AnalysisRightPanelHeader';
import { useChatAttachments } from '@/hooks/useChatAttachments';

interface AnalysisRightPanelProps {
  currentSessionId?: string;
  analysisMessages?: any[];
  lastAnalysisResult?: any;
  historicalAnalysis?: any; // Add support for historical analysis
  onRemoveAttachment?: (id: string) => void;
  onViewAttachment?: (attachment: ChatAttachment) => void;
}

export const AnalysisRightPanel: React.FC<AnalysisRightPanelProps> = ({
  currentSessionId,
  analysisMessages = [],
  lastAnalysisResult,
  historicalAnalysis,
  onRemoveAttachment,
  onViewAttachment
}) => {
  const [activeTab, setActiveTab] = useState('details');
  
  const { 
    attachments, 
    loading: attachmentsLoading, 
    error: attachmentsError,
    removeAttachment: removeAttachmentFromDB,
    refresh: refreshAttachments
  } = useChatAttachments(currentSessionId || null);

  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');
  
  // Calculate total attachments including historical ones
  const historicalAttachmentCount = historicalAnalysis ? 
    (historicalAnalysis.batch_uploads?.length || 0) + 
    (historicalAnalysis.analysis_settings?.urls?.length || 0) : 0;
  
  const totalAttachments = attachments.length + historicalAttachmentCount;

  useEffect(() => {
    if (currentSessionId) {
      refreshAttachments();
    }
  }, [currentSessionId, refreshAttachments]);

  console.log('🎯 ANALYSIS RIGHT PANEL - Rendering with:', {
    currentSessionId,
    currentAttachments: attachments.length,
    historicalAnalysis: !!historicalAnalysis,
    historicalAttachmentCount,
    totalAttachments,
    hasLastAnalysisResult: !!lastAnalysisResult
  });

  const handleRemoveAttachment = async (id: string) => {
    try {
      // Remove from database first
      await removeAttachmentFromDB(id);
      
      // Then call parent handler if provided
      if (onRemoveAttachment) {
        onRemoveAttachment(id);
      }
    } catch (error) {
      console.error('Error removing attachment:', error);
    }
  };

  const handleViewAttachment = (attachment: ChatAttachment) => {
    if (onViewAttachment) {
      onViewAttachment(attachment);
    } else if (attachment.type === 'url' && attachment.url) {
      window.open(attachment.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-80 max-w-[240px] border-l border-gray-200 flex flex-col h-full" style={{ backgroundColor: '#FFF' }}>
      {/* Fixed Header with Tabs */}
      <AnalysisRightPanelHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalAttachments={totalAttachments}
      />

      {/* Loading State */}
      {attachmentsLoading && !historicalAnalysis && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading attachments...</div>
        </div>
      )}

      {/* Error State */}
      {attachmentsError && !historicalAnalysis && (
        <div className="p-4">
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            Error loading attachments: {attachmentsError}
          </div>
        </div>
      )}

      {/* Content */}
      {(!attachmentsLoading || historicalAnalysis) && !attachmentsError && (
        <NavigationSectionList
          fileAttachments={fileAttachments}
          urlAttachments={urlAttachments}
          analysisMessages={analysisMessages}
          lastAnalysisResult={lastAnalysisResult}
          historicalAnalysis={historicalAnalysis}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};
