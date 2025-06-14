
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Brain, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ClaudeConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testResponse, setTestResponse] = useState<string>('');
  const { isOwner } = useAuth();
  const { toast } = useToast();

  const testClaudeConnection = async () => {
    if (!isOwner) {
      toast({
        variant: "destructive",
        title: "Access Restricted",
        description: "Only administrators can test the Claude AI connection.",
      });
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);
    setTestResponse('');

    try {
      console.log('Testing Claude AI connection...');

      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          message: 'Please respond with "Claude AI connection test successful" to confirm you are working correctly.',
          attachments: [],
          uploadIds: []
        }
      });

      if (error) {
        console.error('Claude test failed:', error);
        throw error;
      }

      console.log('Claude test response:', data);
      setTestResult('success');
      setTestResponse(data.analysis || 'Connection successful');
      
      toast({
        title: "Connection Test Successful",
        description: "Claude AI is responding correctly.",
      });
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setTestResult('error');
      setTestResponse(error.message || 'Connection failed');
      
      toast({
        variant: "destructive",
        title: "Connection Test Failed",
        description: error.message || "Unable to connect to Claude AI",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Claude AI Connection Test
          </CardTitle>
          <CardDescription>
            Connection testing is restricted to administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Contact your administrator if you're experiencing issues with Claude AI</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Claude AI Connection Test
        </CardTitle>
        <CardDescription>
          Test the Claude AI integration to ensure it's working properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testClaudeConnection}
          disabled={isTestingConnection}
          className="w-full"
        >
          {isTestingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Test Claude AI Connection
            </>
          )}
        </Button>

        {testResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {testResult === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connection Successful
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Connection Failed
                  </Badge>
                </>
              )}
            </div>
            
            {testResponse && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-1">Response:</p>
                <p className="text-sm text-muted-foreground">{testResponse}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
