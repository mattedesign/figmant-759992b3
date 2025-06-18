
import { useState, useCallback } from 'react';

export const useDebugLogger = () => {
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🔍 PREMIUM ANALYSIS DEBUG:', logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  }, []);

  const clearDebugLogs = useCallback(() => {
    setDebugLogs([]);
  }, []);

  const addRetryMarker = useCallback(() => {
    setDebugLogs(prev => [...prev, '--- RETRY ATTEMPT ---']);
  }, []);

  return { debugLogs, addDebugLog, clearDebugLogs, addRetryMarker };
};
