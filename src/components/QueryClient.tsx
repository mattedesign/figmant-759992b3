
import React from 'react';
import { QueryClient as TanStackQueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const QueryClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
