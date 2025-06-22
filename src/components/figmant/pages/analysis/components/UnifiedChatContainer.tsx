
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatStateProvider } from './ChatStateProvider';
import { MobileChatLayout } from './MobileChatLayout';
import { DesktopChatLayout } from './DesktopChatLayout';

export const UnifiedChatContainer: React.FC = () => {
  const isMobile = useIsMobile();

  console.log('🔄 UNIFIED CHAT CONTAINER - Rendering with enhanced features and mobile:', isMobile);

  return (
    <ChatStateProvider>
      {isMobile ? <MobileChatLayout /> : <DesktopChatLayout />}
    </ChatStateProvider>
  );
};
