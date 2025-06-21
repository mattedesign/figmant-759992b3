
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisNavigationHeader } from './AnalysisNavigationHeader';
import { NavigationSectionList } from './NavigationSectionList';

interface AnalysisNavigationSidebarProps {
  messages: ChatMessage[];
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  onViewAttachment: (attachment: ChatAttachment) => void;
  lastAnalysisResult?: any;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AnalysisNavigationSidebar: React.FC<AnalysisNavigationSidebarProps> = ({
  messages,
  attachments,
  onRemoveAttachment,
  onViewAttachment,
  lastAnalysisResult,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState('details');

  // Separate files and URLs from attachments
  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');
  
  // Get analysis messages from conversation
  const analysisMessages = messages.filter(msg => msg.role === 'assistant');

  // Add effect to track when attachments change
  useEffect(() => {
    console.log('🎯 ANALYSIS NAVIGATION SIDEBAR - Attachments updated:', {
      totalAttachments: attachments.length,
      fileAttachmentsCount: fileAttachments.length,
      urlAttachmentsCount: urlAttachments.length,
      attachmentDetails: attachments.map(att => ({ 
        id: att.id, 
        type: att.type, 
        name: att.name, 
        status: att.status,
        url: att.url 
      }))
    });
  }, [attachments]);

  console.log('🎯 ANALYSIS NAVIGATION SIDEBAR - Rendering with:', {
    totalAttachments: attachments.length,
    fileAttachmentsCount: fileAttachments.length,
    urlAttachmentsCount: urlAttachments.length,
    analysisMessagesCount: analysisMessages.length,
    hasLastAnalysisResult: !!lastAnalysisResult,
    activeTab,
    isCollapsed,
    attachmentDetails: attachments.map(att => ({ 
      id: att.id, 
      type: att.type, 
      name: att.name, 
      status: att.status,
      url: att.url 
    }))
  });

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-full'} h-full transition-all duration-300 flex flex-col overflow-hidden mb-3`}
      style={{
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        background: 'var(--Surface-01, #FCFCFC)'
      }}
    >
      {!isCollapsed && (
        <div className="flex flex-col h-full">
          <AnalysisNavigationHeader 
            onToggleCollapse={onToggleCollapse}
          />

          {/* Content with tabs moved down */}
          <NavigationSectionList
            fileAttachments={fileAttachments}
            urlAttachments={urlAttachments}
            analysisMessages={analysisMessages}
            lastAnalysisResult={lastAnalysisResult}
            onRemoveAttachment={onRemoveAttachment}
            onViewAttachment={onViewAttachment}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}
      
      {isCollapsed && onToggleCollapse && (
        <div className="h-full flex items-start pt-4 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
