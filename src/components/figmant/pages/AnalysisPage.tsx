
import React, { useState } from 'react';
import { AnalysisListSidebar } from './analysis/AnalysisListSidebar';
import { AnalysisChatPanel } from './analysis/AnalysisChatPanel';
import { AnalysisRightPanel } from './analysis/AnalysisRightPanel';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const AnalysisPage: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [chatAttachments, setChatAttachments] = useState<ChatAttachment[]>([]);

  return (
    <div className="h-full flex bg-[#E9EFF6]">
      {/* Left Sidebar - Analysis List */}
      <AnalysisListSidebar 
        selectedAnalysis={selectedAnalysis}
        onAnalysisSelect={setSelectedAnalysis}
      />

      {/* Main Content - Chat Panel with full Claude integration */}
      <AnalysisChatPanel 
        analysis={selectedAnalysis}
        onAttachmentsChange={setChatAttachments}
      />

      {/* Right Panel - Attachments and Analysis Details */}
      <AnalysisRightPanel 
        analysis={selectedAnalysis}
        attachments={chatAttachments}
      />
    </div>
  );
};
