
import React, { useState, useEffect } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { useChatState } from './ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useLocation } from 'react-router-dom';

export const AnalysisPage: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatState = useChatState();
  const { data: promptTemplates = [], isLoading } = useFigmantPromptTemplates();
  const location = useLocation();

  // Handle navigation from sidebar - detect hash or query params for template selection
  useEffect(() => {
    const handleNavigation = () => {
      const hash = location.hash.replace('#', '');
      const urlParams = new URLSearchParams(location.search);
      const sectionId = urlParams.get('section') || hash;

      switch (sectionId) {
        case 'design':
          // General analysis chat - no template pre-selected
          setSelectedTemplate(undefined);
          break;
        case 'competitor-analysis':
          // Pre-select competitor analysis template
          setSelectedTemplate('uc024_competitor_analysis');
          break;
        case 'conversion-optimization':
          setSelectedTemplate('conversion_optimization');
          break;
        case 'visual-hierarchy':
          setSelectedTemplate('visual_hierarchy');
          break;
        default:
          break;
      }
    };

    handleNavigation();
  }, [location]);

  const handleSendMessage = async () => {
    if ((!chatState.message.trim() && chatState.attachments.length === 0) || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: chatState.message,
        attachments: [...chatState.attachments],
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, userMessage]);

      // Get active template
      const activeTemplate = promptTemplates.find(t => t.id === selectedTemplate);

      console.log('Sending message with template context:', {
        message: chatState.message,
        attachments: chatState.attachments,
        selectedTemplate,
        activeTemplate: activeTemplate?.displayName
      });

      // TODO: Call your existing analysis function with template context
      // const result = await analyzeWithClaude({
      //   message: chatState.message,
      //   attachments: chatState.attachments,
      //   template: activeTemplate
      // });

      // Simulate analysis for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add assistant response (placeholder)
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Analysis complete using ${activeTemplate?.displayName || 'General Analysis'}. This is a placeholder response that will be replaced with actual Claude analysis.`,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, assistantMessage]);

      // Clear input
      chatState.setMessage('');
      chatState.setAttachments([]);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, the analysis failed. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddAttachment = () => {
    console.log('Adding attachment...');
    // TODO: Implement your existing attachment logic
  };

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = chatState.attachments.filter(att => att.id !== id);
    chatState.setAttachments(updatedAttachments);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log('Selected template:', templateId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Debug Toggle Button */}
      <div className="p-2 border-b border-gray-200 bg-gray-50">
        <Button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {showDebugPanel ? 'Hide' : 'Show'} Debug Info
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Panel */}
        <div className={`${showDebugPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <AnalysisChatPanel
            messages={chatState.messages}
            setMessages={chatState.setMessages}
            message={chatState.message}
            setMessage={chatState.setMessage}
            attachments={chatState.attachments}
            onSendMessage={handleSendMessage}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            promptTemplates={promptTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <UserDebugPanel />
          </div>
        )}
      </div>
    </div>
  );
};
