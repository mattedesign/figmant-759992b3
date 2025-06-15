
import { useMemo, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheEntry {
  data: any;
  timestamp: number;
  hash: string;
}

interface UseAdvancedAnalysisCacheProps {
  cacheKey: string;
  ttl?: number; // Time to live in milliseconds
}

export const useAdvancedAnalysisCache = ({ 
  cacheKey, 
  ttl = 300000 // 5 minutes default
}: UseAdvancedAnalysisCacheProps) => {
  const queryClient = useQueryClient();
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const generateHash = useCallback((data: any): string => {
    return JSON.stringify(data);
  }, []);

  const getCachedData = useCallback((key: string): any | null => {
    const entry = cacheRef.current.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, [ttl]);

  const setCachedData = useCallback((key: string, data: any): void => {
    const hash = generateHash(data);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      hash
    };
    cacheRef.current.set(key, entry);
  }, [generateHash]);

  const invalidateCache = useCallback((pattern?: string): void => {
    if (pattern) {
      const keys = Array.from(cacheRef.current.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          cacheRef.current.delete(key);
        }
      });
    } else {
      cacheRef.current.clear();
    }
    
    // Also invalidate React Query cache
    queryClient.invalidateQueries({ queryKey: [cacheKey] });
  }, [cacheKey, queryClient]);

  const getCacheStats = useCallback(() => {
    const entries = Array.from(cacheRef.current.entries());
    const totalEntries = entries.length;
    const expiredEntries = entries.filter(
      ([, entry]) => Date.now() - entry.timestamp > ttl
    ).length;

    return {
      totalEntries,
      expiredEntries,
      validEntries: totalEntries - expiredEntries,
      cacheHitRate: totalEntries > 0 ? ((totalEntries - expiredEntries) / totalEntries) * 100 : 0
    };
  }, [ttl]);

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    getCacheStats
  };
};
