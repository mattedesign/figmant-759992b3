
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useWizardState = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<any>({});
  const [historicalContext, setHistoricalContext] = useState<any>(null);

  // Load historical analysis context if provided
  useEffect(() => {
    if (location.state?.loadHistoricalAnalysis && location.state?.historicalData) {
      const historicalData = location.state.historicalData;
      setHistoricalContext(historicalData);
      
      // Pre-populate wizard with historical data if it's a design analysis
      if (historicalData.type === 'design') {
        setWizardData({
          analysisType: historicalData.analysisType,
          files: [], // Files would need to be reconstructed or referenced
          previousAnalysis: historicalData,
          title: `Continuation of: ${historicalData.title}`,
          description: `Building upon previous analysis with score ${historicalData.score}/10`
        });
      }
    }
  }, [location.state]);

  const updateWizardData = useCallback((key: string, value: any) => {
    setWizardData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(0);
    setWizardData({});
    setHistoricalContext(null);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    wizardData,
    setWizardData,
    updateWizardData,
    resetWizard,
    historicalContext
  };
};
