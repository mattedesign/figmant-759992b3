
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TestTube, Send, Globe, CheckCircle, XCircle, Loader2, Image, AlertTriangle, Activity } from 'lucide-react';
import { ChatAttachment } from '../../DesignChatInterface';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { useLogUserActivity } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';

export const ClaudeTestingSection: React.FC = () => {
  const [testMessage, setTestMessage] = React.useState('Analyze this design for usability and conversion optimization opportunities.');
  const [testUrl, setTestUrl] = React.useState('');
  const [testFile, setTestFile] = React.useState<File | null>(null);
  const [testResults, setTestResults] = React.useState<any[]>([]);
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

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics
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

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics for failure
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

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics
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

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics for failure
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
      console.log('=== STARTING FILE CLAUDE TEST ===');
      
      // First upload the file
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = testFile.name.split('.').pop();
      const fileName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading test file:', { fileName, filePath, fileSize: testFile.size });

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, testFile);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const fileAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'file',
        name: testFile.name,
        file: testFile,
        uploadPath: filePath,
        status: 'uploaded'
      };

      const result = await analyzeWithChat.mutateAsync({
        message: testMessage,
        attachments: [fileAttachment]
      });

      const responseTime = Date.now() - startTime;
      const testResult = {
        type: 'File Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        fileName: testFile.name,
        fileSize: testFile.size,
        response: result.analysis,
        responseLength: result.analysis.length,
        responseTime,
        debugInfo: result.debugInfo || {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics
      await logTestActivity('file_test', true, {
        file_name: testFile.name,
        file_size: testFile.size,
        file_type: testFile.type,
        response_length: result.analysis.length,
        response_time_ms: responseTime
      });

      await logClaudeUsage('file_analysis_test', true, responseTime, {
        tokensUsed: result.debugInfo?.tokensUsed,
        cost: result.debugInfo?.cost,
        requestData: { 
          message: testMessage, 
          file_name: testFile.name,
          file_size: testFile.size,
          file_type: testFile.type
        },
        responseData: { analysis: result.analysis.substring(0, 500) }
      });
      
      toast({
        title: "File Test Completed",
        description: "Claude AI analyzed the file successfully.",
      });
      
      console.log('File test completed successfully:', testResult);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('File test failed:', error);
      
      const testResult = {
        type: 'File Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        fileName: testFile?.name,
        fileSize: testFile?.size,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics for failure
      await logTestActivity('file_test', false, {
        file_name: testFile?.name,
        file_size: testFile?.size,
        file_type: testFile?.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: responseTime
      });

      await logClaudeUsage('file_analysis_test', false, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestData: { 
          message: testMessage,
          file_name: testFile?.name,
          file_size: testFile?.size
        }
      });
      
      toast({
        variant: "destructive",
        title: "File Test Failed",
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

        setTestResults(prev => [testResult, ...prev]);
        
        // Log analytics
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

      setTestResults(prev => [testResult, ...prev]);
      
      // Log analytics for failure
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

  const clearTestResults = () => {
    setTestResults([]);
    toast({
      title: "Test Results Cleared",
      description: "All test results have been removed.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (!isImage && !isPdf) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select an image (PNG, JPG, etc.) or PDF file.",
        });
        return;
      }
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select a file smaller than 50MB.",
        });
        return;
      }
      
      setTestFile(file);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
        <TestTube className="h-4 w-4" />
        Claude AI Integration Tests
        <Activity className="h-3 w-3 text-blue-500" title="Analytics Enabled" />
      </h4>
      
      {/* Test Message Input */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Test Message:</label>
          <Textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a message to test Claude AI..."
            className="mt-1 text-sm"
            rows={2}
          />
        </div>

        {/* Test Buttons */}
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
        </div>

        {/* URL Test Section */}
        <div className="border-t pt-3 mt-3">
          <label className="text-xs font-medium text-gray-600">URL Test:</label>
          <div className="flex gap-2 mt-1">
            <Input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-sm"
            />
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
          </div>
        </div>

        {/* File Test Section */}
        <div className="border-t pt-3 mt-3">
          <label className="text-xs font-medium text-gray-600">File Test:</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="text-sm"
            />
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
              Test File
            </Button>
          </div>
          {testFile && (
            <div className="mt-2 text-xs text-gray-600">
              Selected: {testFile.name} ({(testFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Clear Results */}
        {testResults.length > 0 && (
          <Button
            size="sm"
            onClick={clearTestResults}
            variant="outline"
            className="text-xs"
          >
            Clear Results ({testResults.length})
          </Button>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
          <h5 className="text-xs font-medium text-gray-600">Test Results:</h5>
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-50 rounded border p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={result.success ? 'default' : 'destructive'} className="text-xs">
                    {result.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    {result.type}
                  </Badge>
                  <span className="text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  {result.responseTime && (
                    <span className="text-blue-600 text-xs">
                      {result.responseTime}ms
                    </span>
                  )}
                </div>
              </div>
              
              {result.url && (
                <div className="mb-2">
                  <span className="font-medium">URL:</span> {result.url}
                </div>
              )}
              
              {result.fileName && (
                <div className="mb-2">
                  <span className="font-medium">File:</span> {result.fileName} 
                  {result.fileSize && <span className="text-gray-500"> ({(result.fileSize / 1024 / 1024).toFixed(2)} MB)</span>}
                </div>
              )}
              
              <div className="mb-2">
                <span className="font-medium">Message:</span> {result.message}
              </div>
              
              {result.success ? (
                <div>
                  <span className="font-medium">Response Length:</span> {result.responseLength} chars
                  <div className="mt-1 p-2 bg-white rounded border max-h-20 overflow-y-auto">
                    {result.response.substring(0, 200)}...
                  </div>
                  {result.debugInfo && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border">
                      <div className="font-medium text-blue-800 mb-1">Debug Info:</div>
                      <div className="text-blue-700 text-xs">
                        Images Processed: {result.debugInfo.imagesProcessed || 0} | 
                        Tokens Used: {result.debugInfo.tokensUsed || 0} | 
                        Response Time: {result.responseTime || 0}ms
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-600">
                  <span className="font-medium">Error:</span> {result.error}
                  {result.error?.includes('Maximum call stack') && (
                    <div className="mt-1 p-2 bg-red-50 rounded border">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      <span className="text-xs">This error indicates a problem with the image download function. The fix has been implemented.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
