
import React from 'react';
import { EnhancedUnifiedChatContainer } from './analysis/components/EnhancedUnifiedChatContainer';

interface EnhancedChatPageProps {
  selectedTemplate?: any;
}

export const EnhancedChatPage: React.FC<EnhancedChatPageProps> = ({
  selectedTemplate
}) => {
  console.log('💬 ENHANCED CHAT ANALYSIS PAGE - Rendering enhanced chat analysis system');
  
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Enhanced Chat Content with Full Context */}
      <div className="flex-1 min-h-0 px-0">
        <EnhancedUnifiedChatContainer />
      </div>
    </div>
  );
};
