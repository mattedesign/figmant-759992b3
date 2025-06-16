
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFigmantChatAnalysis, useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PromptTemplateSelector } from './PromptTemplateSelector';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { MessageInputSection } from './MessageInputSection';

interface AnalysisChatPanelProps {
  analysis: any;
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  promptUsed?: string;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  analysis,
  onAttachmentsChange
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const { toast } = useToast();
  const { analyzeWithFigmantChat } = useFigmantChatAnalysis();
  const { data: promptTemplates, isLoading: promptsLoading } = useFigmantPromptTemplates();
  const { data: bestPrompt } = useBestFigmantPrompt(selectedPromptCategory);

  // Notify parent component when attachments change
  useEffect(() => {
    if (onAttachmentsChange) {
      onAttachmentsChange(attachments);
    }
  }, [attachments, onAttachmentsChange]);

  // File upload handler (without drag functionality)
  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachmentId = crypto.randomUUID();
      
      // Add file to attachments with uploading status
      const newAttachment: ChatAttachment = {
        id: attachmentId,
        type: 'file',
        name: file.name,
        file: file,
        status: 'uploading',
        url: URL.createObjectURL(file)
      };
      
      setAttachments(prev => [...prev, newAttachment]);

      try {
        // Upload to Supabase storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .upload(`figmant-chat/${fileName}`, file);

        if (error) throw error;

        // Update attachment with success status
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'uploaded' as const, uploadPath: data.path }
            : att
        ));

        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error) {
        console.error('Upload error:', error);
        
        // Update attachment with error status
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'error' as const }
            : att
        ));

        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
        });
      }
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: urlInput,
        url: urlInput,
        status: 'uploaded'
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: "Website URL added for analysis",
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Check for any failed attachments
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: "Please remove failed uploads before sending.",
      });
      return;
    }

    // Check for any processing attachments
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Processing Files",
        description: "Please wait for all files to finish uploading.",
      });
      return;
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store current values before clearing
    const currentMessage = message;
    const currentAttachments = [...attachments];
    const promptTemplate = selectedPromptTemplate ? 
      promptTemplates?.find(p => p.id === selectedPromptTemplate)?.original_prompt : 
      undefined;

    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      // Call the analysis
      const result = await analyzeWithFigmantChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments,
        promptTemplate,
        analysisType: selectedPromptCategory || 'general_analysis'
      });

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        promptUsed: result.promptUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please check your files and try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = !analyzeWithFigmantChat.isPending && (message.trim() || attachments.length > 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts" className="mt-4">
            <PromptTemplateSelector
              promptTemplates={promptTemplates}
              promptsLoading={promptsLoading}
              selectedPromptCategory={selectedPromptCategory}
              selectedPromptTemplate={selectedPromptTemplate}
              onPromptCategoryChange={setSelectedPromptCategory}
              onPromptTemplateChange={setSelectedPromptTemplate}
              bestPrompt={bestPrompt}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages 
          messages={messages}
          isAnalyzing={analyzeWithFigmantChat.isPending}
        />
      </div>

      {/* Attachments Preview */}
      <AttachmentPreview
        attachments={attachments}
        onRemove={removeAttachment}
      />

      {/* URL Input */}
      <URLInputSection
        showUrlInput={showUrlInput}
        urlInput={urlInput}
        onUrlInputChange={setUrlInput}
        onAddUrl={handleAddUrl}
        onCancel={() => setShowUrlInput(false)}
      />

      {/* Message Input */}
      <MessageInputSection
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onToggleUrlInput={() => setShowUrlInput(!showUrlInput)}
        onKeyPress={handleKeyPress}
        onFileUpload={handleFileUpload}
        isAnalyzing={analyzeWithFigmantChat.isPending}
        canSend={canSend}
      />
    </div>
  );
};
