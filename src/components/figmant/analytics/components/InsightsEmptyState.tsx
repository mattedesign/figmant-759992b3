
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface InsightsEmptyStateProps {
  activeTab: string;
}

export const InsightsEmptyState: React.FC<InsightsEmptyStateProps> = ({ activeTab }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">
          {activeTab === 'all' ? 'No insights available' : `No ${activeTab} insights`}
        </h3>
        <p className="text-sm text-gray-500">
          {activeTab === 'alert' 
            ? "Great! No alerts at the moment. Your system is running smoothly."
            : "Check back later for new insights and recommendations."
          }
        </p>
      </CardContent>
    </Card>
  );
};
