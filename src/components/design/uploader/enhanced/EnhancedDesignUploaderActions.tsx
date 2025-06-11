
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnalysisPreferences } from '@/types/design';

interface EnhancedDesignUploaderActionsProps {
  hasValidContent: boolean;
  selectedUseCase: string;
  batchUpload: {
    isPending: boolean;
  };
  totalItems: number;
  analysisPreferences: AnalysisPreferences;
  onUpload: () => void;
}

export const EnhancedDesignUploaderActions: React.FC<EnhancedDesignUploaderActionsProps> = ({
  hasValidContent,
  selectedUseCase,
  batchUpload,
  totalItems,
  analysisPreferences,
  onUpload
}) => {
  return (
    <CardContent className="pt-0">
      <Button
        onClick={onUpload}
        disabled={!hasValidContent || !selectedUseCase || batchUpload.isPending}
        className="w-full"
        size="lg"
      >
        {batchUpload.isPending 
          ? 'Processing...' 
          : `Analyze ${totalItems} Item(s)${totalItems > 1 && analysisPreferences.auto_comparative ? ' (Comparative)' : ''}`
        }
      </Button>
    </CardContent>
  );
};
