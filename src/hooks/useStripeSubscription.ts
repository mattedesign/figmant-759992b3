
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

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      console.log('Subscription status received:', data);
      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionStatus(prev => ({ ...prev, loading: false }));
      toast({
        variant: "destructive",
        title: "Subscription Check Failed",
        description: "Failed to check subscription status. Please try again.",
      });
    }
  };

  const createCheckoutSession = async (planType: 'basic' | 'unlimited' = 'basic') => {
    if (!user || !session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan.",
      });
      return;
    }

    try {
      console.log('Creating checkout session for plan:', planType);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
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
    if (!user || !session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to manage your subscription.",
      });
      return;
    }

    try {
      console.log('Opening customer portal...');
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open customer portal in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        variant: "destructive",
        title: "Portal Access Failed",
        description: "Failed to open customer portal. Please try again.",
      });
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  // Auto-refresh subscription status every 30 seconds if user is logged in
  useEffect(() => {
    if (!user || !session) return;

    const interval = setInterval(checkSubscription, 30000);
    return () => clearInterval(interval);
  }, [user, session]);

  return {
    subscriptionStatus,
    checkSubscription,
    createCheckoutSession,
    openCustomerPortal,
    refreshSubscription: checkSubscription
  };
};
