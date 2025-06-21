
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedChatContainer } from './components/UnifiedChatContainer';
import { AnalysisRightPanel } from './AnalysisRightPanel';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({ 
  selectedTemplate 
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { data: analysisHistory = [] } = useChatAnalysisHistory();
  
  const [loadHistoricalAnalysis, setLoadHistoricalAnalysis] = useState<string | null>(null);
  const [historicalAnalysisData, setHistoricalAnalysisData] = useState<any>(null);

  // Check if we should load a historical analysis from navigation state
  useEffect(() => {
    if (location.state?.loadHistoricalAnalysis && location.state?.historicalData) {
      console.log('📊 ANALYSIS PAGE CONTAINER - Loading historical analysis:', {
        analysisId: location.state.loadHistoricalAnalysis,
        historicalData: location.state.historicalData
      });
      
      setLoadHistoricalAnalysis(location.state.loadHistoricalAnalysis);
      setHistoricalAnalysisData(location.state.historicalData);
    } else {
      setLoadHistoricalAnalysis(null);
      setHistoricalAnalysisData(null);
    }
  }, [location.state]);

  // Find the historical analysis if we have an ID but no data
  useEffect(() => {
    if (loadHistoricalAnalysis && !historicalAnalysisData && analysisHistory.length > 0) {
      const foundAnalysis = analysisHistory.find(analysis => analysis.id === loadHistoricalAnalysis);
      if (foundAnalysis) {
        console.log('📊 ANALYSIS PAGE CONTAINER - Found historical analysis in history:', foundAnalysis);
        setHistoricalAnalysisData(foundAnalysis);
      }
    }
  }, [loadHistoricalAnalysis, historicalAnalysisData, analysisHistory]);

  console.log('📊 ANALYSIS PAGE CONTAINER - Current state:', {
    loadHistoricalAnalysis,
    hasHistoricalData: !!historicalAnalysisData,
    selectedTemplate: selectedTemplate?.title,
    isMobile,
    analysisHistoryCount: analysisHistory.length
  });

  if (isMobile) {
    return (
      <div className="h-full">
        <UnifiedChatContainer />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <UnifiedChatContainer />
      </div>

      {/* Right Panel */}
      <AnalysisRightPanel
        historicalAnalysis={historicalAnalysisData}
        currentSessionId={undefined} // Will be handled by the chat container
        onRemoveAttachment={(id) => {
          console.log('📊 ANALYSIS PAGE CONTAINER - Remove attachment:', id);
        }}
        onViewAttachment={(attachment) => {
          console.log('📊 ANALYSIS PAGE CONTAINER - View attachment:', attachment);
        }}
      />
    </div>
  );
};
