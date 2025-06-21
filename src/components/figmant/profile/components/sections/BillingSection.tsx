
import React from 'react';
import { PaymentMethodsTab } from '@/components/dashboard/settings/PaymentMethodsTab';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const BillingSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const handlers = createSettingsHandlers(user, toast);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
        <p className="text-gray-600 mt-1">
          Manage your payment methods, subscription, and billing history.
        </p>
      </div>
      
      <PaymentMethodsTab
        onAddPaymentMethod={handlers.handleAddPaymentMethod}
        onManagePaymentMethod={handlers.handleManagePaymentMethod}
      />
    </div>
  );
};
