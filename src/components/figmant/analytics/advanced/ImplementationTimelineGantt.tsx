
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

interface ImplementationTimelineGanttProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const ImplementationTimelineGantt: React.FC<ImplementationTimelineGanttProps> = ({
  realData,
  onExport,
  className
}) => {
  const timelineData = [
    { task: 'Navigation Improvements', start: 0, duration: 14, status: 'completed' },
    { task: 'CTA Optimization', start: 7, duration: 21, status: 'in-progress' },
    { task: 'Mobile UX Enhancement', start: 14, duration: 28, status: 'planned' },
    { task: 'Accessibility Updates', start: 21, duration: 14, status: 'planned' },
    { task: 'Performance Optimization', start: 28, duration: 21, status: 'planned' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Implementation Timeline
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-orange-100 text-orange-800">
              90 Days Total
            </Badge>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.task}</span>
                <span className="text-xs text-gray-500">{item.duration} days</span>
              </div>
              <div className="relative">
                <div className="w-full h-6 bg-gray-100 rounded">
                  <div 
                    className={`h-full rounded ${getStatusColor(item.status)}`}
                    style={{ 
                      width: `${(item.duration / 42) * 100}%`,
                      marginLeft: `${(item.start / 42) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex items-center gap-4 mt-6 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span>Planned</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
