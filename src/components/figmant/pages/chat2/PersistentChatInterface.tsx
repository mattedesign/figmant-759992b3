
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Plus, 
  History, 
  Settings, 
  Paperclip, 
  Loader2,
  MessageSquare,
  Save,
  Trash2
} from 'lucide-react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { PersistentChatMessages } from './PersistentChatMessages';
import { PersistentChatInput } from './PersistentChatInput';
import { ChatSessionSidebar } from './ChatSessionSidebar';
import { useChatStateContext } from '../analysis/components/ChatStateProvider';

interface PersistentChatInterfaceProps {
  sessionHook: any; // From usePersistentChatSession
}

export const PersistentChatInterface: React.FC<PersistentChatInterfaceProps> = ({
  sessionHook
}) => {
  const {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    analyzeWithClaude,
    isAnalyzing,
    toast
  } = useChatStateContext();

  const [showSidebar, setShowSidebar] = useState(true);
  const [persistedMessages, setPersistedMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentSessionId,
    currentSession,
    sessions,
    isSessionInitialized,
    createNewSession,
    switchToSession,
    saveMessageAttachments
  } = sessionHook;

  // Load persisted messages when session changes
  useEffect(() => {
    if (currentSessionId && isSessionInitialized) {
      loadSessionMessages();
    }
  }, [currentSessionId, isSessionInitialized]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [persistedMessages]);

  const loadSessionMessages = async () => {
    if (!currentSessionId) return;
    
    setIsLoadingSession(true);
    try {
      // Here you would load messages from the database
      // For now, we'll merge in-memory messages with persisted ones
      console.log('📨 Loading session messages for:', currentSessionId);
      setPersistedMessages(messages);
    } catch (error) {
      console.error('Failed to load session messages:', error);
      toast({
        variant: "destructive",
        title: "Loading Error",
        description: "Failed to load conversation history.",
      });
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;
    if (!currentSessionId) {
      toast({
        variant: "destructive",
        title: "No Session",
        description: "Please create or select a chat session first.",
      });
      return;
    }

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments: [...attachments]
    };

    // Add to in-memory state
    const updatedMessages = [...persistedMessages, newUserMessage];
    setPersistedMessages(updatedMessages);
    setMessages(updatedMessages);

    // Save message attachments
    if (newUserMessage.attachments && newUserMessage.attachments.length > 0) {
      await saveMessageAttachments(newUserMessage);
    }

    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      // Send to Claude for analysis
      const analysisResult = await analyzeWithClaude({
        message: message,
        attachments: attachments,
        requestType: 'figmant_chat'
      });

      if (analysisResult?.analysis) {
        const aiResponse: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: analysisResult.analysis,
          timestamp: new Date(),
          metadata: {
            confidence: analysisResult.confidence_score,
            tokensUsed: analysisResult.tokens_used,
            analysisType: 'figmant_chat'
          }
        };

        const finalMessages = [...updatedMessages, aiResponse];
        setPersistedMessages(finalMessages);
        setMessages(finalMessages);

        // Save AI response
        await saveMessageAttachments(aiResponse);
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        metadata: { error: true }
      };

      const errorMessages = [...updatedMessages, errorMessage];
      setPersistedMessages(errorMessages);
      setMessages(errorMessages);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze your request. Please try again.",
      });
    }
  };

  const handleNewSession = async () => {
    try {
      await createNewSession(`Chat ${new Date().toLocaleString()}`);
      setPersistedMessages([]);
      setMessages([]);
      toast({
        title: "New Session",
        description: "Started a new chat session.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Session Error",
        description: "Failed to create new session.",
      });
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    try {
      await switchToSession(sessionId);
      toast({
        title: "Session Loaded",
        description: "Switched to selected conversation.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Session Error",
        description: "Failed to load session.",
      });
    }
  };

  if (!isSessionInitialized) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Initializing chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r bg-gray-50 flex-shrink-0">
          <ChatSessionSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <History className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {currentSession?.session_name || 'Chat Session'}
                </h2>
                <p className="text-sm text-gray-500">
                  {persistedMessages.length} messages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {isAnalyzing ? 'Analyzing...' : 'Ready'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleNewSession}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {isLoadingSession ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading conversation...</span>
                </div>
              ) : persistedMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium mb-2">Start a conversation</h3>
                  <p className="text-sm">Ask me anything about design, UX, or get insights from your attachments.</p>
                </div>
              ) : (
                <PersistentChatMessages 
                  messages={persistedMessages}
                  isAnalyzing={isAnalyzing}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <PersistentChatInput
            message={message}
            setMessage={setMessage}
            attachments={attachments}
            setAttachments={setAttachments}
            onSendMessage={handleSendMessage}
            isAnalyzing={isAnalyzing}
            disabled={!currentSessionId}
          />
        </div>
      </div>
    </div>
  );
};
