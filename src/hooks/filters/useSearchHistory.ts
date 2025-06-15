
import { useState, useEffect } from 'react';

export const useSearchHistory = (searchTerm: string) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      
      // Add to search history if not empty and not already present
      if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
        setSearchHistory(prev => [searchTerm.trim(), ...prev.slice(0, 9)]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchHistory]);

  return {
    searchHistory,
    debouncedSearchTerm
  };
};
