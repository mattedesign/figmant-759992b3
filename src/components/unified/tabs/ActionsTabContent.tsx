
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  MessageSquare, 
  Download, 
  Share, 
  Copy,
  RefreshCw,
  Trash2,
  Settings,
  FileDown,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueAnalysis = () => {
    console.log('🔍 ActionsTabContent: Continue analysis clicked:', {
      analysisType,
      analysisId: analysis.id
    });

    if (analysisType === 'chat') {
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else if (analysisType === 'wizard' || analysisType === 'premium') {
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else {
      navigate('/figmant', { 
        state: { 
          activeSection: 'analysis',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    }
    onClose();
  };

  const handleCopyAnalysis = async () => {
    try {
      const analysisText = `
Analysis Title: ${analysis.title || 'Analysis'}
Type: ${analysisType}
Created: ${new Date(analysis.created_at).toLocaleString()}
Confidence: ${Math.round((analysis.confidence_score || 0.8) * 100)}%

Analysis Results:
${analysis.analysis_results?.response || analysis.analysis_results?.analysis || 'No analysis content available'}

${analysis.suggestions ? `\nSuggestions:\n${typeof analysis.suggestions === 'string' ? analysis.suggestions : JSON.stringify(analysis.suggestions, null, 2)}` : ''}
      `.trim();

      await navigator.clipboard.writeText(analysisText);
      toast({
        title: "Analysis Copied",
        description: "Analysis content has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy analysis to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShareAnalysis = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Analysis: ${analysis.title || 'Analysis'}`,
          text: analysis.analysis_results?.response?.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Analysis link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAnalysis = () => {
    const analysisData = {
      id: analysis.id,
      title: analysis.title || 'Analysis',
      type: analysisType,
      created_at: analysis.created_at,
      confidence_score: analysis.confidence_score,
      analysis_results: analysis.analysis_results,
      suggestions: analysis.suggestions,
      improvement_areas: analysis.improvement_areas,
      impact_summary: analysis.impact_summary
    };

    const blob = new Blob([JSON.stringify(analysisData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${analysis.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Analysis data is being downloaded",
    });
  };

  const handleEmailAnalysis = () => {
    const subject = `Analysis Report: ${analysis.title || 'Analysis'}`;
    const body = `
Please find the analysis report below:

Title: ${analysis.title || 'Analysis'}
Type: ${analysisType}
Created: ${new Date(analysis.created_at).toLocaleString()}
Confidence Score: ${Math.round((analysis.confidence_score || 0.8) * 100)}%

Analysis Results:
${analysis.analysis_results?.response || analysis.analysis_results?.analysis || 'No analysis content available'}

${analysis.suggestions ? `\nSuggestions:\n${typeof analysis.suggestions === 'string' ? analysis.suggestions : JSON.stringify(analysis.suggestions, null, 2)}` : ''}

Generated by Figmant AI Analysis Platform
    `.trim();

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleRerunAnalysis = () => {
    // This would trigger a rerun of the analysis
    toast({
      title: "Analysis Rerun",
      description: "This feature is coming soon",
    });
  };

  const handleDeleteAnalysis = () => {
    // This would delete the analysis (with confirmation)
    toast({
      title: "Delete Analysis",
      description: "This feature is coming soon",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Primary Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleContinueAnalysis}
            className="w-full"
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {analysisType === 'chat' ? 'Continue in Chat' : 
             analysisType === 'wizard' || analysisType === 'premium' ? 'Open in Wizard' :
             'View in Analysis'}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleCopyAnalysis}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Analysis
            </Button>
            
            <Button variant="outline" onClick={handleShareAnalysis}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export & Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Download
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleDownloadAnalysis} className="w-full">
            <FileDown className="h-4 w-4 mr-2" />
            Download as JSON
          </Button>
          
          <Button variant="outline" onClick={handleEmailAnalysis} className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Email Analysis
          </Button>
        </CardContent>
      </Card>

      {/* Advanced Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" onClick={handleRerunAnalysis} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Rerun Analysis
            <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDeleteAnalysis} 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Analysis
            <Badge variant="secondary" className="ml-2 text-xs">Coming Soon</Badge>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quick Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Analysis ID:</span>
              <code className="text-xs">{analysis.id}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <Badge variant="outline" className="text-xs">{analysisType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <Badge variant="default" className="text-xs">Completed</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created:</span>
              <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use "Continue in Chat" to ask follow-up questions</li>
            <li>• Download analysis for offline review</li>
            <li>• Share analysis with team members via email</li>
            <li>• Copy analysis text for reports and presentations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
