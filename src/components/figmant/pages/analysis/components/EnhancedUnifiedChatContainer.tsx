
import React from 'react';
import { DesktopChatLayout } from './DesktopChatLayout';
import { MobileChatLayout } from './MobileChatLayout';
import { EnhancedChatStateProvider } from './EnhancedChatStateProvider';
import { ChatErrorBoundary } from './ChatErrorBoundary';

export const EnhancedUnifiedChatContainer: React.FC = () => {
  console.log('💬 ENHANCED UNIFIED CHAT CONTAINER - Rendering enhanced chat system');

  return (
    <ChatErrorBoundary>
      <EnhancedChatStateProvider>
        <div className="h-full flex flex-col">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            <DesktopChatLayout />
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            <MobileChatLayout />
          </div>
        </div>
      </EnhancedChatStateProvider>
    </ChatErrorBoundary>
  );
};
