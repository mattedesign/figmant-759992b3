
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, Globe, Sparkles } from 'lucide-react';
import { ChatMessage } from './chat/ChatMessage';
import { ChatAttachments } from './chat/ChatAttachments';
import { SuggestedPrompts } from './chat/SuggestedPrompts';
import { AnalysisResults } from './chat/AnalysisResults';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';

export interface ChatAttachment {
  id: string;
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  preview?: string;
}

export interface ChatMessageType {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  analysisResult?: {
    analysis: string;
    uploadIds: string[];
    batchId?: string;
  };
}

interface DesignChatInterfaceProps {
  onViewUpload?: (upload: DesignUpload) => void;
  onViewBatchAnalysis?: (batch: DesignBatchAnalysis) => void;
}

export const DesignChatInterface: React.FC<DesignChatInterfaceProps> = ({ 
  onViewUpload, 
  onViewBatchAnalysis 
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      type: 'system',
      content: "Hi! I'm your UX analysis assistant. Upload designs or share URLs, then describe what you'd like me to analyze. I can help with conversion optimization, user experience, visual hierarchy, and more.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { analyzeWithChat } = useChatAnalysis();

  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeWithChat.mutateAsync({
        message: inputValue,
        attachments: attachments
      });

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: analysisResult.analysis,
        timestamp: new Date(),
        analysisResult: analysisResult
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error while analyzing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const attachment: ChatAttachment = {
        id: Date.now().toString() + Math.random(),
        type: 'file',
        name: file.name,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      setAttachments(prev => [...prev, attachment]);
    });
  };

  const handleUrlAdd = (url: string) => {
    if (!url.trim()) return;
    
    const attachment: ChatAttachment = {
      id: Date.now().toString() + Math.random(),
      type: 'url',
      name: url,
      url: url
    };
    setAttachments(prev => [...prev, attachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex flex-col h-[700px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            {message.analysisResult && (
              <div className="mt-4 ml-10">
                <AnalysisResults 
                  result={message.analysisResult}
                  onViewUpload={onViewUpload}
                  onViewBatchAnalysis={onViewBatchAnalysis}
                />
              </div>
            )}
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-muted-foreground p-4">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Analyzing your design...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/20">
          <SuggestedPrompts onSelectPrompt={handleSuggestedPrompt} />
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-t bg-muted/10">
          <ChatAttachments 
            attachments={attachments}
            onRemove={removeAttachment}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe what you'd like me to analyze..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[40px]"
              disabled={isAnalyzing}
            />
          </div>
          
          {/* Attachment Buttons */}
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="px-2"
              disabled={isAnalyzing}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = prompt('Enter a website URL to analyze:');
                if (url) handleUrlAdd(url);
              }}
              className="px-2"
              disabled={isAnalyzing}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && attachments.length === 0) || isAnalyzing}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};
