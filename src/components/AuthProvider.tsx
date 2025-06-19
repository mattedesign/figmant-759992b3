
import React from 'react';
import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  );
};
