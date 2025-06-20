
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity } from 'lucide-react';

interface UserEngagementPatternsProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  onExport?: () => void;
  className?: string;
}

export const UserEngagementPatterns: React.FC<UserEngagementPatternsProps> = ({
  realData,
  onExport,
  className
}) => {
  const engagementData = [
    { hour: '00', sessions: 12, analyses: 5 },
    { hour: '06', sessions: 8, analyses: 3 },
    { hour: '09', sessions: 45, analyses: 18 },
    { hour: '12', sessions: 52, analyses: 23 },
    { hour: '15', sessions: 38, analyses: 16 },
    { hour: '18', sessions: 28, analyses: 12 },
    { hour: '21', sessions: 19, analyses: 8 }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            User Engagement Patterns
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              Peak: 12PM
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
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Bar dataKey="sessions" fill="#8b5cf6" name="Sessions" />
            <Bar dataKey="analyses" fill="#a855f7" name="Analyses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
