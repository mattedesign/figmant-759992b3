
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Calendar, BarChart3, FileImage, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

  const getGroupIcon = (groupType: string) => {
    return groupType === 'batch' ? (
      <BarChart3 className="h-5 w-5 text-blue-600" />
    ) : (
      <FileImage className="h-5 w-5 text-green-500" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupedAnalyses.map((group) => (
            <Collapsible
              key={group.id}
              open={expandedGroups.has(group.id)}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedGroups.has(group.id) ? (
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

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {group.relatedAnalyses.length > 0 && (
                      <div className="ml-6">
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                          Individual Analyses ({group.relatedAnalyses.length})
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
                            {group.relatedAnalyses.map((analysis) => (
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
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
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
