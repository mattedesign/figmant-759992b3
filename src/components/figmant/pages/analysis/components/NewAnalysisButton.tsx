
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewAnalysisButtonProps {
  isCollapsed: boolean;
}

export const NewAnalysisButton: React.FC<NewAnalysisButtonProps> = ({ isCollapsed }) => {
  return (
    <Button
      size="sm"
      className="w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
      title="New Analysis"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
};
