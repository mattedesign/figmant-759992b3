import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Calendar, BarChart3, FileImage, Users } from 'lucide-react';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { format } from 'date-fns';

export const AllAnalysisPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);

  // Fetch data
  const { data: uploads = [], isLoading: uploadsLoading } = useDesignUploads();
  const { data: batchAnalyses = [], isLoading: batchLoading } = useDesignBatchAnalyses();
  const { data: individualAnalyses = [], isLoading: individualLoading } = useDesignAnalyses();

  // Combine and process all analyses
  const allAnalyses = useMemo(() => {
    const individual = individualAnalyses.map(analysis => {
      const upload = uploads.find(u => u.id === analysis.design_upload_id);
      return {
        id: analysis.id,
        type: 'individual',
        title: upload?.file_name || 'Unknown File',
        status: upload?.status || 'completed',
        created_at: analysis.created_at,
        confidence_score: analysis.confidence_score,
        analysis_type: analysis.analysis_type,
        upload_count: 1,
        winner_upload_id: null,
        batch_name: null,
        rawData: analysis,
        relatedUpload: upload
      };
    });

    const batch = batchAnalyses.map(analysis => {
      const batchUploads = uploads.filter(u => u.batch_id === analysis.batch_id);
      const batchName = batchUploads[0]?.batch_name || `Batch ${analysis.batch_id.slice(0, 8)}`;
      
      return {
        id: analysis.id,
        type: 'batch',
        title: batchName,
        status: 'completed',
        created_at: analysis.created_at,
        confidence_score: analysis.confidence_score,
        analysis_type: analysis.analysis_type,
        upload_count: batchUploads.length,
        winner_upload_id: analysis.winner_upload_id,
        batch_name: batchName,
        rawData: analysis,
        relatedUploads: batchUploads
      };
    });

    return [...individual, ...batch].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [individualAnalyses, batchAnalyses, uploads]);

  // Filter analyses
  const filteredAnalyses = useMemo(() => {
    return allAnalyses.filter(analysis => {
      const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          analysis.analysis_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;
      const matchesType = typeFilter === 'all' || analysis.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allAnalyses, searchTerm, statusFilter, typeFilter]);

  const handleViewAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handleRowClick = (analysis: any) => {
    handleViewAnalysis(analysis);
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

  if (uploadsLoading || batchLoading || individualLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (selectedAnalysis) {
    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedAnalysis(null)}
            className="flex items-center gap-2"
          >
            ← Back to All Analysis
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedAnalysis.title}</h1>
            <p className="text-muted-foreground">
              {selectedAnalysis.type === 'batch' ? 'Batch Analysis' : 'Individual Analysis'} • 
              {format(new Date(selectedAnalysis.created_at), 'PPP')}
            </p>
          </div>
        </div>

        {/* Analysis Detail View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(selectedAnalysis.type)}
              Analysis Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="capitalize">{selectedAnalysis.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(selectedAnalysis.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                <p>{Math.round((selectedAnalysis.confidence_score || 0) * 100)}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Files</label>
                <p>{selectedAnalysis.upload_count} file{selectedAnalysis.upload_count !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {selectedAnalysis.type === 'batch' && selectedAnalysis.winner_upload_id && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Winner</label>
                <p className="text-green-600 font-medium">
                  {selectedAnalysis.relatedUploads?.find((u: any) => u.id === selectedAnalysis.winner_upload_id)?.file_name || 'Unknown'}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Analysis Results</label>
              <div className="mt-2 p-4 bg-muted/30 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(selectedAnalysis.rawData.analysis_results, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Analysis</h1>
          <p className="text-muted-foreground">
            View and manage all your design analyses in one place
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredAnalyses.length} of {allAnalyses.length} analyses
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="batch">Batch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Table */}
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
            {filteredAnalyses.map((analysis) => (
              <TableRow 
                key={analysis.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRowClick(analysis)}
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
                      e.stopPropagation(); // Prevent row click when clicking the button
                      handleViewAnalysis(analysis);
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
        
        {filteredAnalyses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No analyses match your filters'
                : 'No analyses found'
              }
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
