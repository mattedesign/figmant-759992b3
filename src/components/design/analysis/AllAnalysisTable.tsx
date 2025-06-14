
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Calendar, BarChart3, FileImage, Users } from 'lucide-react';
import { format } from 'date-fns';

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

interface AllAnalysisTableProps {
  analyses: Analysis[];
  onRowClick: (analysis: Analysis) => void;
  onViewAnalysis: (analysis: Analysis) => void;
}

export const AllAnalysisTable = ({ analyses, onRowClick, onViewAnalysis }: AllAnalysisTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: 'default' as const, label: 'Completed' },
      processing: { variant: 'secondary' as const, label: 'Processing' },
      pending: { variant: 'outline' as const, label: 'Pending' },
      failed: { variant: 'destructive' as const, label: 'Failed' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    return type === 'batch' ? (
      <BarChart3 className="h-4 w-4 text-blue-600" />
    ) : (
      <FileImage className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Analysis</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow 
              key={analysis.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onRowClick(analysis)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  {getTypeIcon(analysis.type)}
                  <div>
                    <div className="font-medium">{analysis.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {analysis.analysis_type}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {analysis.type}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(analysis.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {analysis.upload_count}
                </div>
              </TableCell>
              <TableCell>
                {Math.round((analysis.confidence_score || 0) * 100)}%
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(analysis.created_at), 'MMM d, yyyy')}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAnalysis(analysis);
                  }}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {analyses.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No analyses found
          </div>
        </div>
      )}
    </Card>
  );
};
