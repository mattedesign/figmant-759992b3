
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Target, Trophy } from 'lucide-react';

interface CompetitiveAdvantageRadarProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const CompetitiveAdvantageRadar: React.FC<CompetitiveAdvantageRadarProps> = ({
  realData,
  onExport,
  className
}) => {
  const competitiveData = [
    { metric: 'UX Quality', current: 85, competitor: 72, fullMark: 100 },
    { metric: 'Performance', current: 78, competitor: 81, fullMark: 100 },
    { metric: 'Accessibility', current: 92, competitor: 65, fullMark: 100 },
    { metric: 'Mobile Experience', current: 88, competitor: 79, fullMark: 100 },
    { metric: 'Trust Signals', current: 84, competitor: 68, fullMark: 100 },
    { metric: 'Conversion Rate', current: 76, competitor: 71, fullMark: 100 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Competitive Advantage
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-red-100 text-red-800">
              +15% Advantage
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
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={competitiveData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
            <Radar
              name="Your Site"
              dataKey="current"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Competitor Avg"
              dataKey="competitor"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded" />
            <span>Your Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded" />
            <span>Competitor Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
