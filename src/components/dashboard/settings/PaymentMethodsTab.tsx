
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, MoreHorizontal } from 'lucide-react';

interface PaymentMethodsTabProps {
  onAddPaymentMethod: () => void;
  onManagePaymentMethod: (methodId: string) => void;
}

export const PaymentMethodsTab = ({ onAddPaymentMethod, onManagePaymentMethod }: PaymentMethodsTabProps) => {
  // Mock payment methods data - in real app this would come from Stripe
  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Methods</span>
          </CardTitle>
          <CardDescription>
            Manage your saved payment methods for credit purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No payment methods saved</p>
                <Button onClick={onAddPaymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {method.brand.toUpperCase()} •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onManagePaymentMethod(method.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={onAddPaymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
