
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  FileText,
  User,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Share2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'analysis_completed' | 'analysis_started' | 'file_uploaded' | 'report_downloaded' | 'analysis_shared' | 'user_joined' | 'template_used';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: {
    fileName?: string;
    analysisType?: string;
    confidence?: number;
    templateName?: string;
  };
}

interface LiveActivityFeedProps {
  className?: string;
  showHeader?: boolean;
  maxItems?: number;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  className,
  showHeader = true,
  maxItems = 10
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'analysis_completed',
      title: 'Premium Analysis Completed',
      description: 'High-confidence analysis finished for homepage design',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      user: 'Sarah Chen',
      metadata: {
        fileName: 'homepage-redesign.png',
        analysisType: 'premium',
        confidence: 92
      }
    },
    {
      id: '2',
      type: 'file_uploaded',
      title: 'New Design Uploaded',
      description: 'Mobile app interface uploaded for analysis',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      user: 'Mike Johnson',
      metadata: {
        fileName: 'mobile-interface-v2.png'
      }
    },
    {
      id: '3',
      type: 'analysis_started',
      title: 'Batch Analysis Started',
      description: 'Processing 12 design variations',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      user: 'Alex Kim',
      metadata: {
        analysisType: 'batch'
      }
    },
    {
      id: '4',
      type: 'template_used',
      title: 'Template Applied',
      description: 'E-commerce Conversion template used for new analysis',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      user: 'Emma Davis',
      metadata: {
        templateName: 'E-commerce Conversion Optimizer'
      }
    },
    {
      id: '5',
      type: 'report_downloaded',
      title: 'Report Downloaded',
      description: 'Comprehensive analysis report exported',
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      user: 'David Wilson',
      metadata: {
        fileName: 'landing-page-analysis.pdf'
      }
    }
  ]);

  // Simulate new activities
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new activities
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: `${Date.now()}`,
          type: 'analysis_completed',
          title: 'Analysis Completed',
          description: 'New design analysis finished',
          timestamp: new Date(),
          user: 'System',
          metadata: {
            confidence: Math.round(Math.random() * 30 + 70)
          }
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
      }
    }, 10000); // Add new activity every 10 seconds

    return () => clearInterval(interval);
  }, [maxItems]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis_completed':
        return CheckCircle;
      case 'analysis_started':
        return Activity;
      case 'file_uploaded':
        return Upload;
      case 'report_downloaded':
        return Download;
      case 'analysis_shared':
        return Share2;
      case 'user_joined':
        return User;
      case 'template_used':
        return FileText;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'analysis_completed':
        return 'text-green-600 bg-green-100';
      case 'analysis_started':
        return 'text-blue-600 bg-blue-100';
      case 'file_uploaded':
        return 'text-purple-600 bg-purple-100';
      case 'report_downloaded':
        return 'text-orange-600 bg-orange-100';
      case 'analysis_shared':
        return 'text-pink-600 bg-pink-100';
      case 'user_joined':
        return 'text-indigo-600 bg-indigo-100';
      case 'template_used':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Activity
            <Badge variant="secondary" className="ml-auto">
              {displayedActivities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("p-0", showHeader && "pt-0")}>
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {displayedActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              const isNew = index === 0 && Date.now() - activity.timestamp.getTime() < 30000;
              
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "p-4 border-b last:border-b-0 transition-colors",
                    isNew && "bg-blue-50 animate-fade-in"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {isNew && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {activity.user && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {activity.user}
                            </span>
                          )}
                          {activity.metadata?.fileName && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {activity.metadata.fileName}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {activity.metadata?.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {activity.metadata.confidence}% confidence
                            </Badge>
                          )}
                          {activity.metadata?.analysisType && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.metadata.analysisType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
