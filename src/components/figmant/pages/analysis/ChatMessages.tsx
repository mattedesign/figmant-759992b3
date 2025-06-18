
import React from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useAuthState } from '@/hooks/useAuthState';
import { AnalysisResults } from '@/components/design/chat/AnalysisResults';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  promptUsed?: string;
  analysisResult?: any;
  uploadIds?: string[];
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isAnalyzing: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isAnalyzing
}) => {
  const { user } = useAuthState();

  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">AI Design Analysis</p>
        <p className="text-sm">Upload designs, share URLs, or ask questions to get comprehensive UX analysis powered by Claude AI.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg) => (
        <div key={msg.id} className="space-y-4">
          <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-gray-600" />
              </div>
            )}
            
            <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'max-w-md' : ''}`}>
              <div className={`rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white ml-auto' 
                  : 'bg-gray-50'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map(att => (
                      <div key={att.id} className="text-xs opacity-75">
                        📎 {att.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {msg.role === 'user' && (
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback />
              </Avatar>
            )}
          </div>

          {/* Analysis Results - shown after assistant messages */}
          {msg.role === 'assistant' && msg.analysisResult && (
            <div className="ml-11">
              <AnalysisResults 
                lastAnalysisResult={msg.analysisResult}
                uploadIds={msg.uploadIds}
                showEnhancedSummary={true}
              />
            </div>
          )}
        </div>
      ))}
      
      {isAnalyzing && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-600 ml-2">Analyzing with Claude AI...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
