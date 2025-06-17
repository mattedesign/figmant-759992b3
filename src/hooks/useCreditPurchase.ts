
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
      
      // Call the create-checkout edge function to create a Stripe session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId,
          planType: 'credits',
          amount: price * 100, // Convert to cents
          creditAmount
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
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
