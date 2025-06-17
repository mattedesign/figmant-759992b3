
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewAnalysisButtonProps {
  isCollapsed: boolean;
}

export const NewAnalysisButton: React.FC<NewAnalysisButtonProps> = ({ isCollapsed }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      {isCollapsed ? (
        <div className="flex justify-center">
          <Button
            size="sm"
            className="w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            title="New Analysis"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      )}
    </div>
  );
};
