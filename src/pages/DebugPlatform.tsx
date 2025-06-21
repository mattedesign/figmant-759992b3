
import React from 'react';
import { DebugPlatformLayout } from '@/components/debug-platform/DebugPlatformLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';

const DebugPlatform: React.FC = () => {
  return (
    <AuthGuard>
      <DebugPlatformLayout />
    </AuthGuard>
  );
};

export default DebugPlatform;
