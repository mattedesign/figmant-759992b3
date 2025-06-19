
import React from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Bot, 
  File, 
  Globe, 
  Monitor, 
  Smartphone, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttachmentPreview } from './AttachmentPreview';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isAnalyzing?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isAnalyzing = false
}) => {
  if (messages.length === 0 && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Start Your Analysis
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Upload design files, add website URLs, or ask questions to begin your AI-powered design analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          {message.role === 'assistant' && (
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback>
                <Bot className="h-4 w-4 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={cn(
            "max-w-[80%] space-y-2",
            message.role === 'user' ? 'items-end' : 'items-start'
          )}>
            <Card className={cn(
              "border",
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background border-border'
            )}>
              <CardContent className="p-4">
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium mb-2 opacity-75">
                      Attachments ({message.attachments.length})
                    </div>
                    <div className="space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 text-xs">
                          {attachment.type === 'file' ? (
                            <File className="h-3 w-3" />
                          ) : (
                            <Globe className="h-3 w-3" />
                          )}
                          <span className="truncate flex-1">{attachment.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {attachment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Show screenshots if available */}
                    {message.attachments.some(att => att.metadata?.screenshots) && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium opacity-75">Screenshots:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => {
                            if (!attachment.metadata?.screenshots) return null;
                            
                            return (
                              <div key={attachment.id} className="space-y-2">
                                <div className="text-xs opacity-60">{attachment.name}</div>
                                <div className="flex gap-2">
                                  {attachment.metadata.screenshots.desktop?.success && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs opacity-60">
                                        <Monitor className="h-3 w-3" />
                                        Desktop
                                      </div>
                                      {attachment.metadata.screenshots.desktop.thumbnailUrl ? (
                                        <img
                                          src={attachment.metadata.screenshots.desktop.thumbnailUrl}
                                          alt="Desktop screenshot"
                                          className="w-16 h-10 object-cover rounded border"
                                        />
                                      ) : (
                                        <div className="w-16 h-10 bg-green-100 rounded border flex items-center justify-center">
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {attachment.metadata.screenshots.mobile?.success && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1 text-xs opacity-60">
                                        <Smartphone className="h-3 w-3" />
                                        Mobile
                                      </div>
                                      {attachment.metadata.screenshots.mobile.thumbnailUrl ? (
                                        <img
                                          src={attachment.metadata.screenshots.mobile.thumbnailUrl}
                                          alt="Mobile screenshot"
                                          className="w-10 h-16 object-cover rounded border"
                                        />
                                      ) : (
                                        <div className="w-10 h-16 bg-green-100 rounded border flex items-center justify-center">
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Content */}
                {message.content && (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className={cn(
              "text-xs text-muted-foreground px-1",
              message.role === 'user' ? 'text-right' : 'text-left'
            )}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
          
          {message.role === 'user' && (
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      
      {isAnalyzing && (
        <div className="flex gap-3 justify-start">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback>
              <Bot className="h-4 w-4 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
          <Card className="bg-background border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-pulse">●</div>
                <div className="animate-pulse delay-150">●</div>
                <div className="animate-pulse delay-300">●</div>
                <span className="ml-2">Analyzing your request...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
