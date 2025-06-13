
import { useState } from 'react';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';

export const useChatInterfaceState = () => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [storageErrorDetails, setStorageErrorDetails] = useState<any>(null);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showProcessingMonitor, setShowProcessingMonitor] = useState(false);

  return {
    message,
    setMessage,
    attachments,
    setAttachments,
    messages,
    setMessages,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    storageStatus,
    setStorageStatus,
    storageErrorDetails,
    setStorageErrorDetails,
    lastAnalysisResult,
    setLastAnalysisResult,
    showDebugPanel,
    setShowDebugPanel,
    showProcessingMonitor,
    setShowProcessingMonitor
  };
};
