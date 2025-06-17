
import { useState, useEffect } from 'react';
import { DribbbleService, DribbbleShot } from '@/services/dribbbleService';

export const useDribbbleShots = (shouldFetch: boolean = true) => {
  const [shots, setShots] = useState<DribbbleShot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchShots = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const dribbbleShots = await DribbbleService.getPopularProductDesignShots(12);
        setShots(dribbbleShots);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch design inspiration');
        console.error('Error fetching Dribbble shots:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShots();
  }, [shouldFetch]);

  return { shots, isLoading, error };
};
