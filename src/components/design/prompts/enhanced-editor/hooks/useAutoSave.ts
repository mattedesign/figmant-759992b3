
import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveProps {
  data: any;
  onSave: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({
  data,
  onSave,
  delay = 30000,
  enabled = true
}: UseAutoSaveProps) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedData = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't auto-save if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(lastSavedData.current)) {
      return;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (JSON.stringify(data) === JSON.stringify(lastSavedData.current)) {
        return;
      }

      setAutoSaveStatus('saving');
      try {
        await onSave(data);
        lastSavedData.current = data;
        setAutoSaveStatus('saved');
        
        // Reset to idle after 3 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      } catch (error) {
        setAutoSaveStatus('error');
        // Reset to idle after 5 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 5000);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setAutoSaveStatus('saving');
    try {
      await onSave(data);
      lastSavedData.current = data;
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 5000);
    }
  };

  return {
    autoSaveStatus,
    saveNow
  };
};
