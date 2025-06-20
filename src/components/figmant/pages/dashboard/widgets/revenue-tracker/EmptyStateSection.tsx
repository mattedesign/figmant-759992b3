
import React from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyStateSection: React.FC = () => {
  return (
    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Start Tracking Revenue Impact
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Upload designs and run analyses to see how UX improvements translate to business results.
      </p>
      <Button className="bg-blue-600 hover:bg-blue-700">
        Upload First Design
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
