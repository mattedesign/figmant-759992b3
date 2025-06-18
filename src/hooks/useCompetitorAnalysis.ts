import { useState, useCallback } from 'react';
import { URLValidationService, URLValidationResult } from '@/services/urlValidationService';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';
import { ScreenshotResult, ScreenshotCaptureOptions } from '@/services/screenshot/types';
import { useToast } from '@/hooks/use-toast';

export interface CompetitorAnalysisData {
  url: string;
  validation: URLValidationResult;
  screenshots?: {
    desktop?: ScreenshotResult;
    mobile?: ScreenshotResult;
  };
  status: 'pending' | 'validating' | 'capturing' | 'completed' | 'failed';
  error?: string;
}

export const useCompetitorAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<CompetitorAnalysisData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateURL = useCallback(async (url: string): Promise<URLValidationResult> => {
    return URLValidationService.validateURL(url);
  }, []);

  const captureScreenshots = useCallback(async (
    url: string,
    options?: ScreenshotCaptureOptions
  ): Promise<{ desktop?: ScreenshotResult; mobile?: ScreenshotResult }> => {
    const results = await ScreenshotCaptureService.captureCompetitorSet([url], true, true);
    
    return {
      desktop: results.desktop?.[0],
      mobile: results.mobile?.[0]
    };
  }, []);

  const analyzeCompetitor = useCallback(async (url: string): Promise<CompetitorAnalysisData> => {
    const analysisItem: CompetitorAnalysisData = {
      url,
      validation: { isValid: false, url, hostname: '' },
      status: 'pending'
    };

    try {
      // Update status to validating
      analysisItem.status = 'validating';
      setAnalysisData(prev => [...prev.filter(item => item.url !== url), analysisItem]);

      // Validate URL
      const validation = await validateURL(url);
      analysisItem.validation = validation;

      if (!validation.isValid) {
        analysisItem.status = 'failed';
        analysisItem.error = validation.error;
        return analysisItem;
      }

      // Update status to capturing
      analysisItem.status = 'capturing';
      setAnalysisData(prev => [...prev.filter(item => item.url !== url), analysisItem]);

      // Capture screenshots
      const screenshots = await captureScreenshots(url);
      analysisItem.screenshots = screenshots;
      
      // Check if both screenshots were successful
      const desktopSuccess = screenshots.desktop?.success !== false;
      const mobileSuccess = screenshots.mobile?.success !== false;
      
      if (desktopSuccess && mobileSuccess) {
        analysisItem.status = 'completed';
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${validation.hostname}`,
        });
      } else {
        analysisItem.status = 'failed';
        analysisItem.error = 'Screenshot capture failed';
        toast({
          variant: "destructive",
          title: "Partial Failure",
          description: `Analysis completed with errors for ${validation.hostname}`,
        });
      }

    } catch (error) {
      analysisItem.status = 'failed';
      analysisItem.error = error instanceof Error ? error.message : 'Analysis failed';
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: `Failed to analyze ${analysisItem.validation.hostname || url}`,
      });
    }

    return analysisItem;
  }, [validateURL, captureScreenshots, toast]);

  const analyzeMultipleCompetitors = useCallback(async (urls: string[]) => {
    setIsProcessing(true);
    
    try {
      const analysisPromises = urls.map(url => analyzeCompetitor(url));
      const results = await Promise.all(analysisPromises);
      
      setAnalysisData(results);
      
      const successCount = results.filter(r => r.status === 'completed').length;
      
      toast({
        title: "Batch Analysis Complete",
        description: `Successfully analyzed ${successCount}/${urls.length} competitors`,
      });
      
      return results;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Batch Analysis Failed",
        description: "Failed to complete competitor analysis",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeCompetitor, toast]);

  const clearAnalysis = useCallback(() => {
    setAnalysisData([]);
  }, []);

  const removeCompetitor = useCallback((url: string) => {
    setAnalysisData(prev => prev.filter(item => item.url !== url));
  }, []);

  return {
    analysisData,
    isProcessing,
    validateURL,
    captureScreenshots,
    analyzeCompetitor,
    analyzeMultipleCompetitors,
    clearAnalysis,
    removeCompetitor
  };
};
