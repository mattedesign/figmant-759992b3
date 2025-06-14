
import React from 'react';
import { Logo } from '@/components/common/Logo';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center">
        <Logo size="lg" />
      </div>
    </div>
  );
};
