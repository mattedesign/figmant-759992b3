
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { credits, refetchCredits } = useUserCredits();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refresh credits when the page loads
    const refreshCredits = async () => {
      try {
        await refetchCredits();
      } catch (error) {
        console.error('Error refreshing credits:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshCredits();
  }, [refetchCredits]);

  const handleDone = () => {
    // Show toast with new credit balance
    toast({
      title: "Credits Added Successfully!",
      description: `You now have ${credits?.current_balance || 0} analysis credits available.`,
      duration: 5000,
    });

    // Navigate to design analysis page
    navigate('/figmant');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your credit purchase has been completed successfully.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Transaction ID</span>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {sessionId ? sessionId.slice(-12) : 'Processing...'}
              </Badge>
            </div>

            {!isRefreshing && credits && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Your Credit Balance</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {credits.current_balance}
                </div>
                <div className="text-sm text-blue-700">
                  Analysis credits available
                </div>
              </div>
            )}

            {isRefreshing && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Updating your credit balance...</div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleDone}
                className="w-full"
                disabled={isRefreshing}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Start Analyzing Designs
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/subscription')}
                className="w-full"
              >
                View Subscription
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              <p>Your credits never expire and can be used for any design analysis.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
