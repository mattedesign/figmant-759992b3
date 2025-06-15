
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GroupCard } from './components/GroupCard';

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

interface GroupedAnalysisTableProps {
  groupedAnalyses: GroupedAnalysis[];
  onViewAnalysis: (analysis: Analysis) => void;
}

export const GroupedAnalysisTable = ({ groupedAnalyses, onViewAnalysis }: GroupedAnalysisTableProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupedAnalyses.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isExpanded={expandedGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
              onViewAnalysis={onViewAnalysis}
            />
          ))}
        </div>
        
        {groupedAnalyses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              No analysis groups found
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
