
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignUploader } from '@/components/design/DesignUploader';
import { DesignList } from '@/components/design/DesignList';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentAnalyses } from '@/components/dashboard/RecentAnalyses';
import { AnalysisStats } from '@/components/dashboard/AnalysisStats';
import { Navigation } from '@/components/layout/Navigation';
import { DesignUpload } from '@/types/design';
import { AnalysisViewer } from '@/components/design/AnalysisViewer';
import { Upload, History, BarChart3, FileText } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedUpload, setSelectedUpload] = useState<DesignUpload | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Design Analysis Dashboard</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Upload your designs and get AI-powered insights to improve user experience and conversion rates
          </p>
          
          {/* Quick Upload Card */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Upload className="h-5 w-5" />
                Quick Upload
              </CardTitle>
              <CardDescription>
                Get started by uploading a design for instant AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignUploader />
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <AnalysisStats />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
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

          <TabsContent value="upload" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DesignUploader />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Analyses</CardTitle>
                    <CardDescription>Your latest design analysis results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAnalyses onViewAnalysis={setSelectedUpload} limit={3} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DesignList onViewAnalysis={setSelectedUpload} />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <RecentAnalyses onViewAnalysis={setSelectedUpload} showInsights={true} />
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
