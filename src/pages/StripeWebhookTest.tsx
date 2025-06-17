
import React from 'react';
import { StripeWebhookTester } from '@/components/stripe/StripeWebhookTester';

export default function StripeWebhookTest() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Stripe Webhook Testing</h1>
          <p className="text-muted-foreground">
            Test and validate your Stripe webhook configuration
          </p>
        </div>
        
        <StripeWebhookTester />
      </div>
    </div>
  );
}
