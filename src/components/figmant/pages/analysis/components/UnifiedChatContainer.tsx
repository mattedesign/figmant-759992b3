
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { AnalysisChatContainer } from './AnalysisChatContainer';
import { AnalysisNavigationSidebar } from './AnalysisNavigationSidebar';
import { URLInputHandler } from './URLInputHandler';
import { ChatSessionHistory } from './ChatSessionHistory';
import { useChatState } from '../ChatStateManager';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { FileUploadService } from '../utils/fileUploadService';
import { useIsMobile } from '@/hooks/use-mobile';

export const UnifiedChatContainer: React.FC = () => {
  const { data: templates = [], isLoading: templatesLoading } = useFigmantPromptTemplates();
  const { mutateAsync: analyzeWithClaude, isPending: isAnalyzing } = useFigmantChatAnalysis();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Use the enhanced chat state with persistent sessions
  const chatState = useChatState();
  
  // Verify we have the chat state functions
  if (!chatState.setAttachments || !chatState.setMessages || !chatState.setMessage) {
    console.error('🚨 UNIFIED CHAT - Chat state functions not available!');
    return <div>Error: Chat state not properly initialized</div>;
  }

  const {
    messages = [],
    setMessages,
    message = '',
    setMessage,
    attachments = [],
    setAttachments,
    selectedTemplateId,
    setSelectedTemplateId,
    // Session management
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    startNewSession,
    loadSession,
    saveMessageAttachments
  } = chatState;

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isAssetsPanelVisible, setIsAssetsPanelVisible] = useState(!isMobile);
  const [showSessionHistory, setShowSessionHistory] = useState(false);

  // Debug logging to track state changes
  useEffect(() => {
    console.log('🔄 UNIFIED CHAT - Session state:', {
      currentSessionId,
      sessionName: currentSession?.session_name,
      attachmentsCount: attachments.length,
      sessionAttachmentsCount: sessionAttachments.length,
      sessionLinksCount: sessionLinks.length,
      isSessionInitialized
    });
  }, [currentSessionId, currentSession, attachments, sessionAttachments, sessionLinks, isSessionInitialized]);

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId) || null;
  };

  const handleFileUpload = async (files: FileList) => {
    console.log('📎 UNIFIED CHAT - Starting file upload for', files.length, 'files');
    
    const newAttachments: ChatAttachment[] = [];
    
    for (const file of Array.from(files)) {
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file,
        status: 'uploading'
      };
      newAttachments.push(attachment);
      console.log('📎 UNIFIED CHAT - Created file attachment:', attachment.id, attachment.name);
    }
    
    // Add attachments to state immediately so they appear in the UI
    setAttachments(prev => {
      const updated = [...prev, ...newAttachments];
      console.log('📎 UNIFIED CHAT - Updated attachments state, new count:', updated.length);
      return updated;
    });
    
    toast({
      title: "Files Added",
      description: `${newAttachments.length} file(s) added for analysis.`,
    });
    
    // Process file uploads in background
    for (const attachment of newAttachments) {
      try {
        console.log('📤 Starting file upload for:', attachment.name);
        const uploadPath = await FileUploadService.uploadFile(attachment.file!, attachment.id);
        
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'uploaded', uploadPath }
            : att
        ));
        
        console.log('📤 File upload completed:', uploadPath);
        
      } catch (error) {
        console.error('📤 File upload failed:', error);
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, status: 'error' }
            : att
        ));
      }
    }
  };

  const handleAttachmentAdd = (attachment: ChatAttachment) => {
    console.log('🔗 UNIFIED CHAT - Adding attachment:', attachment);
    setAttachments(prev => {
      const updated = [...prev, attachment];
      console.log('🔗 UNIFIED CHAT - Attachments updated, new count:', updated.length);
      return updated;
    });
  };

  const handleAttachmentUpdate = (id: string, updates: Partial<ChatAttachment>) => {
    console.log('🔗 UNIFIED CHAT - Updating attachment:', id, updates);
    setAttachments(prev => prev.map(att => 
      att.id === id ? { ...att, ...updates } : att
    ));
  };

  const removeAttachment = (id: string) => {
    console.log('🗑️ UNIFIED CHAT - Removing attachment:', id);
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== id);
      console.log('🗑️ UNIFIED CHAT - Attachment removed, new count:', updated.length);
      return updated;
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    if (setSelectedTemplateId) {
      setSelectedTemplateId(templateId);
    }
  };

  const handleViewTemplate = (template: any) => {
    console.log('🎯 UNIFIED CHAT - View template:', template);
    // This would open a modal or details view
  };

  const handleToggleUrlInput = () => {
    console.log('🔗 UNIFIED CHAT - Toggle URL input:', !showUrlInput);
    setShowUrlInput(!showUrlInput);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No content to analyze",
        description: "Please enter a message or attach files/URLs.",
      });
      return;
    }

    console.log('🚀 UNIFIED CHAT - Sending message with attachments:', {
      messageLength: message.length,
      attachmentsCount: attachments.length,
      currentSessionId,
      sessionName: currentSession?.session_name
    });

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage('');

    // Save message attachments to persistent storage
    if (isSessionInitialized && userMessage.attachments) {
      saveMessageAttachments(userMessage);
      
      toast({
        title: "Attachments Saved",
        description: "Your files and links have been saved to this chat session.",
      });
    }

    try {
      const template = getCurrentTemplate();
      
      const analysisAttachments = attachments.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        uploadPath: att.uploadPath,
        url: att.url
      }));

      const result = await analyzeWithClaude({
        message,
        attachments: analysisAttachments,
        template
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Store the analysis result
      setLastAnalysisResult(result);

      // Clear attachments after successful analysis
      setAttachments([]);

    } catch (error) {
      console.error('Analysis error:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  const handleViewAttachment = (attachment: any) => {
    console.log('View attachment:', attachment);
    // Could open a modal or preview
  };

  console.log('🔄 UNIFIED CHAT CONTAINER - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    attachmentDetails: attachments.map(att => ({ id: att.id, type: att.type, name: att.name, status: att.status })),
    lastAnalysisResult: !!lastAnalysisResult,
    showUrlInput,
    isAssetsPanelVisible,
    hasChatStateFunctions: !!(setAttachments && setMessages && setMessage)
  });

  if (isMobile) {
    return (
      <div className="h-full">
        {/* Session History Toggle for Mobile */}
        {showSessionHistory ? (
          <div className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSessionHistory(false)}
              >
                Back to Chat
              </Button>
            </div>
            <ChatSessionHistory
              sessions={sessions}
              currentSessionId={currentSessionId}
              sessionAttachments={sessionAttachments}
              sessionLinks={sessionLinks}
              onCreateNewSession={() => {
                startNewSession();
                setShowSessionHistory(false);
              }}
              onSwitchSession={(sessionId) => {
                loadSession(sessionId);
                setShowSessionHistory(false);
              }}
              isCreatingSession={false}
            />
          </div>
        ) : (
          <>
            <AnalysisChatContainer
              messages={messages}
              isAnalyzing={isAnalyzing}
              message={message}
              setMessage={setMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
              getCurrentTemplate={getCurrentTemplate}
              canSend={canSend}
              onFileUpload={handleFileUpload}
              onToggleUrlInput={handleToggleUrlInput}
              showUrlInput={showUrlInput}
              urlInput=""
              setUrlInput={() => {}}
              onAddUrl={() => {}}
              onCancelUrl={() => setShowUrlInput(false)}
              onTemplateSelect={handleTemplateSelect}
              availableTemplates={templates}
              onViewTemplate={handleViewTemplate}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
              // Add session controls
              onShowHistory={() => setShowSessionHistory(true)}
              currentSessionName={currentSession?.session_name}
            />
            
            {/* URL Input Handler for Mobile */}
            <URLInputHandler
              showUrlInput={showUrlInput}
              onClose={() => setShowUrlInput(false)}
              attachments={attachments}
              onAttachmentAdd={handleAttachmentAdd}
              onAttachmentUpdate={handleAttachmentUpdate}
            />
          </>
        )}
      </div>
    );
  }

  // Desktop layout with side-by-side chat and assets panel
  return (
    <div className="h-full flex gap-4">
      {/* Main Chat Container */}
      <div className="flex-1 min-w-0 relative">
        <AnalysisChatContainer
          messages={messages}
          isAnalyzing={isAnalyzing}
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={handleKeyPress}
          getCurrentTemplate={getCurrentTemplate}
          canSend={canSend}
          onFileUpload={handleFileUpload}
          onToggleUrlInput={handleToggleUrlInput}
          showUrlInput={false}
          urlInput=""
          setUrlInput={() => {}}
          onAddUrl={() => {}}
          onCancelUrl={() => {}}
          onTemplateSelect={handleTemplateSelect}
          availableTemplates={templates}
          onViewTemplate={handleViewTemplate}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          // Add session controls
          currentSessionName={currentSession?.session_name}
        />
        
        {/* URL Input Handler */}
        {showUrlInput && (
          <div className="absolute top-0 left-0 right-0 z-10 p-4">
            <URLInputHandler
              showUrlInput={showUrlInput}
              onClose={() => setShowUrlInput(false)}
              attachments={attachments}
              onAttachmentAdd={handleAttachmentAdd}
              onAttachmentUpdate={handleAttachmentUpdate}
            />
          </div>
        )}
      </div>

      {/* Analysis Assets Panel */}
      {isAssetsPanelVisible && (
        <div className="flex-shrink-0 w-80">
          <div className="h-full flex flex-col">
            {/* Session History */}
            <div className="flex-1 min-h-0 mb-4">
              <ChatSessionHistory
                sessions={sessions}
                currentSessionId={currentSessionId}
                sessionAttachments={sessionAttachments}
                sessionLinks={sessionLinks}
                onCreateNewSession={startNewSession}
                onSwitchSession={loadSession}
                isCreatingSession={false}
              />
            </div>
            
            {/* Traditional Analysis Navigation */}
            <div className="flex-shrink-0">
              <AnalysisNavigationSidebar
                messages={messages}
                attachments={attachments}
                onRemoveAttachment={removeAttachment}
                onViewAttachment={handleViewAttachment}
                lastAnalysisResult={lastAnalysisResult}
                isCollapsed={false}
                onToggleCollapse={() => setIsAssetsPanelVisible(!isAssetsPanelVisible)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button for Assets Panel */}
      {!isAssetsPanelVisible && (
        <div className="flex-shrink-0 flex items-start pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAssetsPanelVisible(true)}
            className="h-8 w-8 p-0"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
