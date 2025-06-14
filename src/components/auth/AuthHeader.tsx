
import React from 'react';
import { LogoDisplay } from '@/components/common/LogoDisplay';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center">
        <LogoDisplay context="auth" />
      </div>
    </div>
  );
};
