
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TestTube, Send, Globe, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ChatAttachment } from '../../DesignChatInterface';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ClaudeTestingSection: React.FC = () => {
  const [testMessage, setTestMessage] = React.useState('Analyze this design for usability and conversion optimization opportunities.');
  const [testUrl, setTestUrl] = React.useState('');
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [isTestingSimple, setIsTestingSimple] = React.useState(false);
  const [isTestingWithUrl, setIsTestingWithUrl] = React.useState(false);
  
  const { analyzeWithChat } = useChatAnalysis();
  const { toast } = useToast();

  const runSimpleTest = async () => {
    setIsTestingSimple(true);
    
    try {
      console.log('=== STARTING SIMPLE CLAUDE TEST ===');
      
      const result = await analyzeWithChat.mutateAsync({
        message: testMessage,
        attachments: []
      });

      const testResult = {
        type: 'Simple Text Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        response: result.analysis,
        responseLength: result.analysis.length,
        debugInfo: result.debugInfo || {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
      toast({
        title: "Simple Test Completed",
        description: "Claude AI responded successfully to text-only request.",
      });
      
      console.log('Simple test completed successfully:', testResult);
    } catch (error) {
      console.error('Simple test failed:', error);
      
      const testResult = {
        type: 'Simple Text Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
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

      const testResult = {
        type: 'URL Test',
        timestamp: new Date().toISOString(),
        success: true,
        message: testMessage,
        url: testUrl,
        response: result.analysis,
        responseLength: result.analysis.length,
        debugInfo: result.debugInfo || {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
      toast({
        title: "URL Test Completed",
        description: "Claude AI analyzed the URL successfully.",
      });
      
      console.log('URL test completed successfully:', testResult);
    } catch (error) {
      console.error('URL test failed:', error);
      
      const testResult = {
        type: 'URL Test',
        timestamp: new Date().toISOString(),
        success: false,
        message: testMessage,
        url: testUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: {}
      };

      setTestResults(prev => [testResult, ...prev]);
      
      toast({
        variant: "destructive",
        title: "URL Test Failed",
        description: error instanceof Error ? error.message : 'Test failed with unknown error',
      });
    } finally {
      setIsTestingWithUrl(false);
    }
  };

  const testClaudeConnection = async () => {
    try {
      console.log('=== TESTING CLAUDE CONNECTION ===');
      
      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          message: 'Hello, this is a connection test. Please respond with "Connection successful" if you receive this.',
          attachments: [],
          uploadIds: []
        }
      });

      console.log('Claude connection test response:', { data, error });

      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }

      if (data?.success) {
        toast({
          title: "Connection Test Passed",
          description: "Claude AI edge function is responding correctly.",
        });
      } else {
        throw new Error(data?.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Claude connection test failed:', error);
      toast({
        variant: "destructive",
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : 'Connection test failed',
      });
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    toast({
      title: "Test Results Cleared",
      description: "All test results have been removed.",
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
        <TestTube className="h-4 w-4" />
        Claude AI Integration Tests
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
            variant="outline"
          >
            <TestTube className="h-3 w-3 mr-1" />
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

        {/* Clear Results */}
        {testResults.length > 0 && (
          <Button
            size="sm"
            onClick={clearTestResults}
            variant="outline"
            className="text-xs"
          >
            Clear Results
          </Button>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
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
                </div>
              </div>
              
              {result.url && (
                <div className="mb-2">
                  <span className="font-medium">URL:</span> {result.url}
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
                </div>
              ) : (
                <div className="text-red-600">
                  <span className="font-medium">Error:</span> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
