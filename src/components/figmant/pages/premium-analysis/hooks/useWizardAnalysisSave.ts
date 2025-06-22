
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';

interface WizardAnalysisData {
  stepData: any;
  analysisResults: any;
  structuredAnalysis?: ContextualAnalysisResult;
  confidenceScore?: number;
}

// Helper function to safely serialize data for JSON storage
const serializeForJson = (data: any): any => {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeForJson(item));
  }
  
  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeForJson(value);
    }
    return serialized;
  }
  
  return data;
};

// Enhanced function to create file-recommendation associations
const createFileRecommendationAssociations = (
  structuredAnalysis: ContextualAnalysisResult | undefined,
  uploadedFiles: File[]
): { [fileName: string]: string[] } => {
  if (!structuredAnalysis || !uploadedFiles.length) {
    return {};
  }

  const associations: { [fileName: string]: string[] } = {};
  
  // Create mapping from attachment IDs to file names
  const attachmentToFileName: { [attachmentId: string]: string } = {};
  structuredAnalysis.attachments.forEach(attachment => {
    const matchingFile = uploadedFiles.find(file => file.name === attachment.name);
    if (matchingFile) {
      attachmentToFileName[attachment.id] = matchingFile.name;
    }
  });

  // Build associations between files and recommendations
  structuredAnalysis.recommendations.forEach(rec => {
    rec.relatedAttachmentIds.forEach(attachmentId => {
      const fileName = attachmentToFileName[attachmentId];
      if (fileName) {
        if (!associations[fileName]) {
          associations[fileName] = [];
        }
        associations[fileName].push(rec.id);
      }
    });
  });

  return associations;
};

export const useWizardAnalysisSave = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: WizardAnalysisData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('💾 WIZARD ANALYSIS SAVE - Starting save process...');
      console.log('💾 Data to save:', {
        hasStepData: !!data.stepData,
        hasAnalysisResults: !!data.analysisResults,
        hasStructuredAnalysis: !!data.structuredAnalysis,
        confidenceScore: data.confidenceScore
      });

      // Safely serialize the structured analysis to ensure JSON compatibility
      const serializedStructuredAnalysis = data.structuredAnalysis ? 
        serializeForJson(data.structuredAnalysis) : null;

      // Safely serialize the metrics to ensure JSON compatibility
      const serializedMetrics = data.structuredAnalysis?.metrics ? 
        serializeForJson(data.structuredAnalysis.metrics) : null;

      // Create file-recommendation associations
      const fileRecommendationAssociations = createFileRecommendationAssociations(
        data.structuredAnalysis,
        data.stepData?.uploadedFiles || []
      );

      // Calculate enhanced file association metrics
      const fileAssociationMetrics = {
        totalFiles: data.stepData?.uploadedFiles?.length || 0,
        filesWithRecommendations: Object.keys(fileRecommendationAssociations).length,
        totalFileRecommendationLinks: Object.values(fileRecommendationAssociations)
          .reduce((sum, recommendations) => sum + recommendations.length, 0),
        averageRecommendationsPerFile: Object.keys(fileRecommendationAssociations).length > 0 ?
          Object.values(fileRecommendationAssociations)
            .reduce((sum, recommendations) => sum + recommendations.length, 0) / 
          Object.keys(fileRecommendationAssociations).length : 0
      };

      const analysisData = {
        user_id: user.id,
        analysis_type: 'wizard',
        prompt_used: 'Premium Analysis Wizard',
        prompt_template_used: data.stepData?.selectedType || 'wizard_template',
        analysis_results: {
          response: data.analysisResults?.analysis || 'Wizard analysis completed',
          structured_analysis: serializedStructuredAnalysis,
          wizard_data: serializeForJson(data.stepData),
          attachments_processed: data.stepData?.uploadedFiles?.length || 0,
          template_info: {
            id: data.stepData?.selectedType,
            category: data.stepData?.templateData?.category || 'analysis'
          },
          recommendations_count: data.structuredAnalysis?.recommendations?.length || 0,
          metrics: serializedMetrics,
          file_associations: {
            associations: fileRecommendationAssociations,
            metrics: fileAssociationMetrics
          },
          file_paths: data.stepData?.uploadedFiles?.map((file: File, index: number) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadIndex: index,
            associatedRecommendations: fileRecommendationAssociations[file.name] || []
          })) || [],
          debug_info: {
            wizard_steps: Object.keys(data.stepData || {}),
            completion_timestamp: new Date().toISOString(),
            has_structured_data: !!data.structuredAnalysis,
            file_association_success: Object.keys(fileRecommendationAssociations).length > 0
          }
        },
        confidence_score: data.confidenceScore || (data.structuredAnalysis?.metrics?.averageConfidence ? data.structuredAnalysis.metrics.averageConfidence / 100 : 0.85)
      };

      console.log('💾 Prepared analysis data:', {
        userId: analysisData.user_id,
        analysisType: analysisData.analysis_type,
        templateUsed: analysisData.prompt_template_used,
        recommendationsCount: analysisData.analysis_results.recommendations_count,
        filesProcessed: analysisData.analysis_results.attachments_processed,
        fileAssociations: Object.keys(fileRecommendationAssociations).length,
        confidenceScore: analysisData.confidence_score
      });

      const { data: result, error } = await supabase
        .from('chat_analysis_history')
        .insert([analysisData])
        .select()
        .single();

      if (error) {
        console.error('💾 Error saving wizard analysis:', error);
        throw error;
      }

      console.log('💾 Wizard analysis saved successfully:', {
        savedId: result.id,
        fileAssociationsCreated: Object.keys(fileRecommendationAssociations).length
      });

      return result;
    },
    onSuccess: (result) => {
      console.log('💾 Save mutation completed successfully:', result.id);
    },
    onError: (error) => {
      console.error('💾 Save mutation failed:', error);
    }
  });
};
