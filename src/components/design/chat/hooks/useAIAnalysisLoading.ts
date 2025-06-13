
import { useState, useEffect } from 'react';

interface AIAnalysisLoadingState {
  isLoading: boolean;
  stage: 'sending' | 'processing' | 'analyzing' | 'generating' | null;
  progress: number;
  estimatedTimeRemaining: number | null;
  startTime: number | null;
}

export const useAIAnalysisLoading = () => {
  const [loadingState, setLoadingState] = useState<AIAnalysisLoadingState>({
    isLoading: false,
    stage: null,
    progress: 0,
    estimatedTimeRemaining: null,
    startTime: null
  });

  const startAnalysis = () => {
    const startTime = Date.now();
    setLoadingState({
      isLoading: true,
      stage: 'sending',
      progress: 0,
      estimatedTimeRemaining: 30, // Initial estimate: 30 seconds
      startTime
    });

    // Simulate progress through stages
    setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        stage: 'processing',
        progress: 25,
        estimatedTimeRemaining: 25
      }));
    }, 2000);

    setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        stage: 'analyzing',
        progress: 50,
        estimatedTimeRemaining: 15
      }));
    }, 5000);

    setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        stage: 'generating',
        progress: 75,
        estimatedTimeRemaining: 8
      }));
    }, 10000);
  };

  const completeAnalysis = () => {
    setLoadingState({
      isLoading: false,
      stage: null,
      progress: 100,
      estimatedTimeRemaining: null,
      startTime: null
    });
  };

  const resetAnalysis = () => {
    setLoadingState({
      isLoading: false,
      stage: null,
      progress: 0,
      estimatedTimeRemaining: null,
      startTime: null
    });
  };

  // Update estimated time based on actual progress
  useEffect(() => {
    if (loadingState.isLoading && loadingState.startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - loadingState.startTime!;
        const progressRate = loadingState.progress / elapsed;
        const remaining = progressRate > 0 ? (100 - loadingState.progress) / progressRate : null;
        
        setLoadingState(prev => ({
          ...prev,
          estimatedTimeRemaining: remaining ? Math.ceil(remaining / 1000) : null
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loadingState.isLoading, loadingState.startTime, loadingState.progress]);

  const getStageMessage = () => {
    switch (loadingState.stage) {
      case 'sending':
        return 'Sending your message...';
      case 'processing':
        return 'Processing attachments...';
      case 'analyzing':
        return 'Analyzing your designs...';
      case 'generating':
        return 'Generating insights...';
      default:
        return 'Processing...';
    }
  };

  return {
    loadingState,
    startAnalysis,
    completeAnalysis,
    resetAnalysis,
    getStageMessage
  };
};
