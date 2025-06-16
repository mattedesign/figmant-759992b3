
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from '@/components/ui/drawer';
import { 
  X, 
  Download, 
  Share2, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Clock,
  User,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResults } from '@/components/design/chat/AnalysisResults';

interface AnalysisDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
}

export const AnalysisDetailDrawer: React.FC<AnalysisDetailDrawerProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [isGeneratingExecutive, setIsGeneratingExecutive] = useState(false);
  const { toast } = useToast();

  if (!analysis) return null;

  const isDesignAnalysis = analysis.type === 'design';
  const isChatAnalysis = analysis.type === 'chat';

  const analysisContent = isDesignAnalysis 
    ? analysis.analysis_results?.analysis || 'No analysis content available'
    : analysis.analysis_results?.response || 'No analysis content available';

  const handleGenerateExecutiveSummary = async () => {
    setIsGeneratingExecutive(true);
    try {
      // TODO: Implement executive summary generation
      toast({
        title: "Executive Summary",
        description: "Executive summary generation will be implemented soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate executive summary.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingExecutive(false);
    }
  };

  const handleFollowUpQuestion = async () => {
    if (!followUpPrompt.trim()) return;
    
    try {
      // TODO: Implement follow-up analysis
      toast({
        title: "Follow-up Analysis",
        description: "Follow-up analysis will be implemented soon.",
      });
      setFollowUpPrompt('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process follow-up question.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    const content = `Analysis Report - ${analysis.title}\n\n${analysisContent}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${analysis.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Analysis link copied to clipboard.",
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[95vh] max-w-7xl mx-auto">
        <DrawerHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  {isDesignAnalysis ? (
                    <FileText className="w-4 h-4 text-blue-600" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <DrawerTitle className="text-xl font-semibold">
                  {analysis.title}
                </DrawerTitle>
                <Badge variant={isDesignAnalysis ? "default" : "secondary"}>
                  {isDesignAnalysis ? 'Design Analysis' : 'Chat Analysis'}
                </Badge>
              </div>
              <DrawerDescription className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                </div>
                {analysis.confidence_score && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {Math.round(analysis.confidence_score * 100)}% confidence
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {analysis.analysis_type || 'General Analysis'}
                </div>
              </DrawerDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b bg-white px-6">
              <TabsList className="grid grid-cols-4 w-fit">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="executive">Executive Summary</TabsTrigger>
                <TabsTrigger value="interact">Interact</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border p-6">
                      <h3 className="font-semibold mb-4">Analysis Summary</h3>
                      <div className="prose max-w-none">
                        <div className="bg-gray-50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                          {analysisContent.substring(0, 500)}...
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="font-medium mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={handleGenerateExecutiveSummary}
                          disabled={isGeneratingExecutive}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isGeneratingExecutive ? 'Generating...' : 'Generate Executive Summary'}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Key Insights
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ask Follow-up
                        </Button>
                      </div>
                    </div>
                    
                    {analysis.prompt_used && (
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="font-medium mb-3">Original Prompt</h4>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {analysis.prompt_used.substring(0, 200)}...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="p-6">
                <div className="bg-white rounded-lg border">
                  <AnalysisResults
                    lastAnalysisResult={analysis.analysis_results || analysis}
                    uploadIds={analysis.upload_ids || []}
                    showEnhancedSummary={true}
                  />
                </div>
              </TabsContent>

              <TabsContent value="executive" className="p-6">
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Executive Summary</h3>
                    <Button 
                      onClick={handleGenerateExecutiveSummary}
                      disabled={isGeneratingExecutive}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGeneratingExecutive ? 'Generating...' : 'Generate Summary'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 text-center py-8">
                        Click "Generate Summary" to create an executive summary of this analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interact" className="p-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Continue the Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ask a follow-up question about this analysis:
                      </label>
                      <Textarea
                        value={followUpPrompt}
                        onChange={(e) => setFollowUpPrompt(e.target.value)}
                        placeholder="e.g., Can you provide more specific recommendations for improving the user experience?"
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleFollowUpQuestion}
                        disabled={!followUpPrompt.trim()}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Follow-up
                      </Button>
                      <Button variant="outline" onClick={() => setFollowUpPrompt('')}>
                        Clear
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium mb-3">Suggested Follow-ups</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Can you provide specific metrics to measure improvement?",
                          "What are the top 3 priorities for implementation?",
                          "How does this compare to industry best practices?",
                          "What would be the estimated impact of these changes?"
                        ].map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="text-left h-auto p-3 whitespace-normal"
                            onClick={() => setFollowUpPrompt(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
