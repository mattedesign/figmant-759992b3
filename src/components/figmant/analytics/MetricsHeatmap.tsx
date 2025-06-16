
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar, TrendingUp } from 'lucide-react';

interface HeatmapData {
  date: string;
  value: number;
  analyses: number;
}

interface MetricsHeatmapProps {
  data: HeatmapData[];
  metric: 'analyses' | 'successRate' | 'avgConfidence';
  isLoading: boolean;
  title?: string;
  className?: string;
}

export const MetricsHeatmap: React.FC<MetricsHeatmapProps> = ({
  data,
  metric,
  isLoading,
  title,
  className
}) => {
  // Generate last 12 weeks of data
  const generateHeatmapData = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7));
      const weekEnd = endOfWeek(weekStart);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weekData = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayData = data.find(d => d.date === dateStr);
        return {
          date: dateStr,
          value: dayData?.value || 0,
          analyses: dayData?.analyses || 0
        };
      });
      
      weeks.push(weekData);
    }
    
    return weeks;
  };

  const getIntensityColor = (value: number, maxValue: number) => {
    if (value === 0) return 'bg-gray-100';
    
    const intensity = value / maxValue;
    if (intensity <= 0.25) return 'bg-blue-200';
    if (intensity <= 0.5) return 'bg-blue-300';
    if (intensity <= 0.75) return 'bg-blue-400';
    return 'bg-blue-500';
  };

  const getMetricTitle = () => {
    switch (metric) {
      case 'analyses':
        return 'Analysis Volume Heatmap';
      case 'successRate':
        return 'Success Rate Heatmap';
      case 'avgConfidence':
        return 'Confidence Score Heatmap';
      default:
        return 'Activity Heatmap';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title || getMetricTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const weeks = generateHeatmapData();
  const maxValue = Math.max(...data.map(d => d.value));
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title || getMetricTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day labels */}
          <div className="grid grid-cols-14 gap-1 text-xs text-gray-500">
            <div></div> {/* Empty space for week labels */}
            {weeks[0]?.map((_, index) => (
              <div key={index} className="text-center">
                {dayLabels[index]}
              </div>
            ))}
            <div></div> {/* Empty space for legend */}
          </div>

          {/* Heatmap */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-14 gap-1">
                <div className="text-xs text-gray-500 text-right pr-2">
                  W{weekIndex + 1}
                </div>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110",
                      getIntensityColor(day.value, maxValue)
                    )}
                    title={`${format(new Date(day.date), 'MMM dd')}: ${day.value} ${metric === 'analyses' ? 'analyses' : '%'}`}
                  />
                ))}
                {weekIndex === 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-100 rounded-sm" />
                      <div className="w-2 h-2 bg-blue-200 rounded-sm" />
                      <div className="w-2 h-2 bg-blue-300 rounded-sm" />
                      <div className="w-2 h-2 bg-blue-400 rounded-sm" />
                      <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                    </div>
                    <span>More</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Last 12 weeks: {data.reduce((sum, d) => sum + d.analyses, 0)} total analyses
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              {((data.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7) / 
                (data.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) / 7) * 100 - 100).toFixed(1)}% vs last week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
