
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Eye, Calendar, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { getStatusBadge, getGroupIcon } from '../utils/analysisUtils';

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

interface GroupHeaderProps {
  group: GroupedAnalysis;
  isExpanded: boolean;
  onViewAnalysis: (analysis: Analysis) => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
  group,
  isExpanded,
  onViewAnalysis
}) => {
  return (
    <CollapsibleTrigger asChild>
      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {getGroupIcon(group.groupType)}
            <div>
              <CardTitle className="text-base">{group.groupTitle}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(group.latestDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {group.totalUploads} files
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary">
                    {Math.round(group.overallConfidence * 100)}% confidence
                  </Badge>
                </div>
                {group.groupType === 'batch' && (
                  <Badge variant="outline" className="capitalize">
                    Comparative Analysis
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(group.primaryAnalysis.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewAnalysis(group.primaryAnalysis);
              }}
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              View Overall
            </Button>
          </div>
        </div>
      </CardHeader>
    </CollapsibleTrigger>
  );
};
