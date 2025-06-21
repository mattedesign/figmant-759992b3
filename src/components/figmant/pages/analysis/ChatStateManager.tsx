
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

interface ChatState {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  message: string;
  setMessage: (message: string) => void;
  attachments: ChatAttachment[];
  setAttachments: (attachments: ChatAttachment[] | ((prev: ChatAttachment[]) => ChatAttachment[])) => void;
  selectedTemplateId?: string;
  setSelectedTemplateId?: (id: string) => void;
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

  const value: ChatState = {
    messages,
    setMessages,
    message,
    setMessage,
    attachments,
    setAttachments,
    selectedTemplateId,
    setSelectedTemplateId
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
      setSelectedTemplateId
    };
  }
  return context;
};
