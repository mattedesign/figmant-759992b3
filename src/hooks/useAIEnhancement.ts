
import { useState, useCallback } from 'react';
import { MultiAIAnalyzer } from '@/lib/ai-orchestrator/MultiAIAnalyzer';
import { EnhancedAnalysisResult, EnhancementSettings } from '@/types/ai-enhancement';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAIEnhancement = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<EnhancedAnalysisResult | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const enhanceAnalysis = useCallback(async (originalAnalysis: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI enhancements.",
        variant: "destructive"
      });
      return null;
    }

    setIsEnhancing(true);
    console.log('🚀 AI ENHANCEMENT - Starting enhancement process for analysis');

    try {
      // Get enhancement settings
      const settings = await MultiAIAnalyzer.getEnhancementSettings(user.id);
      
      if (!settings) {
        console.log('🚀 No enhancement settings found, skipping enhancement');
        setIsEnhancing(false);
        return null;
      }

      // Check if any services are enabled
      const hasEnabledServices = settings.googleVision.enabled || 
                                settings.openaiVision.enabled || 
                                settings.amazonRekognition.enabled || 
                                settings.microsoftFormRecognizer.enabled;

      if (!hasEnabledServices) {
        console.log('🚀 No AI services enabled, skipping enhancement');
        setIsEnhancing(false);
        return null;
      }

      console.log('🚀 Enhancement settings loaded:', {
        tier: settings.tier,
        enabledServices: {
          googleVision: settings.googleVision.enabled,
          openaiVision: settings.openaiVision.enabled,
          amazonRekognition: settings.amazonRekognition.enabled,
          microsoftFormRecognizer: settings.microsoftFormRecognizer.enabled
        }
      });

      // Create analyzer and enhance analysis
      const analyzer = new MultiAIAnalyzer(settings, originalAnalysis);
      const result = await analyzer.enhanceAnalysis();

      setEnhancementResult(result);
      
      toast({
        title: "Analysis Enhanced",
        description: `Added insights from ${result.enhancementMetadata.servicesUsed.length} AI services using ${result.enhancementMetadata.totalAdditionalCredits} credits.`
      });

      console.log('🚀 AI ENHANCEMENT - Enhancement completed successfully');
      return result;

    } catch (error) {
      console.error('🚀 AI ENHANCEMENT - Enhancement failed:', error);
      toast({
        title: "Enhancement Failed", 
        description: "Failed to enhance analysis with additional AI services.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsEnhancing(false);
    }
  }, [user, toast]);

  const clearEnhancement = useCallback(() => {
    setEnhancementResult(null);
  }, []);

  return {
    isEnhancing,
    enhancementResult,
    enhanceAnalysis,
    clearEnhancement
  };
};
