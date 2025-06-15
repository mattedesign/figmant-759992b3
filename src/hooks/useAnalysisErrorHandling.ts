
import { useState, useMemo, useCallback } from 'react';

export const useAnalysisErrorHandling = () => {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((newError: Error) => {
    setError(newError);
  }, []);

  const combinedError = useMemo(() => {
    return error;
  }, [error]);

  return {
    error: combinedError,
    setError,
    clearError,
    handleError
  };
};
