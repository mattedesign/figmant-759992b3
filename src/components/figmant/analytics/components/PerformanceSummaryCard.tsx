
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

export const PerformanceSummaryCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
            <p className="text-sm text-gray-600">Overall Health Score</p>
            <Progress value={87} className="mt-2 h-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">+12%</div>
            <p className="text-sm text-gray-600">Performance Improvement</p>
            <Progress value={65} className="mt-2 h-2" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
            <p className="text-sm text-gray-600">User Satisfaction</p>
            <Progress value={94} className="mt-2 h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
