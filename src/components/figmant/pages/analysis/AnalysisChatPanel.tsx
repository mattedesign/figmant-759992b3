
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Info, MessageCircle } from 'lucide-react';
import { TemplateQuickSelector } from './components/TemplateQuickSelector';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface AnalysisChatPanelProps {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  onSendMessage: () => void;
  onAddAttachment: () => void;
  onRemoveAttachment: (id: string) => void;
  promptTemplates: FigmantPromptTemplate[];
  selectedTemplate?: string;
  onTemplateSelect: (templateId: string) => void;
  isAnalyzing?: boolean;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  messages,
  setMessages,
  message,
  setMessage,
  attachments,
  onSendMessage,
  onAddAttachment,
  onRemoveAttachment,
  promptTemplates,
  selectedTemplate,
  onTemplateSelect,
  isAnalyzing = false
}) => {
  const activeTemplate = promptTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Enhanced Header with Template Selection */}
      <div className="flex-none p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Analysis Chat</h2>
          <Badge variant="outline" className="text-xs">
            Universal Analysis Hub
          </Badge>
        </div>
        
        <TemplateQuickSelector
          templates={promptTemplates}
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onTemplateSelect}
        />
      </div>

      {/* Template Context Info */}
      {activeTemplate && (
        <div className="flex-none p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {activeTemplate.category?.replace('_', ' ')}
                </Badge>
                <span className="font-medium text-sm">{activeTemplate.displayName}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {activeTemplate.description}
              </p>
              {activeTemplate.metadata?.best_for && (
                <div className="flex gap-1 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">Best for:</span>
                  {activeTemplate.metadata.best_for.slice(0, 3).map((use: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                      {use}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium text-lg mb-2">Ready for Analysis</h3>
              <p className="text-sm">
                {activeTemplate 
                  ? `Upload your design and get ${activeTemplate.displayName.toLowerCase()}`
                  : 'Choose a template above and upload your design to get started'
                }
              </p>
            </div>
            
            {/* Quick Start Tips */}
            <div className="max-w-md mx-auto text-left">
              <h4 className="font-medium text-sm mb-2 text-gray-700">Quick Tips:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Upload images, PDFs, or paste website URLs</li>
                <li>• Describe your specific goals or concerns</li>
                <li>• Switch templates anytime for different analysis types</li>
                <li>• Ask follow-up questions to dive deeper</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Message Content */}
              <div className="prose prose-sm max-w-none">
                {msg.content}
              </div>
              
              {/* Attachments Display */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-50'
                      }`}
                    >
                      <Paperclip className="h-3 w-3" />
                      <span className="text-xs truncate">
                        {attachment.name || attachment.url}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Timestamp */}
              <div className={`text-xs mt-2 ${
                msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Analyzing your design...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="flex-none p-4 bg-white border-t border-gray-200">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Ready to Analyze:</h4>
            <div className="flex gap-2 flex-wrap">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
                >
                  <Paperclip className="h-3 w-3 text-gray-500" />
                  <span className="truncate max-w-32">
                    {attachment.name || attachment.url}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAttachment(attachment.id)}
                    className="h-4 w-4 p-0 hover:bg-gray-200"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-none p-4 bg-white border-t border-gray-200">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder={
                activeTemplate 
                  ? `Describe your design and ask for ${activeTemplate.displayName.toLowerCase()}...`
                  : "Upload your design and describe what you'd like to analyze..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddAttachment}
              className="w-10 h-10 p-0"
              title="Add files or URLs"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onSendMessage}
              disabled={(!message.trim() && attachments.length === 0) || isAnalyzing}
              size="sm"
              className="w-10 h-10 p-0"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-2 text-xs text-muted-foreground">
          <span>Tip: Upload images, paste URLs, or describe your design. Press Cmd/Ctrl + Enter to send.</span>
        </div>
      </div>
    </div>
  );
};
