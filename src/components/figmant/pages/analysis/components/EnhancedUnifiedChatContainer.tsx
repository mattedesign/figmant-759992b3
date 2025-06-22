
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedChatStateProvider } from './EnhancedChatStateProvider';
import { MobileChatLayout } from './MobileChatLayout';
import { DesktopChatLayout } from './DesktopChatLayout';

export const EnhancedUnifiedChatContainer: React.FC = () => {
  const isMobile = useIsMobile();

  console.log('🔄 ENHANCED UNIFIED CHAT CONTAINER - Rendering with enhanced context and mobile:', isMobile);

  return (
    <EnhancedChatStateProvider>
      {isMobile ? <MobileChatLayout /> : <DesktopChatLayout />}
    </EnhancedChatStateProvider>
  );
};
