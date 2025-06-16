
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Link, 
  Send, 
  X,
  Image,
  FileText,
  Globe
} from 'lucide-react';
import { ChatAttachment, ChatMessage } from '@/components/design/DesignChatInterface';
import { ChatMessages } from './ChatMessages';
import { AttachmentPreview } from './AttachmentPreview';
import { URLInputSection } from './URLInputSection';
import { useAttachmentHandlers } from '@/components/design/chat/hooks/useAttachmentHandlers';
import { useFileUploadHandler } from './useFileUploadHandler';

interface AnalysisChatPanelProps {
  message: string;
  setMessage: (message: string) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[]) => void;
  urlInput: string;
  setUrlInput: (url: string) => void;
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  selectedPromptTemplate?: any;
  selectedPromptCategory?: string;
  promptTemplates?: any[];
  onAnalysisComplete?: (result: any) => void;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  message,
  setMessage,
  messages,
  setMessages,
  attachments,
  setAttachments,
  urlInput,
  setUrlInput,
  showUrlInput,
  setShowUrlInput,
  selectedPromptTemplate,
  onAnalysisComplete
}) => {
  const { addUrlAttachment, removeAttachment } = useAttachmentHandlers(
    attachments,
    setAttachments,
    setUrlInput,
    setShowUrlInput
  );

  const { handleFileUpload } = useFileUploadHandler(setAttachments);

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      attachments: attachments.length > 0 ? attachments : undefined,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Thank you for your submission. I\'m analyzing your design...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Simulate analysis completion
      setTimeout(() => {
        onAnalysisComplete?.({
          score: Math.floor(Math.random() * 3) + 8,
          status: 'Completed',
          title: 'Design Analysis Complete'
        });
      }, 2000);
    }, 1000);
  };

  const handleAddUrl = () => {
    addUrlAttachment(urlInput);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(handleFileUpload);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="/lovable-uploads/c52140a4-1da3-4d65-aa1d-35e9ccd21d91.png" 
            alt="Design Analysis" 
            className="w-6 h-6"
          />
          <h1 className="text-xl font-semibold">Design Analysis</h1>
        </div>
        <p className="text-gray-600" style={{ fontSize: '12px' }}>
          Start with a task, and let Figmant complete it for you. Not sure where to start? try a template
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Upload className="h-12 w-12 mx-auto mb-2" />
            </div>
            <p className="text-gray-600">Start your analysis by uploading files or asking a question</p>
          </div>
        ) : (
          <ChatMessages messages={messages} />
        )}
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Attachments</span>
            <Badge variant="secondary">{attachments.length}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {attachments.map((attachment) => (
              <AttachmentPreview
                key={attachment.id}
                attachment={attachment}
                onRemove={() => removeAttachment(attachment.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <URLInputSection
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          onAddUrl={handleAddUrl}
          onCancel={() => setShowUrlInput(false)}
        />
      )}

      {/* Input Area */}
      <div className="p-6">
        <Tabs defaultValue="files" className="w-full">
          <TabsList 
            className="grid w-full grid-cols-2 mb-4"
            style={{
              borderRadius: '8px',
              background: 'var(--action-background-neutral-light_active, rgba(28, 34, 43, 0.05))'
            }}
          >
            <TabsTrigger 
              value="files"
              style={{
                borderRadius: '6px',
                background: 'var(--Background-primary, #FFF)',
                boxShadow: '0px 1px 1px 0px rgba(11, 19, 36, 0.10), 0px 1px 3px 0px rgba(11, 19, 36, 0.10)'
              }}
            >
              <Image className="h-4 w-4 mr-2" />
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="url"
              style={{
                borderRadius: '6px'
              }}
            >
              <Globe className="h-4 w-4 mr-2" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="mt-0">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-0">
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowUrlInput(true)}
                className="w-full"
              >
                <Link className="h-4 w-4 mr-2" />
                Add Website URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Chat Input */}
        <div className="mt-4 space-y-4">
          <div 
            className="relative"
            style={{
              minHeight: '120px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              background: '#FAFAFA'
            }}
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedPromptTemplate ? `Using template: ${selectedPromptTemplate.name}` : "Describe what you'd like to analyze..."}
              className="w-full h-full resize-none border-0 bg-transparent placeholder:text-gray-500 focus:ring-0 p-4"
              style={{ minHeight: '120px' }}
            />
            <div className="absolute bottom-3 right-3">
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
