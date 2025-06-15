
import { useMemo, useCallback } from 'react';
import { AdvancedFilters, QuickFilters } from './types';

export const useQuickFilters = (updateFilter: (key: keyof AdvancedFilters, value: any) => void): QuickFilters => {
  const today = useCallback(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateFilter('dateRange', { from: todayDate, to: tomorrow });
  }, [updateFilter]);

  const thisWeek = useCallback(() => {
    const todayDate = new Date();
    const weekStart = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    updateFilter('dateRange', { from: weekStart, to: weekEnd });
  }, [updateFilter]);

  const thisMonth = useCallback(() => {
    const todayDate = new Date();
    const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    const monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);
    updateFilter('dateRange', { from: monthStart, to: monthEnd });
  }, [updateFilter]);

  const highConfidence = useCallback(() => {
    updateFilter('confidenceRange', [80, 100]);
  }, [updateFilter]);

  const lowConfidence = useCallback(() => {
    updateFilter('confidenceRange', [0, 50]);
  }, [updateFilter]);

  return useMemo(() => ({
    today,
    thisWeek,
    thisMonth,
    highConfidence,
    lowConfidence
  }), [today, thisWeek, thisMonth, highConfidence, lowConfidence]);
};
