
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertTriangle, Play, Zap, Settings } from 'lucide-react';

export const StripeWebhookTester: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runTest = async (testType: string) => {
    setIsLoading(true);
    setResults(null);
    
    try {
      console.log('Running test:', testType);
      
      const { data, error } = await supabase.functions.invoke('test-stripe-webhook', {
        body: { 
          testType,
          userEmail: testEmail,
          creditAmount: Number(creditAmount)
        }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.success) {
        toast({
          title: "Test Successful",
          description: data.message || "Test completed successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Test Failed",
          description: data.error || "Test failed with unknown error",
        });
      }
    } catch (error: any) {
      console.error('Test error:', error);
      const errorMessage = error.message || 'Test failed with unknown error';
      setResults({ success: false, error: errorMessage });
      toast({
        variant: "destructive",
        title: "Test Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfigStatus = (config: any) => {
    if (!config) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Configuration</h4>
          {Object.entries(config.configuration).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              {value ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{key.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Connections</h4>
          {Object.entries(config.connections).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              {value ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{key} connection</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Stripe Webhook Tester
          </CardTitle>
          <CardDescription>
            Test your Stripe webhook configuration and credit system integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Validation */}
          <div className="space-y-3">
            <Label className="text-base font-medium">1. Validate Configuration</Label>
            <p className="text-sm text-muted-foreground">
              Check if all required environment variables and connections are properly configured.
            </p>
            <Button
              onClick={() => runTest('validate_config')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isLoading ? 'Validating...' : 'Validate Configuration'}
            </Button>
          </div>

          {/* Test Inputs */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-base font-medium">2. Test Credit Processing</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">User Email</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="Enter user email to test"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must be an email of an existing user in your system
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditAmount">Credits to Add</Label>
                <Input
                  id="creditAmount"
                  type="number"
                  min="1"
                  max="1000"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => runTest('simulate_webhook')}
                disabled={isLoading || !testEmail}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? 'Testing...' : 'Simulate Webhook'}
              </Button>
              <Button
                onClick={() => runTest('create_test_checkout')}
                disabled={isLoading || !testEmail}
                variant="outline"
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isLoading ? 'Creating...' : 'Create Test Checkout'}
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="border-t pt-4">
              <Label className="text-base font-medium">Test Results</Label>
              <div className="mt-3">
                {results.success ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Test Successful!</p>
                        {results.message && <p>{results.message}</p>}
                        {results.creditsAdded && (
                          <p>✅ Added {results.creditsAdded} credits</p>
                        )}
                        {results.newBalance && (
                          <p>💰 New balance: {results.newBalance} credits</p>
                        )}
                        {results.checkoutUrl && (
                          <div className="mt-2">
                            <a 
                              href={results.checkoutUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              🔗 Open Test Checkout Session
                            </a>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Test Failed</p>
                        <p>{results.error}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {results.configuration && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    {renderConfigStatus(results)}
                    {results.webhook_url && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium">Webhook URL:</p>
                        <code className="text-xs bg-background p-2 rounded block mt-1">
                          {results.webhook_url}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t pt-4">
            <Label className="text-base font-medium">Testing Instructions</Label>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Validate Configuration:</strong> Checks all environment variables and connections</p>
              <p>• <strong>Simulate Webhook:</strong> Tests the credit processing logic without Stripe</p>
              <p>• <strong>Create Test Checkout:</strong> Creates a real Stripe checkout session for testing</p>
              <p>• Make sure to use an email that exists in your user database</p>
              <p>• Check the Edge Function logs for detailed debugging information</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> The "Create Test Checkout" creates a real Stripe session. 
          Make sure you're using test mode in Stripe to avoid actual charges.
        </AlertDescription>
      </Alert>
    </div>
  );
};
