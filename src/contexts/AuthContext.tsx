
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { createAuthService } from '@/services/authService';
import { createAuthActions } from '@/services/authActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useAuthState();
  const authService = createAuthService();
  const authActions = createAuthActions();

  const value: AuthContextType = {
    ...authState,
    ...authService,
    ...authActions,
  };

  console.log('AuthProvider rendering with user:', value.user?.id, 'loading:', value.loading);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
