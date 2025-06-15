
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { getTypeIcon } from '../utils/analysisUtils';

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

interface RelatedAnalysesTableProps {
  relatedAnalyses: Analysis[];
  onViewAnalysis: (analysis: Analysis) => void;
}

export const RelatedAnalysesTable: React.FC<RelatedAnalysesTableProps> = ({
  relatedAnalyses,
  onViewAnalysis
}) => {
  if (relatedAnalyses.length === 0) {
    return null;
  }

  return (
    <div className="ml-6">
      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
        Individual Analyses ({relatedAnalyses.length})
      </h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File/Design</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relatedAnalyses.map((analysis) => (
            <TableRow key={analysis.id} className="text-sm">
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(analysis.type)}
                  <div>
                    <div className="font-medium">{analysis.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {analysis.analysis_type}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  Individual
                </Badge>
              </TableCell>
              <TableCell>
                {Math.round((analysis.confidence_score || 0) * 100)}%
              </TableCell>
              <TableCell>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(analysis.created_at), 'MMM d')}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewAnalysis(analysis)}
                  className="text-xs h-7"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
