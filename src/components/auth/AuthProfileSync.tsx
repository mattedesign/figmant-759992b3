
import React from 'react';
import { useProfileSync } from '@/hooks/useProfileSync';

export const AuthProfileSync: React.FC = () => {
  useProfileSync();
  return null;
};
