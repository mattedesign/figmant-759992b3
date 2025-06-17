
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCreditPurchase = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePurchaseCredits = async (planId: string, planName: string, creditAmount: number, price: number) => {
    setIsProcessing(true);
    
    try {
      console.log('Starting credit purchase:', { planId, planName, creditAmount, price });
      
      // Validate inputs
      if (!planId || !creditAmount || !price) {
        throw new Error('Missing required purchase information');
      }

      // Call the create-checkout edge function to create a Stripe session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId,
          planType: 'credits',
          amount: Math.round(price * 100), // Convert to cents and ensure integer
          creditAmount
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      console.log('Checkout response:', data);

      if (data?.url) {
        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
      
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        variant: "destructive",
        title: "Purchase Failed", 
        description: error instanceof Error ? error.message : "Unable to process credit purchase. Please try again later.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handlePurchaseCredits,
    isProcessing
  };
};
