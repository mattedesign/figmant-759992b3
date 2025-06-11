import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube, Send, Globe, Image, Loader2 } from 'lucide-react';
import { ChatAttachment } from '../../DesignChatInterface';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { useLogUserActivity } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { ImageProcessor, validateImageFile, ProcessedImage } from '@/utils/imageProcessing';

interface TestRunnerProps {
  testMessage: string;
  testUrl: string;
  testFile: File | null;
  onTestResult: (result: any) => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  testMessage,
  testUrl,
  testFile,
  onTestResult
}) => {
  const [isTestingSimple, setIsTestingSimple] = React.useState(false);
  const [isTestingWithUrl, setIsTestingWithUrl] = React.useState(false);
  const [isTestingWithFile, setIsTestingWithFile] = React.useState(false);
  const [isTestingConnection, setIsTestingConnection] = React.useState(false);
  
  const { analyzeWithChat } = useChatAnalysis();
  const { toast } = useToast();
  const logUserActivity = useLogUserActivity();

  const logTestActivity = async (testType: string, success: boolean, metadata: any = {}) => {
    try {
      await logUserActivity.mutateAsync({
        activity_type: 'claude_test',
        page_path: '/design-analysis',
        metadata: {
          test_type: testType,
          success,
          ...metadata
        }
      });
    } catch (error) {
      console.warn('Failed to log test activity:', error);
    }
  };

  const logClaudeUsage = async (requestType: string, success: boolean, responseTime: number, metadata: any = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('claude_usage_logs').insert({
        user_id: user.id,
        request_type: requestType,
        success,
        response_time_ms: responseTime,
        tokens_used: metadata.tokensUsed || 0,
        cost_usd: metadata.cost || 0,
        model_used: metadata.model || 'claude-sonnet-4-20250514',
        request_data: metadata.requestData || {},
        response_data: metadata.responseData || {},
        error_message: success ? null : metadata.error
      });
    } catch (error) {
      console.warn('Failed to log Claude usage:', error);
    }
  };

  const processFileForTesting = async (file: File): Promise<{ file: File; processingInfo: ProcessedImage | null }> => {
    try {
      console.log('=== PROCESSING FILE FOR TESTING ===');
      console.log('Original file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid file');
      }

      // Only process if it's an image and needs compression
      if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
        console.log('Image is large, processing...');
        
        const processed = await ImageProcessor.processImage(file, {
          maxWidth: 1600,
          maxHeight: 1200,
          quality: 0.8,
          targetFormat: 'jpeg'
        });

        console.log('Image processed successfully:', {
          originalSize: processed.originalSize,
          processedSize: processed.processedSize,
          compressionRatio: processed.compressionRatio,
          dimensions: processed.dimensions
        });

        return { file: processed.file, processingInfo: processed };
      }

      console.log('File does not need processing, using original');
      return { file, processingInfo: null };

    } catch (error) {
      console.error('File processing failed:', error);
      throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const runSimpleTest = async () => {
    setIsTestingSimple(true);
    const startTime = Date.now();
    
    try {
      console.log('=== STARTING SIMPLE CLAUDE TEST ===');
      
      const result = await analyzeWithChat.mutateAsync({
        message: testMessage,
        attachments: []
      });

      const responseTime = Date.now() - startTime;
      const testResult = {
        type: 'Simple Text Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        response: result.analysis,
        responseLength: result.analysis.length,
        responseTime,
        debugInfo: result.debugInfo || {}
      };

      onTestResult(testResult);
      
      await logTestActivity('simple_text', true, {
        response_length: result.analysis.length,
        response_time_ms: responseTime,
        message_length: testMessage.length
      });

      await logClaudeUsage('simple_text_test', true, responseTime, {
        tokensUsed: result.debugInfo?.tokensUsed,
        cost: result.debugInfo?.cost,
        requestData: { message: testMessage },
        responseData: { analysis: result.analysis.substring(0, 500) }
      });
      
      toast({
        title: "Simple Test Completed",
        description: "Claude AI responded successfully to text-only request.",
      });
      
      console.log('Simple test completed successfully:', testResult);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('Simple test failed:', error);
      
      const testResult = {
        type: 'Simple Text Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      onTestResult(testResult);
      
      await logTestActivity('simple_text', false, {
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime
      });

      await logClaudeUsage('simple_text_test', false, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestData: { message: testMessage }
      });
      
      toast({
        variant: "destructive",
        title: "Simple Test Failed",
        description: error instanceof Error ? error.message : 'Test failed with unknown error',
      });
    } finally {
      setIsTestingSimple(false);
    }
  };

  const runUrlTest = async () => {
    if (!testUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a URL to test.",
      });
      return;
    }

    setIsTestingWithUrl(true);
    const startTime = Date.now();
    
    try {
      console.log('=== STARTING URL CLAUDE TEST ===');
      
      const urlAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: new URL(testUrl).hostname,
        url: testUrl.trim(),
        status: 'uploaded'
      };

      const result = await analyzeWithChat.mutateAsync({
        message: testMessage,
        attachments: [urlAttachment]
      });

      const responseTime = Date.now() - startTime;
      const testResult = {
        type: 'URL Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        url: testUrl,
        response: result.analysis,
        responseLength: result.analysis.length,
        responseTime,
        debugInfo: result.debugInfo || {}
      };

      onTestResult(testResult);
      
      await logTestActivity('url_test', true, {
        url: testUrl,
        response_length: result.analysis.length,
        response_time_ms: responseTime
      });

      await logClaudeUsage('url_analysis_test', true, responseTime, {
        tokensUsed: result.debugInfo?.tokensUsed,
        cost: result.debugInfo?.cost,
        requestData: { message: testMessage, url: testUrl },
        responseData: { analysis: result.analysis.substring(0, 500) }
      });
      
      toast({
        title: "URL Test Completed",
        description: "Claude AI analyzed the URL successfully.",
      });
      
      console.log('URL test completed successfully:', testResult);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('URL test failed:', error);
      
      const testResult = {
        type: 'URL Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        url: testUrl,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      onTestResult(testResult);
      
      await logTestActivity('url_test', false, {
        url: testUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime
      });

      await logClaudeUsage('url_analysis_test', false, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestData: { message: testMessage, url: testUrl }
      });
      
      toast({
        variant: "destructive",
        title: "URL Test Failed",
        description: error instanceof Error ? error.message : 'Test failed with unknown error',
      });
    } finally {
      setIsTestingWithUrl(false);
    }
  };

  const runFileTest = async () => {
    if (!testFile) {
      toast({
        variant: "destructive",
        title: "File Required",
        description: "Please select a file to test.",
      });
      return;
    }

    setIsTestingWithFile(true);
    const startTime = Date.now();
    
    try {
      console.log('=== STARTING ENHANCED FILE CLAUDE TEST ===');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Process the file with enhanced error handling
      const { file: processedFile, processingInfo } = await processFileForTesting(testFile);

      const fileExt = processedFile.name.split('.').pop();
      const fileName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading processed file:', { 
        fileName, 
        filePath, 
        originalSize: testFile.size,
        processedSize: processedFile.size,
        wasProcessed: !!processingInfo
      });

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, processedFile);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const fileAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: processedFile.name,
        file: processedFile,
        uploadPath: filePath,
        status: 'uploaded'
      };

      const result = await analyzeWithChat.mutateAsync({
        message: testMessage,
        attachments: [fileAttachment]
      });

      const responseTime = Date.now() - startTime;
      const testResult = {
        type: 'Enhanced File Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        fileName: processedFile.name,
        fileSize: processedFile.size,
        originalFileSize: testFile.size,
        wasProcessed: !!processingInfo,
        compressionRatio: processingInfo?.compressionRatio || 0,
        response: result.analysis,
        responseLength: result.analysis.length,
        responseTime,
        debugInfo: result.debugInfo || {}
      };

      onTestResult(testResult);
      
      await logTestActivity('enhanced_file_test', true, {
        file_name: processedFile.name,
        file_size: processedFile.size,
        original_file_size: testFile.size,
        file_type: processedFile.type,
        was_processed: !!processingInfo,
        compression_ratio: processingInfo?.compressionRatio || 0,
        response_length: result.analysis.length,
        response_time_ms: responseTime
      });

      await logClaudeUsage('enhanced_file_analysis_test', true, responseTime, {
        tokensUsed: result.debugInfo?.tokensUsed,
        cost: result.debugInfo?.cost,
        requestData: { 
          message: testMessage, 
          file_name: processedFile.name,
          file_size: processedFile.size,
          file_type: processedFile.type,
          was_processed: !!processingInfo
        },
        responseData: { analysis: result.analysis.substring(0, 500) }
      });
      
      toast({
        title: "Enhanced File Test Completed",
        description: processingInfo 
          ? `File processed and analyzed successfully (${processingInfo.compressionRatio}% compression)`
          : "File analyzed successfully",
      });
      
      console.log('Enhanced file test completed successfully:', testResult);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('Enhanced file test failed:', error);
      
      const testResult = {
        type: 'Enhanced File Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        fileName: testFile?.name,
        fileSize: testFile?.size,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      onTestResult(testResult);
      
      await logTestActivity('enhanced_file_test', false, {
        file_name: testFile?.name,
        file_size: testFile?.size,
        file_type: testFile?.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime
      });

      await logClaudeUsage('enhanced_file_analysis_test', false, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestData: { 
          message: testMessage,
          file_name: testFile?.name,
          file_size: testFile?.size
        }
      });
      
      toast({
        variant: "destructive",
        title: "Enhanced File Test Failed",
        description: error instanceof Error ? error.message : 'Test failed with unknown error',
      });
    } finally {
      setIsTestingWithFile(false);
    }
  };

  const testClaudeConnection = async () => {
    setIsTestingConnection(true);
    const startTime = Date.now();
    
    try {
      console.log('=== TESTING CLAUDE CONNECTION ===');
      
      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          message: 'Hello, this is a connection test. Please respond with "Connection successful" if you receive this.',
          attachments: [],
          uploadIds: []
        }
      });

      const responseTime = Date.now() - startTime;
      console.log('Claude connection test response:', { data, error });

      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }

      if (data?.success) {
        const testResult = {
          type: 'Connection Test',
          timestamp: new Date().toISOString(),
          success: true,
          response: data.analysis,
          responseTime,
          debugInfo: data.debugInfo || {}
        };

        onTestResult(testResult);
        
        await logTestActivity('connection_test', true, {
          response_time_ms: responseTime
        });

        await logClaudeUsage('connection_test', true, responseTime, {
          tokensUsed: data.debugInfo?.tokensUsed,
          requestData: { test_type: 'connection' },
          responseData: { success: true }
        });
        
        toast({
          title: "Connection Test Passed",
          description: "Claude AI edge function is responding correctly.",
        });
      } else {
        throw new Error(data?.error || 'Connection test failed');
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('Claude connection test failed:', error);
      
      const testResult = {
        type: 'Connection Test',
        timestamp: new Date().toISOString(),
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      onTestResult(testResult);
      
      await logTestActivity('connection_test', false, {
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime
      });

      await logClaudeUsage('connection_test', false, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestData: { test_type: 'connection' }
      });
      
      toast({
        variant: "destructive",
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : 'Connection test failed',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={testClaudeConnection}
        disabled={isTestingConnection}
        variant="outline"
      >
        {isTestingConnection ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <TestTube className="h-3 w-3 mr-1" />
        )}
        Test Connection
      </Button>
      
      <Button
        size="sm"
        onClick={runSimpleTest}
        disabled={isTestingSimple}
        variant="outline"
      >
        {isTestingSimple ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Send className="h-3 w-3 mr-1" />
        )}
        Simple Text Test
      </Button>

      <Button
        size="sm"
        onClick={runUrlTest}
        disabled={isTestingWithUrl}
        variant="outline"
      >
        {isTestingWithUrl ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Globe className="h-3 w-3 mr-1" />
        )}
        Test URL
      </Button>

      <Button
        size="sm"
        onClick={runFileTest}
        disabled={isTestingWithFile || !testFile}
        variant="outline"
      >
        {isTestingWithFile ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Image className="h-3 w-3 mr-1" />
        )}
        Enhanced File Test
      </Button>
    </div>
  );
};
