
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const EmptyStateSection: React.FC = () => {
  return (
    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
      <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <h3 className="font-semibold text-sm mb-2">No Analysis Data</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Run design analyses to see revenue impact projections
      </p>
      <Button size="sm">
        Start Analysis
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
