
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
}

export const useStripeSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true
  });
  const { user, session } = useAuth();
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('Checking subscription status...');
      setSubscriptionStatus(prev => ({ ...prev, loading: true }));

      // Since we removed recurring subscriptions, always return no subscription
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        loading: false
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const createCheckoutSession = async (planId: string) => {
    if (!user || !session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to purchase credits.",
      });
      return;
    }

    try {
      console.log('Creating checkout session for credit pack:', planId);
      
      // TODO: Implement credit pack checkout with Stripe
      toast({
        title: "Feature Coming Soon",
        description: "Credit pack purchases will be available soon.",
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: "Failed to create checkout session. Please try again.",
      });
    }
  };

  const openCustomerPortal = async () => {
    toast({
      title: "No Active Subscription",
      description: "You don't have a recurring subscription to manage. Purchase credits instead.",
    });
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    subscriptionStatus,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription: checkSubscription
  };
};
