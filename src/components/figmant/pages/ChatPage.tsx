
import React from 'react';
import { UnifiedChatContainer } from './analysis/components/UnifiedChatContainer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface ChatPageProps {
  selectedTemplate?: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  selectedTemplate
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  console.log('💬 CHAT ANALYSIS PAGE - Rendering chat analysis system');

  const getContainerClasses = () => {
    if (isMobile) {
      return "h-full flex flex-col min-h-0 overflow-hidden";
    }
    if (isTablet) {
      return "h-full flex flex-col min-h-0 overflow-hidden rounded-lg";
    }
    return "h-full flex flex-col min-h-0";
  };
  
  return (
    <div className={getContainerClasses()}>
      {/* Main Chat Content - Full width since FigmantSidebar is now at layout level */}
      <div className="flex-1 min-h-0 px-0">
        <UnifiedChatContainer />
      </div>
    </div>
  );
};
