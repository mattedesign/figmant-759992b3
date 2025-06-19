
import React from 'react';
import { FileText } from 'lucide-react';

export const NavigationEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">No files or analysis yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Upload files or add URLs to see them here
      </p>
    </div>
  );
};
