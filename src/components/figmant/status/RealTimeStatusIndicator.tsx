
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisJob {
  id: string;
  type: 'analysis' | 'batch_analysis' | 'premium_analysis';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTime?: number;
  fileName?: string;
  startedAt: Date;
}

interface RealTimeStatusIndicatorProps {
  className?: string;
}

export const RealTimeStatusIndicator: React.FC<RealTimeStatusIndicatorProps> = ({
  className
}) => {
  const [activeJobs, setActiveJobs] = useState<AnalysisJob[]>([
    {
      id: '1',
      type: 'premium_analysis',
      status: 'processing',
      progress: 65,
      estimatedTime: 120,
      fileName: 'homepage-redesign.png',
      startedAt: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '2',
      type: 'batch_analysis',
      status: 'queued',
      progress: 0,
      estimatedTime: 300,
      fileName: 'mobile-app-screens',
      startedAt: new Date()
    }
  ]);

  const [systemStatus, setSystemStatus] = useState<'online' | 'degraded' | 'offline'>('online');
  const [queueLength, setQueueLength] = useState(3);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs(prev => 
        prev.map(job => {
          if (job.status === 'processing' && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 5, 100);
            return {
              ...job,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'processing'
            };
          }
          return job;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return Clock;
      case 'processing':
        return Loader2;
      case 'completed':
        return CheckCircle;
      case 'failed':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'premium_analysis':
        return Zap;
      case 'batch_analysis':
        return TrendingUp;
      default:
        return CheckCircle;
    }
  };

  const formatEstimatedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const processingJobs = activeJobs.filter(job => 
    job.status === 'processing' || job.status === 'queued'
  );

  if (processingJobs.length === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">All systems operational</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {systemStatus}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* System Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                systemStatus === 'online' ? 'bg-green-500' : 
                systemStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              )} />
              <span className="text-sm font-medium">
                System Status: {systemStatus}
              </span>
            </div>
            {queueLength > 0 && (
              <Badge variant="outline" className="text-xs">
                {queueLength} in queue
              </Badge>
            )}
          </div>

          {/* Active Jobs */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              Active Analyses ({processingJobs.length})
            </h4>
            
            {processingJobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              const TypeIcon = getTypeIcon(job.type);
              const statusColor = getStatusColor(job.status);
              
              return (
                <div key={job.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", statusColor)}>
                        <StatusIcon className={cn(
                          "h-3 w-3",
                          job.status === 'processing' && "animate-spin"
                        )} />
                      </div>
                      <div className="flex items-center gap-1">
                        <TypeIcon className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {job.fileName || `${job.type.replace('_', ' ')}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {job.status === 'processing' && (
                        <span className="text-xs text-gray-500">
                          {Math.round(job.progress)}%
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="space-y-1">
                      <Progress value={job.progress} className="h-2" />
                      {job.estimatedTime && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {formatEstimatedTime(Math.round((100 - job.progress) / 100 * job.estimatedTime))} remaining
                          </span>
                          <span>
                            Started {Math.round((Date.now() - job.startedAt.getTime()) / 60000)}m ago
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              View Queue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
