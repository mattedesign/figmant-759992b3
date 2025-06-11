
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDesignUseCases } from '@/hooks/useDesignAnalysis';
import { Upload, FileText, Zap, Target, Smartphone, Globe } from 'lucide-react';

export const QuickActions = () => {
  const { data: useCases = [] } = useDesignUseCases();

  const quickActionCards = [
    {
      title: 'Upload New Design',
      description: 'Start a new design analysis',
      icon: Upload,
      action: () => {
        // Scroll to upload section or switch tabs
        const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
        uploadTab?.click();
      },
      variant: 'default' as const
    },
    {
      title: 'Landing Page Analysis',
      description: 'Optimize your landing page for conversions',
      icon: Target,
      action: () => {
        const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
        uploadTab?.click();
        // Could also pre-select landing page use case
      },
      variant: 'outline' as const
    },
    {
      title: 'Mobile UX Review',
      description: 'Check mobile user experience',
      icon: Smartphone,
      action: () => {
        const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
        uploadTab?.click();
      },
      variant: 'outline' as const
    },
    {
      title: 'Website Analysis',
      description: 'Comprehensive website review',
      icon: Globe,
      action: () => {
        const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
        uploadTab?.click();
      },
      variant: 'outline' as const
    }
  ];

  const useCaseActions = useCases.slice(0, 4).map(useCase => ({
    title: useCase.name,
    description: useCase.description,
    icon: FileText,
    action: () => {
      const uploadTab = document.querySelector('[value="upload"]') as HTMLElement;
      uploadTab?.click();
    },
    variant: 'secondary' as const
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common design analysis tasks to get you started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActionCards.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant={action.variant}
                  className="h-auto p-4 flex flex-col items-center text-center gap-2"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6" />
                  <div>
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {useCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Types</CardTitle>
            <CardDescription>
              Choose from available analysis types based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useCaseActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.title}
                    variant={action.variant}
                    className="h-auto p-4 justify-start text-left gap-3"
                    onClick={action.action}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs opacity-70 line-clamp-2">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Upload high-quality images</p>
                <p className="text-muted-foreground">Clear, high-resolution images produce better analysis results</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Choose the right analysis type</p>
                <p className="text-muted-foreground">Select the analysis type that matches your design's purpose</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Review analysis suggestions</p>
                <p className="text-muted-foreground">Our AI provides actionable recommendations for improvement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
