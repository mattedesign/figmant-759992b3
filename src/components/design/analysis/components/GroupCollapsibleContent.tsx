
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { RelatedAnalysesTable } from './RelatedAnalysesTable';

interface Analysis {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  confidence_score: number;
  analysis_type: string;
  upload_count: number;
  winner_upload_id: string | null;
  batch_name: string | null;
  rawData: any;
  relatedUpload?: any;
  relatedUploads?: any[];
}

interface GroupCollapsibleContentProps {
  relatedAnalyses: Analysis[];
  onViewAnalysis: (analysis: Analysis) => void;
}

export const GroupCollapsibleContent: React.FC<GroupCollapsibleContentProps> = ({
  relatedAnalyses,
  onViewAnalysis
}) => {
  return (
    <CollapsibleContent>
      <CardContent className="pt-0">
        <RelatedAnalysesTable
          relatedAnalyses={relatedAnalyses}
          onViewAnalysis={onViewAnalysis}
        />
      </CardContent>
    </CollapsibleContent>
  );
};
