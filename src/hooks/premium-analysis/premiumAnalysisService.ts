
import { supabase } from '@/integrations/supabase/client';
import { PremiumAnalysisRequest, PremiumAnalysisResult, AnalysisResults } from './types';
import { buildContextPrompt } from './contextPromptBuilder';
import { FileUploadService } from './fileUploadService';
import { AccessValidationService } from './accessValidationService';

export class PremiumAnalysisService {
  async executeAnalysis(request: PremiumAnalysisRequest): Promise<PremiumAnalysisResult> {
    const { stepData, selectedPrompt } = request;
    
    console.log('🔍 PREMIUM ANALYSIS SERVICE - Starting analysis execution...');
    console.log('🔍 Step data:', {
      projectName: stepData.projectName,
      selectedType: stepData.selectedType,
      uploadedFilesCount: stepData.uploadedFiles?.length || 0
    });
    console.log('🔍 Selected prompt:', {
      id: selectedPrompt.id,
      title: selectedPrompt.title,
      category: selectedPrompt.category
    });

    // Get current user
    console.log('🔍 Getting current user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('🔍 Auth error:', authError);
      throw new Error('User not authenticated');
    }
    console.log('🔍 User authenticated:', user.id);

    // Upload files if any exist
    let uploadedFileAttachments: any[] = [];
    if (stepData.uploadedFiles && stepData.uploadedFiles.length > 0) {
      console.log('🔍 Uploading files to storage...');
      try {
        uploadedFileAttachments = await FileUploadService.uploadMultipleFiles(stepData.uploadedFiles);
        console.log('🔍 Files uploaded successfully:', uploadedFileAttachments.length);
      } catch (error) {
        console.error('🔍 File upload error:', error);
        throw new Error(`Failed to upload files: ${error.message}`);
      }
    }

    // Build comprehensive prompt based on selected premium prompt and user data
    console.log('🔍 Building context prompt...');
    const contextPrompt = buildContextPrompt(stepData, selectedPrompt);
    console.log('🔍 Context prompt length:', contextPrompt.length);

    // Call Claude AI function with corrected parameters (matching working chat analysis pattern)
    console.log('🔍 Calling Claude AI function with corrected parameters...');
    const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        message: contextPrompt,
        // ✅ FIX: Remove requestType parameter that was causing fallback to mock data
        // ✅ FIX: Use same attachment format as working chat analysis
        attachments: uploadedFileAttachments.map(file => ({
          id: file.name,
          type: 'file',
          name: file.name,
          uploadPath: file.path
        }))
      }
    });

    if (claudeError) {
      console.error('🔍 Claude AI error:', claudeError);
      throw new Error(`Premium analysis failed: ${claudeError.message}`);
    }

    console.log('🔍 Claude AI response received:', {
      hasResponse: !!claudeResponse,
      hasAnalysis: !!(claudeResponse?.analysis || claudeResponse?.response),
      responseLength: (claudeResponse?.analysis || claudeResponse?.response || '').length
    });

    // Save the analysis and return result
    const savedAnalysisId = await this.saveAnalysisToDatabase(
      user.id,
      contextPrompt,
      selectedPrompt,
      stepData,
      claudeResponse,
      uploadedFileAttachments
    );

    const finalResult: PremiumAnalysisResult = {
      analysis: claudeResponse.analysis || claudeResponse.response,
      savedAnalysisId,
      debugInfo: claudeResponse.debugInfo
    };

    console.log('🔍 Returning final result:', {
      hasAnalysis: !!finalResult.analysis,
      analysisLength: finalResult.analysis?.length || 0,
      savedAnalysisId: finalResult.savedAnalysisId
    });

    return finalResult;
  }

  private async saveAnalysisToDatabase(
    userId: string,
    contextPrompt: string,
    selectedPrompt: any,
    stepData: any,
    claudeResponse: any,
    uploadedFiles: any[]
  ): Promise<string> {
    console.log('🔍 Preparing analysis results for database...');
    
    // Get actual credit cost used
    const accessValidationService = new AccessValidationService();
    const creditCost = await accessValidationService.getPromptCreditCost(selectedPrompt.id);
    
    const analysisResults: AnalysisResults = {
      response: claudeResponse.analysis || claudeResponse.response,
      premium_analysis_data: JSON.parse(JSON.stringify(stepData)), // Ensure proper JSON serialization
      selected_prompt_id: selectedPrompt.id,
      selected_prompt_category: selectedPrompt.category,
      project_name: stepData.projectName,
      analysis_goals: stepData.analysisGoals,
      desired_outcome: stepData.desiredOutcome,
      files_uploaded: uploadedFiles.length,
      reference_links: stepData.referenceLinks.filter(link => link.trim()).length,
      uploaded_file_paths: uploadedFiles.map(f => f.path), // Include actual file paths
      // Store premium analysis metadata within analysis_results instead of separate metadata column
      is_premium: true,
      premium_type: selectedPrompt.category,
      credits_used: creditCost // Use dynamic credit cost instead of hardcoded 5
    };

    // Convert AnalysisResults to a plain object that Supabase can accept as Json
    const analysisResultsJson = JSON.parse(JSON.stringify(analysisResults));

    // Save the premium analysis to chat history with proper labeling
    console.log('🔍 Saving analysis to chat history...');
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('chat_analysis_history')
      .insert({
        user_id: userId,
        prompt_used: contextPrompt,
        prompt_template_used: selectedPrompt.original_prompt,
        analysis_results: analysisResultsJson,
        confidence_score: claudeResponse.confidence_score || 0.9,
        analysis_type: 'premium_analysis' // Clear labeling for premium analysis
      })
      .select()
      .single();

    if (saveError) {
      console.error('🔍 Error saving premium analysis:', saveError);
      throw saveError;
    }

    console.log('🔍 Premium analysis saved successfully with ID:', savedAnalysis.id);
    return savedAnalysis.id;
  }
}
