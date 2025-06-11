
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface StorageStatusProps {
  status: 'checking' | 'ready' | 'error';
}

export const StorageStatus: React.FC<StorageStatusProps> = ({ status }) => {
  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <span>Checking storage configuration...</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <span>File uploads are currently unavailable. Please contact your administrator.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
      <CheckCircle className="h-4 w-4" />
      <span>Ready for file uploads</span>
    </div>
  );
};
