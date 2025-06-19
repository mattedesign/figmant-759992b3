
import React from 'react';
import { AnalysisChatContainer } from './analysis/components/AnalysisChatContainer';
import { useChatState } from './analysis/ChatStateManager';
import { useFileUploadHandler } from './analysis/useFileUploadHandler';
import { useFigmantChatAnalysis } from '@/hooks/useFigmantChatAnalysis';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ selectedTemplate }) => {
  const chatState = useChatState();
  const { handleFileUpload } = useFileUploadHandler(chatState.setAttachments);
  const { toast } = useToast();
  
  const analysisQuery = useFigmantChatAnalysis();

  console.log('💬 CHAT PAGE - Rendering with state:', {
    messagesCount: chatState.messages.length,
    attachmentsCount: chatState.attachments.length,
    showUrlInput: chatState.showUrlInput,
    urlInput: chatState.urlInput
  });

  const handleSendMessage = async () => {
    if (!chatState.message.trim() && chatState.attachments.length === 0) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "Please enter a message or attach files before sending.",
      });
      return;
    }

    console.log('💬 CHAT PAGE - Sending message with attachments:', chatState.attachments.length);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: chatState.message,
      attachments: chatState.attachments,
      timestamp: new Date()
    };

    chatState.setMessages(prev => [...prev, userMessage]);

    // Clear input and attachments
    const currentMessage = chatState.message;
    const currentAttachments = [...chatState.attachments];
    chatState.setMessage('');
    chatState.setAttachments([]);

    try {
      // Call analysis
      const result = await analysisQuery.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments
      });

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('💬 CHAT PAGE - Analysis error:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I'm sorry, but I encountered an error while analyzing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleAddUrl = () => {
    if (!chatState.urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL.",
      });
      return;
    }

    console.log('🔗 CHAT PAGE - Adding URL:', chatState.urlInput);

    const urlAttachment = {
      id: crypto.randomUUID(),
      type: 'url' as const,
      name: new URL(chatState.urlInput).hostname,
      url: chatState.urlInput,
      status: 'uploaded' as const
    };

    chatState.setAttachments(prev => [...prev, urlAttachment]);
    chatState.setUrlInput('');
    chatState.setShowUrlInput(false);

    toast({
      title: "URL Added",
      description: `Added ${urlAttachment.name} for analysis`,
    });
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0">
        <AnalysisChatContainer
          messages={chatState.messages}
          isAnalyzing={analysisQuery.isPending}
          message={chatState.message}
          setMessage={chatState.setMessage}
          onSendMessage={handleSendMessage}
          onKeyPress={() => {}}
          getCurrentTemplate={() => selectedTemplate}
          canSend={chatState.message.trim().length > 0 || chatState.attachments.length > 0}
          onFileUpload={handleFileUpload}
          onToggleUrlInput={() => chatState.setShowUrlInput(!chatState.showUrlInput)}
          showUrlInput={chatState.showUrlInput}
          urlInput={chatState.urlInput}
          setUrlInput={chatState.setUrlInput}
          onAddUrl={handleAddUrl}
          onCancelUrl={() => chatState.setShowUrlInput(false)}
          onTemplateSelect={() => {}}
          availableTemplates={[]}
          onViewTemplate={() => {}}
          attachments={chatState.attachments}
          onRemoveAttachment={(id) => chatState.setAttachments(chatState.attachments.filter(att => att.id !== id))}
        />
      </div>
    </div>
  );
};
