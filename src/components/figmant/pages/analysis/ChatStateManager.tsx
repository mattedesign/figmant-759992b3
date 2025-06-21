
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { usePersistentChatSession } from '@/hooks/usePersistentChatSession';

interface ChatState {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[] | ((prev: ChatAttachment[]) => ChatAttachment[])) => void;
  selectedTemplateId?: string;
  setSelectedTemplateId?: (id: string) => void;
  
  // Session management properties
  currentSessionId: string | null;
  currentSession: any;
  sessions: any[];
  sessionAttachments: ChatAttachment[];
  sessionLinks: any[];
  isSessionInitialized: boolean;
  
  // Session management functions
  startNewSession: (sessionName?: string) => void;
  loadSession: (sessionId: string) => void;
  saveMessageAttachments: (message: ChatMessage) => void;
}

const ChatStateContext = createContext<ChatState | undefined>(undefined);

interface ChatStateProviderProps {
  children: ReactNode;
}

export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();

  // Use persistent chat session hook for session management
  const {
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    createNewSession,
    switchToSession,
    saveMessageAttachments
  } = usePersistentChatSession();

  const value: ChatState = {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    selectedTemplateId,
    setSelectedTemplateId,
    
    // Session management state
    currentSessionId,
    currentSession,
    sessions,
    sessionAttachments,
    sessionLinks,
    isSessionInitialized,
    
    // Session management functions
    startNewSession: createNewSession,
    loadSession: switchToSession,
    saveMessageAttachments
  };

  return (
    <ChatStateContext.Provider value={value}>
      {children}
    </ChatStateContext.Provider>
  );
};

export const useChatState = (): ChatState => {
  const context = useContext(ChatStateContext);
  if (!context) {
    // Return default state if no provider
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();

    return {
      messages,
      setMessages,
      message,
      setMessage,
      attachments,
      setAttachments,
      selectedTemplateId,
      setSelectedTemplateId,
      
      // Default session management state
      currentSessionId: null,
      currentSession: null,
      sessions: [],
      sessionAttachments: [],
      sessionLinks: [],
      isSessionInitialized: false,
      
      // Default session management functions
      startNewSession: () => {},
      loadSession: () => {},
      saveMessageAttachments: () => {}
    };
  }
  return context;
};
