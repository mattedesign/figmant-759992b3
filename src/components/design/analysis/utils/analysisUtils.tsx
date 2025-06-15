
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileImage } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: { variant: 'default' as const, label: 'Completed' },
    processing: { variant: 'secondary' as const, label: 'Processing' },
    pending: { variant: 'outline' as const, label: 'Pending' },
    failed: { variant: 'destructive' as const, label: 'Failed' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const getTypeIcon = (type: string) => {
  return type === 'batch' ? (
    <BarChart3 className="h-4 w-4 text-blue-600" />
  ) : (
    <FileImage className="h-4 w-4 text-green-500" />
  );
};

export const getGroupIcon = (groupType: string) => {
  return groupType === 'batch' ? (
    <BarChart3 className="h-5 w-5 text-blue-600" />
  ) : (
    <FileImage className="h-5 w-5 text-green-500" />
  );
};
