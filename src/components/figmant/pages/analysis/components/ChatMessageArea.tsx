
import React from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { Loader2, MessageCircle, Zap } from 'lucide-react';

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  isAnalyzing: boolean;
  chatMode: 'chat' | 'analyze';
}

export const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  messages,
  isAnalyzing,
  chatMode
}) => {
  const getEmptyStateContent = () => {
    if (chatMode === 'chat') {
      return {
        icon: MessageCircle,
        title: "Let's Chat",
        description: "Ask me anything about UX design, get quick tips, or have a conversation about your projects.",
        suggestions: [
          "What are the latest UX trends?",
          "How can I improve my landing page?",
          "What's the best color scheme for my app?"
        ]
      };
    } else {
      return {
        icon: Zap,
        title: "Start Your Design Analysis",
        description: "Upload your design files, add website URLs, or describe what you'd like me to analyze.",
        suggestions: [
          "Analyze my website's conversion rate",
          "Review my mobile app design",
          "Compare my design to competitors"
        ]
      };
    }
  };

  const emptyState = getEmptyStateContent();
  const IconComponent = emptyState.icon;

  return (
    <div className="h-full p-6">
      {messages.length === 0 ? (
        /* Empty State */
        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <IconComponent className="w-8 h-8 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {emptyState.title}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {emptyState.description}
          </p>

          {/* Mode indicator */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              chatMode === 'chat' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                chatMode === 'chat' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
              {chatMode === 'chat' ? 'Chat Mode' : 'Analyze Mode'}
            </div>
          </div>
          
          {/* Suggestions */}
          <div className="space-y-2 w-full">
            <p className="text-sm text-gray-500 mb-4">Try asking:</p>
            {emptyState.suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                onClick={() => {
                  // This would trigger setting the message
                  // You'd need to pass this function down from the parent
                }}
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* Mode indicator for messages */}
                {message.mode && (
                  <div className="mb-2">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      message.role === 'user'
                        ? 'bg-blue-600 bg-opacity-50 text-blue-100'
                        : message.mode === 'chat'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {message.mode === 'chat' ? (
                        <MessageCircle className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      {message.mode === 'chat' ? 'Chat' : 'Analysis'}
                    </span>
                  </div>
                )}

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 bg-opacity-50'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span className="truncate">{attachment.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          attachment.status === 'uploaded' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {attachment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Message content */}
                {message.content && (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                )}
                
                {/* Timestamp */}
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading state */}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                <span className="text-gray-700">
                  {chatMode === 'chat' ? 'Thinking...' : 'Analyzing...'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
