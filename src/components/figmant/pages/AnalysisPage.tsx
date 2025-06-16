
import React, { useState } from 'react';
import { AnalysisListSidebar } from './analysis/AnalysisListSidebar';
import { AnalysisChatPanel } from './analysis/AnalysisChatPanel';
import { AnalysisRightPanel } from './analysis/AnalysisRightPanel';
import { AnalysisSummaryPanel } from './analysis/AnalysisSummaryPanel';
import { ChatAttachment } from '@/components/design/DesignChatInterface';

export const AnalysisPage: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [chatAttachments, setChatAttachments] = useState<ChatAttachment[]>([]);
  const [lastAnalysisResult, setLastAnalysisResult] = useState(null);
  const [showAnalysisSummary, setShowAnalysisSummary] = useState(false);

  // Show right panel only when there are attachments or analysis summary
  const shouldShowRightPanel = chatAttachments.length > 0 || showAnalysisSummary;

  const handleAnalysisComplete = (analysisResult: any) => {
    setLastAnalysisResult(analysisResult);
    setShowAnalysisSummary(true);
  };

  const handleNewAttachments = (attachments: ChatAttachment[]) => {
    setChatAttachments(attachments);
    // Hide analysis summary when new attachments are added
    if (attachments.length > 0 && showAnalysisSummary) {
      setShowAnalysisSummary(false);
    }
  };

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
        onAttachmentsChange={handleNewAttachments}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Right Panel - Conditionally show attachments or analysis summary */}
      {shouldShowRightPanel && (
        showAnalysisSummary && lastAnalysisResult ? (
          <AnalysisSummaryPanel 
            analysisResult={lastAnalysisResult}
            onBackToAttachments={() => setShowAnalysisSummary(false)}
          />
        ) : (
          <AnalysisRightPanel 
            analysis={selectedAnalysis}
            attachments={chatAttachments}
          />
        )
      )}
    </div>
  );
};
