
import React, { useState, useEffect } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { useChatState } from '../ChatStateManager';
import { useMessageHandler } from '../useMessageHandler';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { NavigationSectionList } from './NavigationSectionList';
import { ChatInputContainer } from './ChatInputContainer';
import { ChatMessageArea } from './ChatMessageArea';
import { URLInputSection } from './URLInputSection';
import { useFileUploadHandlers } from '@/hooks/useFileUploadHandlers';
import { useToast } from '@/hooks/use-toast';

export const UnifiedChatContainer: React.FC = () => {
  const {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
  } = useChatState();

  // Mode state
  const [chatMode, setChatMode] = useState<'chat' | 'analyze'>('analyze');
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');

  const { data: templates = [] } = useFigmantPromptTemplates();
  const { toast } = useToast();

  // File upload handlers
  const { handleFileUpload } = useFileUploadHandlers({
    onUploadComplete: (file, uploadPath) => {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: file.name,
        file: file,
        uploadPath: uploadPath,
        status: 'uploaded'
      };
      setAttachments(prev => [...prev, newAttachment]);
    },
    onUploadError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error
      });
    }
  });

  // Message handler with mode support
  const { isAnalyzing, canSend, handleSendMessage, handleKeyPress } = useMessageHandler({
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    selectedPromptTemplate: templates.find(t => t.id === selectedPromptTemplate),
    onAnalysisComplete: (result) => {
      setLastAnalysisResult(result);
    },
    chatMode
  });

  // Clear attachments when switching to chat mode
  useEffect(() => {
    if (chatMode === 'chat' && attachments.length > 0) {
      setAttachments([]);
    }
  }, [chatMode, setAttachments]);

  const handleModeChange = (newMode: 'chat' | 'analyze') => {
    setChatMode(newMode);
    
    // Clear attachments when switching to chat mode
    if (newMode === 'chat' && attachments.length > 0) {
      setAttachments([]);
    }
  };

  const getPlaceholderText = () => {
    if (chatMode === 'chat') {
      return "How can I help...";
    } else {
      return "Describe what you'd like me to analyze...";
    }
  };

  const getFeatureAvailability = () => {
    return {
      fileUpload: chatMode === 'analyze',
      templates: chatMode === 'analyze',
      urlInput: chatMode === 'analyze',
      attachments: chatMode === 'analyze'
    };
  };

  const handleFileUploadWrapper = (files: FileList) => {
    if (chatMode === 'chat') {
      toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "File uploads are only available in Analyze mode."
      });
      return;
    }
    handleFileUpload(files);
  };

  const handleToggleUrlInput = () => {
    if (chatMode === 'chat') {
      toast({
        variant: "destructive",
        title: "Feature Not Available",
        description: "URL input is only available in Analyze mode."
      });
      return;
    }
    setShowUrlInput(!showUrlInput);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL."
      });
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'uploaded'
      };

      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: `${hostname} has been added to your message`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL."
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleViewAttachment = (attachment: ChatAttachment) => {
    // Implement view attachment logic
    console.log('Viewing attachment:', attachment);
  };

  const fileAttachments = attachments.filter(att => att.type === 'file');
  const urlAttachments = attachments.filter(att => att.type === 'url');
  const features = getFeatureAvailability();

  return (
    <div className="h-full flex bg-transparent">
      {/* Left Navigation Panel */}
      <div className="w-80 border-r border-gray-200 flex-shrink-0 bg-white">
        <NavigationSectionList
          fileAttachments={fileAttachments}
          urlAttachments={urlAttachments}
          analysisMessages={messages}
          lastAnalysisResult={lastAnalysisResult}
          onRemoveAttachment={handleRemoveAttachment}
          onViewAttachment={handleViewAttachment}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessageArea 
            messages={messages}
            isAnalyzing={isAnalyzing}
            chatMode={chatMode}
          />
        </div>

        {/* URL Input Section (if active) */}
        {showUrlInput && features.urlInput && (
          <URLInputSection
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={() => setShowUrlInput(false)}
          />
        )}

        {/* Chat Input at bottom of center area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <ChatInputContainer
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            selectedPromptTemplate={templates.find(t => t.id === selectedPromptTemplate) || null}
            canSend={canSend}
            isAnalyzing={isAnalyzing}
            onFileUpload={handleFileUploadWrapper}
            onToggleUrlInput={handleToggleUrlInput}
            onTemplateSelect={setSelectedPromptTemplate}
            availableTemplates={templates}
            onViewTemplate={(template) => console.log('View template:', template)}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={() => setShowUrlInput(false)}
            chatMode={chatMode}
            onModeChange={handleModeChange}
            placeholder={getPlaceholderText()}
            features={features}
          />
        </div>
      </div>

      {/* Right Sidebar for Details/Insights */}
      <div className="w-80 border-l border-gray-200 flex-shrink-0 bg-white">
        <div className="h-full p-4">
          {/* Tab Header */}
          <div className="flex border-b border-gray-200 mb-4">
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'insights' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Files Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Files ({fileAttachments.length})</h3>
                {fileAttachments.length > 0 ? (
                  <div className="space-y-2">
                    {fileAttachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No files uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Links Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Links ({urlAttachments.length})</h3>
                {urlAttachments.length > 0 ? (
                  <div className="space-y-2">
                    {urlAttachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No links added yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analysis insights yet</h3>
              <p className="text-sm text-gray-500 mb-4">Upload files or add URLs and run an analysis to see insights here</p>
              {lastAnalysisResult && (
                <div className="w-full text-left">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Latest Analysis</h4>
                    <p className="text-sm text-blue-700">{lastAnalysisResult.summary || 'Analysis completed'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
