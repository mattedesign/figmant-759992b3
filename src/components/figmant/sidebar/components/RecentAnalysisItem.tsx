
import React, { useState } from 'react';
import { EnhancedHistoryCard } from '@/components/figmant/navigation/components/EnhancedHistoryCard';
import { AnalysisDetailDrawer } from '../../pages/analysis/AnalysisDetailDrawer';

interface RecentAnalysisItemProps {
  analysis: any;
  isExpanded: boolean;
  onToggleExpanded: (analysisId: string, event: React.MouseEvent) => void;
  onAnalysisClick: (analysis: any) => void;
}

export const RecentAnalysisItem: React.FC<RecentAnalysisItemProps> = ({
  analysis,
  isExpanded,
  onToggleExpanded,
  onAnalysisClick
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const handleViewDetails = (selectedAnalysis: any) => {
    console.log('🔍 RecentAnalysisItem: Opening analysis drawer:', {
      analysisId: selectedAnalysis.id,
      analysisType: selectedAnalysis.type,
      title: selectedAnalysis.title
    });
    
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    console.log('🔍 RecentAnalysisItem: Closing analysis drawer');
    setShowDrawer(false);
  };

  return (
    <>
      <EnhancedHistoryCard
        analysis={analysis}
        onViewDetails={handleViewDetails}
        className="mb-2"
      />

      {/* Analysis Detail Drawer */}
      <AnalysisDetailDrawer
        isOpen={showDrawer}
        onClose={handleCloseDrawer}
        analysis={analysis}
      />
    </>
  );
};
