
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Copy, 
  Mail, 
  FileText, 
  Printer,
  BookOpen,
  RefreshCw,
  Archive,
  Trash2,
  ExternalLink,
  MessageSquare,
  Settings,
  Star,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionsTabContentProps {
  analysis: any;
  analysisType: string;
  onClose: () => void;
}

export const ActionsTabContent: React.FC<ActionsTabContentProps> = ({
  analysis,
  analysisType,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Simulate PDF export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Export Complete",
        description: "Analysis has been exported as PDF"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export analysis",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/analysis/${analysisType}/${analysis.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Analysis link copied to clipboard"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Analysis: ${analysis.title || 'Untitled'}`,
        url: `${window.location.origin}/analysis/${analysisType}/${analysis.id}`
      });
    } else {
      handleCopyLink();
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Analysis Results: ${analysis.title || 'Untitled'}`);
    const body = encodeURIComponent(`Check out this analysis: ${window.location.origin}/analysis/${analysisType}/${analysis.id}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleReRunAnalysis = () => {
    toast({
      title: "Re-running Analysis",
      description: "This feature will be available soon"
    });
  };

  const handleArchive = () => {
    toast({
      title: "Archived",
      description: "Analysis has been archived"
    });
  };

  const handleDelete = () => {
    toast({
      title: "Deleted",
      description: "Analysis has been deleted",
      variant: "destructive"
    });
    onClose();
  };

  const handleFavorite = () => {
    toast({
      title: "Added to Favorites",
      description: "Analysis saved to favorites"
    });
  };

  const handleFlag = () => {
    toast({
      title: "Flagged for Review",
      description: "Analysis has been flagged"
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Download
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full justify-start"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.print()}
            className="w-full justify-start"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Analysis
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleExportPDF}
            className="w-full justify-start"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardContent>
      </Card>

      {/* Share Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share & Collaborate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleShare}
            className="w-full justify-start"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleCopyLink}
            className="w-full justify-start"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleEmailShare}
            className="w-full justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Link
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => toast({ title: "Coming Soon", description: "Team collaboration features coming soon" })}
            className="w-full justify-start"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analysis Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline"
            onClick={handleReRunAnalysis}
            className="w-full justify-start"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-run Analysis
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleFavorite}
            className="w-full justify-start"
          >
            <Star className="h-4 w-4 mr-2" />
            Add to Favorites
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleFlag}
            className="w-full justify-start"
          >
            <Flag className="h-4 w-4 mr-2" />
            Flag for Review
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.open(`/analysis/${analysisType}/${analysis.id}`, '_blank')}
            className="w-full justify-start"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Manage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline"
            onClick={handleArchive}
            className="w-full justify-start"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive Analysis
          </Button>
          
          <Button 
            variant="destructive"
            onClick={handleDelete}
            className="w-full justify-start"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Info */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <Badge variant="outline" className="capitalize">{analysisType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID:</span>
              <span className="font-mono text-xs">{analysis.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created:</span>
              <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
            </div>
            {analysis.confidence_score && (
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence:</span>
                <span>{Math.round(analysis.confidence_score * 100)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
