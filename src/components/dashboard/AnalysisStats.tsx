
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDesignUploads } from '@/hooks/useDesignAnalysis';
import { FileImage, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const AnalysisStats = () => {
  const { data: uploads = [] } = useDesignUploads();

  const totalUploads = uploads.length;
  const completedAnalyses = uploads.filter(upload => upload.status === 'completed').length;
  const processingAnalyses = uploads.filter(upload => upload.status === 'processing').length;
  const recentUploads = uploads.filter(upload => {
    const uploadDate = new Date(upload.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total Designs',
      value: totalUploads,
      description: 'Designs uploaded',
      icon: FileImage,
      color: 'default' as const
    },
    {
      title: 'Completed Analyses',
      value: completedAnalyses,
      description: 'Ready to view',
      icon: CheckCircle,
      color: 'default' as const
    },
    {
      title: 'Processing',
      value: processingAnalyses,
      description: 'Currently analyzing',
      icon: Clock,
      color: 'secondary' as const
    },
    {
      title: 'This Week',
      value: recentUploads,
      description: 'New uploads',
      icon: TrendingUp,
      color: 'outline' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
