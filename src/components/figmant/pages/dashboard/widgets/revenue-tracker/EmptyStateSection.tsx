
import React from 'react';
import { BarChart3, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyStateSection: React.FC = () => {
  return (
    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <BarChart3 className="h-8 w-8 text-blue-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            No Analysis Data Available
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            Upload your first design or start an analysis to see revenue impact projections and ROI calculations.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Start Your First Analysis
        </Button>
      </div>
    </div>
  );
};
