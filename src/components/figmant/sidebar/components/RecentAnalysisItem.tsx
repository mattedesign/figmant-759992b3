
import React, { useState } from 'react';
import { EnhancedAnalysisCard } from '@/components/figmant/analysis/EnhancedAnalysisCard';
import { AnalysisDetailModal } from '../../pages/dashboard/components/AnalysisDetailModal';

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
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (selectedAnalysis: any) => {
    console.log('🔍 RecentAnalysisItem: Opening analysis modal:', {
      analysisId: selectedAnalysis.id,
      analysisType: selectedAnalysis.type,
      title: selectedAnalysis.title
    });
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('🔍 RecentAnalysisItem: Closing analysis modal');
    setShowModal(false);
  };

  return (
    <>
      <EnhancedAnalysisCard
        analysis={analysis}
        onViewDetails={handleViewDetails}
        className="mb-2"
      />

      {/* Analysis Detail Modal */}
      <AnalysisDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        analysis={analysis}
      />
    </>
  );
};
