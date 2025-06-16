
import React from 'react';
import { Logo } from '@/components/common/Logo';

export const SidebarHeader: React.FC = () => {
  return (
    <div className="p-4 border-b border-gray-200/30">
      <Logo size="md" className="w-auto" />
    </div>
  );
};
