
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';
import { Calendar, TrendingUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityHeatMapProps {
  data?: any[];
  className?: string;
}

export const ActivityHeatMap: React.FC<ActivityHeatMapProps> = ({
  data = [],
  className
}) => {
  const [timeRange, setTimeRange] = useState<'12w' | '6m' | '1y'>('12w');

  // Generate heatmap data
  const generateHeatmapData = () => {
    const weeks = timeRange === '12w' ? 12 : timeRange === '6m' ? 26 : 52;
    const weeksData = [];
    const today = new Date();
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(today, i));
      const weekEnd = endOfWeek(weekStart);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weekData = days.map(day => {
        const dayOfWeek = getDay(day);
        const intensity = Math.random() * 10; // Simulate activity intensity
        return {
          date: format(day, 'yyyy-MM-dd'),
          day: format(day, 'E'),
          dayOfWeek,
          intensity: Math.floor(intensity),
          activities: Math.floor(intensity * 2) + 1
        };
      });
      
      weeksData.push(weekData);
    }
    
    return weeksData;
  };

  const heatmapData = generateHeatmapData();
  const maxIntensity = Math.max(...heatmapData.flat().map(d => d.intensity));

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    
    const normalizedIntensity = intensity / maxIntensity;
    if (normalizedIntensity <= 0.2) return 'bg-blue-200';
    if (normalizedIntensity <= 0.4) return 'bg-blue-300';
    if (normalizedIntensity <= 0.6) return 'bg-blue-400';
    if (normalizedIntensity <= 0.8) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  const getDayLabel = (dayIndex: number) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[dayIndex];
  };

  const totalActivity = heatmapData.flat().reduce((sum, day) => sum + day.activities, 0);
  const avgDaily = totalActivity / heatmapData.flat().length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <CardTitle>Activity Heatmap</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {avgDaily.toFixed(1)} avg/day
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-600">Period:</span>
          <div className="flex gap-1">
            {(['12w', '6m', '1y'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '12w' ? '12 weeks' : range === '6m' ? '6 months' : '1 year'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Day labels */}
          <div className="grid grid-cols-8 gap-1 text-xs text-gray-500">
            <div></div> {/* Empty space for week numbers */}
            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
              <div key={dayIndex} className="text-center">
                {getDayLabel(dayIndex)}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-8 gap-1">
                <div className="text-xs text-gray-500 text-right pr-2 flex items-center">
                  W{weekIndex + 1}
                </div>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-blue-300",
                      getIntensityColor(day.intensity)
                    )}
                    title={`${format(new Date(day.date), 'MMM dd, yyyy')}: ${day.activities} activities`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-100 rounded-sm" />
                <div className="w-2 h-2 bg-blue-200 rounded-sm" />
                <div className="w-2 h-2 bg-blue-300 rounded-sm" />
                <div className="w-2 h-2 bg-blue-400 rounded-sm" />
                <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                <div className="w-2 h-2 bg-blue-600 rounded-sm" />
              </div>
              <span>More</span>
            </div>
            
            <div className="text-xs text-gray-500">
              {totalActivity} total activities in {timeRange === '12w' ? '12 weeks' : timeRange === '6m' ? '6 months' : '1 year'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
