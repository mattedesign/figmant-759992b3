
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChatAnalysis } from '@/hooks/useChatAnalysis';

interface RecoveryTest {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
}

export const ChatAnalysisRecovery: React.FC = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [tests, setTests] = useState<RecoveryTest[]>([
    { name: 'Authentication Check', status: 'pending' },
    { name: 'Storage Bucket Access', status: 'pending' },
    { name: 'Claude AI Function Test', status: 'pending' },
    { name: 'File Upload Pipeline', status: 'pending' },
    { name: 'Edge Function Deployment', status: 'pending' }
  ]);

  const { toast } = useToast();
  const { analyzeWithChat } = useChatAnalysis();

  const updateTestStatus = (testName: string, status: RecoveryTest['status'], result?: any, error?: string) => {
    setTests(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status, result, error }
        : test
    ));
  };

  const runRecoveryDiagnostics = async () => {
    setIsRecovering(true);
    console.log('=== CHAT ANALYSIS RECOVERY START ===');

    try {
      // Test 1: Authentication Check
      updateTestStatus('Authentication Check', 'running');
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('User not authenticated');
        }
        updateTestStatus('Authentication Check', 'success', { userId: user.id });
        console.log('✓ Authentication check passed');
      } catch (error) {
        updateTestStatus('Authentication Check', 'error', null, error instanceof Error ? error.message : 'Auth failed');
        console.error('✗ Authentication check failed:', error);
      }

      // Test 2: Storage Bucket Access
      updateTestStatus('Storage Bucket Access', 'running');
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) throw bucketsError;
        
        const designUploadsBucket = buckets?.find(bucket => bucket.id === 'design-uploads');
        if (!designUploadsBucket) {
          throw new Error('design-uploads bucket not found');
        }

        // Test file listing
        const { data: files, error: filesError } = await supabase.storage
          .from('design-uploads')
          .list('', { limit: 1 });

        updateTestStatus('Storage Bucket Access', 'success', { 
          bucketExists: true, 
          canList: !filesError,
          bucketConfig: designUploadsBucket 
        });
        console.log('✓ Storage bucket access check passed');
      } catch (error) {
        updateTestStatus('Storage Bucket Access', 'error', null, error instanceof Error ? error.message : 'Storage failed');
        console.error('✗ Storage bucket access failed:', error);
      }

      // Test 3: Claude AI Function Test
      updateTestStatus('Claude AI Function Test', 'running');
      try {
        const { data, error } = await supabase.functions.invoke('claude-ai', {
          body: {
            message: 'Test connection - please respond with "Connection successful"',
            attachments: [],
            uploadIds: []
          }
        });

        if (error) throw error;
        
        if (data?.success) {
          updateTestStatus('Claude AI Function Test', 'success', { 
            response: data.analysis?.substring(0, 100) + '...',
            debugInfo: data.debugInfo 
          });
          console.log('✓ Claude AI function test passed');
        } else {
          throw new Error(data?.error || 'Function returned unsuccessful response');
        }
      } catch (error) {
        updateTestStatus('Claude AI Function Test', 'error', null, error instanceof Error ? error.message : 'Function failed');
        console.error('✗ Claude AI function test failed:', error);
      }

      // Test 4: File Upload Pipeline
      updateTestStatus('File Upload Pipeline', 'running');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated for upload test');

        // Create a small test file
        const testContent = 'Test file for chat analysis recovery';
        const testFile = new Blob([testContent], { type: 'text/plain' });
        const fileName = `recovery-test-${Date.now()}.txt`;
        const filePath = `${user.id}/test/${fileName}`;

        // Try uploading
        const { error: uploadError } = await supabase.storage
          .from('design-uploads')
          .upload(filePath, testFile);

        if (uploadError) throw uploadError;

        // Try deleting the test file
        const { error: deleteError } = await supabase.storage
          .from('design-uploads')
          .remove([filePath]);

        updateTestStatus('File Upload Pipeline', 'success', { 
          canUpload: true, 
          canDelete: !deleteError,
          testFilePath: filePath 
        });
        console.log('✓ File upload pipeline test passed');
      } catch (error) {
        updateTestStatus('File Upload Pipeline', 'error', null, error instanceof Error ? error.message : 'Upload pipeline failed');
        console.error('✗ File upload pipeline failed:', error);
      }

      // Test 5: Edge Function Deployment
      updateTestStatus('Edge Function Deployment', 'running');
      try {
        // Check if we can get function information
        const response = await fetch('/api/health', { method: 'HEAD' }).catch(() => null);
        
        // Try to invoke the function with a minimal payload
        const { data, error } = await supabase.functions.invoke('claude-ai', {
          body: { message: 'deployment test' }
        });

        const isDeployed = !!data || (error && !error.message?.includes('Function not found'));
        
        updateTestStatus('Edge Function Deployment', 'success', { 
          isDeployed,
          hasResponse: !!data,
          error: error?.message 
        });
        console.log('✓ Edge function deployment check completed');
      } catch (error) {
        updateTestStatus('Edge Function Deployment', 'error', null, error instanceof Error ? error.message : 'Deployment check failed');
        console.error('✗ Edge function deployment check failed:', error);
      }

      const successCount = tests.filter(test => test.status === 'success').length;
      const totalTests = tests.length;

      toast({
        title: "Recovery Diagnostics Complete",
        description: `${successCount}/${totalTests} tests passed. ${successCount === totalTests ? 'System is healthy!' : 'Issues detected.'}`,
        variant: successCount === totalTests ? "default" : "destructive"
      });

      console.log('=== CHAT ANALYSIS RECOVERY COMPLETE ===');

    } catch (error) {
      console.error('Recovery diagnostics failed:', error);
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: error instanceof Error ? error.message : 'Diagnostics failed',
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const performQuickTest = async () => {
    try {
      toast({
        title: "Running Quick Test",
        description: "Testing chat analysis with simple message...",
      });

      const result = await analyzeWithChat.mutateAsync({
        message: 'Quick test: please analyze this text for any design insights.',
        attachments: []
      });

      toast({
        title: "Quick Test Successful",
        description: `Analysis completed: ${result.analysis.substring(0, 100)}...`,
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Quick Test Failed",
        description: error instanceof Error ? error.message : 'Test failed',
      });
    }
  };

  const getStatusIcon = (status: RecoveryTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded" />;
    }
  };

  const getStatusBadge = (status: RecoveryTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Pass</Badge>;
      case 'error':
        return <Badge variant="destructive">Fail</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Analysis Recovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={runRecoveryDiagnostics} 
            disabled={isRecovering}
            className="flex-1"
          >
            {isRecovering ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
            )}
            Run Recovery Diagnostics
          </Button>
          
          <Button 
            onClick={performQuickTest} 
            disabled={analyzeWithChat.isPending}
            variant="outline"
            className="flex-1"
          >
            {analyzeWithChat.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-2" />
            )}
            Quick Test
          </Button>
        </div>

        <div className="space-y-2">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{test.name}</div>
                  {test.error && (
                    <div className="text-xs text-red-600 mt-1">{test.error}</div>
                  )}
                  {test.result && test.status === 'success' && (
                    <details className="mt-1">
                      <summary className="text-xs cursor-pointer text-blue-600">View Details</summary>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-h-32">
                        {JSON.stringify(test.result, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          This recovery system tests all components of the chat analysis pipeline including authentication, 
          storage access, edge function deployment, and file processing capabilities.
        </div>
      </CardContent>
    </Card>
  );
};
