
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedDesignUploader } from '@/components/design/EnhancedDesignUploader';
import { DesignChatInterface } from '@/components/design/DesignChatInterface';
import { DesignList } from '@/components/design/DesignList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentAnalyses } from '@/components/dashboard/RecentAnalyses';
import { Navigation } from '@/components/layout/Navigation';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';
import { AnalysisViewer } from '@/components/design/AnalysisViewer';
import { EnhancedBatchAnalysisViewer } from '@/components/design/EnhancedBatchAnalysisViewer';
import { MessageSquare, Upload, History, BarChart3, FileText } from 'lucide-react';
import { UploadProgress } from '@/components/dashboard/UploadProgress';
import { ClaudeConnectionTest } from '@/components/dashboard/ClaudeConnectionTest';
import { ClaudeInsights } from '@/components/dashboard/ClaudeInsights';

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedUpload, setSelectedUpload] = useState<DesignUpload | null>(null);
  const [selectedBatchAnalysis, setSelectedBatchAnalysis] = useState<DesignBatchAnalysis | null>(null);

  // Handle navigation from processing page
  useEffect(() => {
    if (location.state) {
      if (location.state.viewBatchAnalysis) {
        setSelectedBatchAnalysis(location.state.viewBatchAnalysis);
      } else if (location.state.viewUpload) {
        setSelectedUpload(location.state.viewUpload);
      }
      // Clear the state to prevent repeated navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (selectedUpload) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <AnalysisViewer
            upload={selectedUpload}
            onBack={() => setSelectedUpload(null)}
          />
        </main>
      </div>
    );
  }

  if (selectedBatchAnalysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <EnhancedBatchAnalysisViewer
            batchAnalysis={selectedBatchAnalysis}
            onBack={() => setSelectedBatchAnalysis(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Analysis
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>UX Analysis Assistant</CardTitle>
                    <CardDescription>
                      Chat with our AI to get instant design analysis and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DesignChatInterface />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Analyses</CardTitle>
                    <CardDescription>Your latest results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAnalyses 
                      onViewAnalysis={setSelectedUpload}
                      onViewBatchAnalysis={setSelectedBatchAnalysis}
                      limit={3} 
                    />
                  </CardContent>
                </Card>
                <UploadProgress />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EnhancedDesignUploader />
                <UploadProgress />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Analyses</CardTitle>
                    <CardDescription>Your latest design analysis results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAnalyses 
                      onViewAnalysis={setSelectedUpload}
                      onViewBatchAnalysis={setSelectedBatchAnalysis}
                      limit={3} 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DesignList onViewAnalysis={setSelectedUpload} />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="space-y-6">
              <ClaudeConnectionTest />
              <ClaudeInsights />
              <RecentAnalyses 
                onViewAnalysis={setSelectedUpload}
                onViewBatchAnalysis={setSelectedBatchAnalysis}
                showInsights={true} 
              />
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <QuickActions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
