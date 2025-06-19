
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { AnalysisChatPanel } from '../AnalysisChatPanel';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { SuggestionExtractor, ExtractedSuggestion } from '@/utils/suggestionExtractor';

export const UnifiedChatContainer: React.FC = () => {
  const location = useLocation();
  const { data: promptTemplates = [] } = useClaudePromptExamples();
  const { data: analysisHistory = [] } = useChatAnalysisHistory();
  
  // Main chat state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [extractedSuggestions, setExtractedSuggestions] = useState<ExtractedSuggestion[]>([]);
  
  // Template selection state
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>();
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('all');

  // Handle historical analysis loading from navigation
  useEffect(() => {
    const state = location.state;
    if (state?.loadHistoricalAnalysis && state?.historicalData) {
      console.log('🔄 Loading historical analysis:', state.historicalData);
      loadHistoricalAnalysis(state.historicalData);
    }
  }, [location.state]);

  const loadHistoricalAnalysis = (historicalData: any) => {
    console.log('📂 LOADING HISTORICAL ANALYSIS:', {
      id: historicalData.id,
      type: historicalData.type,
      hasAnalysisResults: !!historicalData.analysis_results,
      hasAttachments: !!historicalData.analysis_results?.upload_ids
    });

    // Restore the analysis result
    setLastAnalysisResult(historicalData.analysis_results || historicalData);

    // Create messages from historical data
    const historicalMessages: ChatMessage[] = [];
    
    // Add user message if prompt exists
    if (historicalData.prompt_used) {
      historicalMessages.push({
        id: `user-${historicalData.id}`,
        role: 'user',
        content: historicalData.prompt_used,
        timestamp: new Date(historicalData.created_at),
        attachments: [] // Will be populated below
      });
    }

    // Add assistant response
    const analysisContent = historicalData.analysis_results?.response || 
                           historicalData.analysis_results?.analysis || 
                           'Historical analysis loaded';
    
    historicalMessages.push({
      id: `assistant-${historicalData.id}`,
      role: 'assistant',
      content: analysisContent,
      timestamp: new Date(historicalData.created_at),
      uploadIds: historicalData.analysis_results?.upload_ids || []
    });

    setMessages(historicalMessages);

    // Restore attachments from historical data
    const restoredAttachments = restoreAttachmentsFromHistory(historicalData);
    setAttachments(restoredAttachments);

    // Update user message with restored attachments if any
    if (restoredAttachments.length > 0 && historicalMessages.length > 0) {
      historicalMessages[0].attachments = restoredAttachments;
      setMessages([...historicalMessages]);
    }

    // Extract suggestions from the analysis
    if (analysisContent) {
      const suggestions = SuggestionExtractor.extractFromClaudeResponse(analysisContent);
      setExtractedSuggestions(suggestions);
    }

    console.log('✅ Historical analysis loaded:', {
      messagesCount: historicalMessages.length,
      attachmentsCount: restoredAttachments.length,
      suggestionsCount: extractedSuggestions.length
    });
  };

  const restoreAttachmentsFromHistory = (historicalData: any): ChatAttachment[] => {
    const restoredAttachments: ChatAttachment[] = [];
    
    console.log('🔄 Restoring attachments from historical data:', {
      hasUploadIds: !!historicalData.analysis_results?.upload_ids,
      uploadIds: historicalData.analysis_results?.upload_ids,
      hasAttachmentsProcessed: !!historicalData.analysis_results?.attachments_processed
    });

    // Check for URL attachments from upload_ids
    if (historicalData.analysis_results?.upload_ids?.length > 0) {
      historicalData.analysis_results.upload_ids.forEach((uploadId: string, index: number) => {
        // Try to determine if this is a URL or file attachment
        if (uploadId.startsWith('http://') || uploadId.startsWith('https://')) {
          restoredAttachments.push({
            id: `url-${historicalData.id}-${index}`,
            type: 'url',
            name: `Website ${index + 1}`,
            url: uploadId,
            status: 'uploaded',
            metadata: {
              screenshots: {
                desktop: { success: false, url: uploadId },
                mobile: { success: false, url: uploadId }
              }
            }
          });
        } else {
          // Assume it's a file attachment
          restoredAttachments.push({
            id: `file-${historicalData.id}-${index}`,
            type: 'file',
            name: `Attachment ${index + 1}`,
            status: 'uploaded',
            uploadPath: uploadId
          });
        }
      });
    }

    // For design analyses, try to restore design file information
    if (historicalData.type === 'design' && historicalData.analysis_results?.title) {
      restoredAttachments.push({
        id: `design-${historicalData.id}`,
        type: 'file',
        name: historicalData.analysis_results.title,
        status: 'uploaded',
        file: new File([], historicalData.analysis_results.title, { type: 'image/png' })
      });
    }

    console.log('✅ Restored attachments:', {
      count: restoredAttachments.length,
      types: restoredAttachments.map(att => att.type),
      names: restoredAttachments.map(att => att.name)
    });

    return restoredAttachments;
  };

  const handleAnalysisComplete = (result: any) => {
    console.log('✅ Analysis completed:', result);
    setLastAnalysisResult(result);
    
    // Extract suggestions from the result
    if (result?.response || result?.analysis) {
      const content = result.response || result.analysis;
      const suggestions = SuggestionExtractor.extractFromClaudeResponse(content);
      setExtractedSuggestions(suggestions);
    }
  };

  console.log('🎯 UNIFIED CHAT CONTAINER - Current state:', {
    messagesCount: messages.length,
    attachmentsCount: attachments.length,
    hasLastAnalysisResult: !!lastAnalysisResult,
    extractedSuggestionsCount: extractedSuggestions.length
  });

  return (
    <div className="h-full p-6 min-h-0">
      <Card className="h-full" style={{
        borderRadius: '20px',
        border: '1px solid var(--Stroke-01, #ECECEC)',
        background: 'var(--Surface-01, #FCFCFC)'
      }}>
        <AnalysisChatPanel
          message={message}
          setMessage={setMessage}
          messages={messages}
          setMessages={setMessages}
          attachments={attachments}
          setAttachments={setAttachments}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          showUrlInput={showUrlInput}
          setShowUrlInput={setShowUrlInput}
          selectedPromptTemplate={selectedPromptTemplate}
          selectedPromptCategory={selectedPromptCategory}
          promptTemplates={promptTemplates}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </Card>
    </div>
  );
};
