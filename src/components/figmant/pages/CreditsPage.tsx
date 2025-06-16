
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Star } from 'lucide-react';

export const CreditsPage: React.FC = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      credits: '100 credits',
      features: [
        'Basic design analysis',
        'Standard templates',
        'Email support',
        'Download reports'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      credits: '300 credits',
      features: [
        'Advanced design analysis',
        'Premium templates',
        'Priority support',
        'Custom branding',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      credits: '1000 credits',
      features: [
        'Unlimited analysis',
        'Custom templates',
        'Dedicated support',
        'White-label solution',
        'Advanced integrations'
      ],
      popular: false
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">
            Select the perfect plan for your design analysis needs
          </p>
        </div>

        {/* Current Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">50 / 110</p>
                <p className="text-sm text-gray-600">Credits remaining</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Professional Plan</p>
                <p className="text-xs text-gray-600">Renews on March 15, 2024</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="text-sm font-medium text-blue-600">
                  {plan.credits}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Credits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need More Credits?</CardTitle>
            <CardDescription>
              Purchase additional credits for your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { credits: '50', price: '$15' },
                { credits: '100', price: '$25' },
                { credits: '250', price: '$60' },
                { credits: '500', price: '$100' }
              ].map((option) => (
                <Card key={option.credits} className="text-center">
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{option.credits}</p>
                    <p className="text-sm text-gray-600 mb-2">credits</p>
                    <p className="text-lg font-semibold text-blue-600 mb-3">{option.price}</p>
                    <Button size="sm" className="w-full">
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
