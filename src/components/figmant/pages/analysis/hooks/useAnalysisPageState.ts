
import React, { useState, useCallback } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

export const useAnalysisPageState = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  // Template state
  const { data: claudePromptTemplates = [], isLoading: promptsLoading } = useClaudePromptExamples();
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('master');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');

  // Set default template when templates load
  React.useEffect(() => {
    if (claudePromptTemplates.length > 0 && !selectedPromptTemplate) {
      const masterTemplate = claudePromptTemplates.find(t => t.category === 'master') || claudePromptTemplates[0];
      if (masterTemplate) {
        setSelectedPromptTemplate(masterTemplate.id);
      }
    }
  }, [claudePromptTemplates, selectedPromptTemplate]);

  const handleAnalysisComplete = useCallback((result: any) => {
    setLastAnalysisResult(result);
  }, []);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  }, []);

  return {
    // Basic chat state
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    
    // URL state
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    
    // Template state
    claudePromptTemplates,
    promptsLoading,
    selectedPromptCategory,
    setSelectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    
    // UI state
    lastAnalysisResult,
    isRightPanelCollapsed,
    setIsRightPanelCollapsed,
    
    // Handlers
    handleAnalysisComplete,
    handleRemoveAttachment
  };
};
