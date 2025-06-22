
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Clock, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ExtendedChatMessage } from './types';
import { SingleAttachmentDisplay } from './SingleAttachmentDisplay';

interface PersistentChatMessagesProps {
  messages: ExtendedChatMessage[];
  isAnalyzing?: boolean;
}

export const PersistentChatMessages: React.FC<PersistentChatMessagesProps> = ({
  messages,
  isAnalyzing
}) => {
  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div key={message.id} className="flex gap-4">
          {/* Avatar */}
          <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
            <AvatarFallback className={message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
              {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {message.role === 'user' ? 'You' : 'Figmant AI'}
              </span>
              {message.timestamp && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(message.timestamp)}
                </div>
              )}
              {message.metadata?.confidence && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(message.metadata.confidence * 100)}% confidence
                </Badge>
              )}
              {message.metadata?.tokensUsed && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Zap className="h-3 w-3" />
                  {message.metadata.tokensUsed} tokens
                </div>
              )}
            </div>

            {/* Message Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {message.attachments.map((attachment, attachIndex) => (
                    <SingleAttachmentDisplay
                      key={attachment.id || attachIndex}
                      attachment={attachment}
                      size="sm"
                      showRemove={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message Text */}
            <Card className={`p-4 ${
              message.role === 'user' 
                ? 'bg-blue-50 border-blue-200' 
                : message.metadata?.error
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="prose prose-sm max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-800"
                  style={{ wordBreak: 'break-word' }}
                >
                  {message.content}
                </div>
              </div>
            </Card>

            {/* Analysis Metadata */}
            {message.role === 'assistant' && message.metadata && (
              <div className="mt-2 text-xs text-gray-500 space-x-4">
                {message.metadata.analysisType && (
                  <span>Type: {message.metadata.analysisType}</span>
                )}
                {message.metadata.responseTime && (
                  <span>Response: {message.metadata.responseTime}ms</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Analyzing Indicator */}
      {isAnalyzing && (
        <div className="flex gap-4">
          <Avatar className="w-8 h-8 mt-1 flex-shrink-0">
            <AvatarFallback className="bg-purple-100 text-purple-600">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">Figmant AI</span>
              <Badge variant="secondary" className="text-xs animate-pulse">
                Analyzing...
              </Badge>
            </div>
            <Card className="p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
