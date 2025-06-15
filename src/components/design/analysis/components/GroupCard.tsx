
import React from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { GroupHeader } from './GroupHeader';
import { GroupCollapsibleContent } from './GroupCollapsibleContent';

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

interface GroupedAnalysis {
  id: string;
  groupTitle: string;
  groupType: 'batch' | 'individual';
  primaryAnalysis: Analysis;
  relatedAnalyses: Analysis[];
  totalUploads: number;
  latestDate: string;
  overallConfidence: number;
}

interface GroupCardProps {
  group: GroupedAnalysis;
  isExpanded: boolean;
  onToggle: () => void;
  onViewAnalysis: (analysis: Analysis) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isExpanded,
  onToggle,
  onViewAnalysis
}) => {
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={onToggle}
    >
      <Card className="border-l-4 border-l-blue-500">
        <GroupHeader
          group={group}
          isExpanded={isExpanded}
          onViewAnalysis={onViewAnalysis}
        />
        <GroupCollapsibleContent
          relatedAnalyses={group.relatedAnalyses}
          onViewAnalysis={onViewAnalysis}
        />
      </Card>
    </Collapsible>
  );
};
