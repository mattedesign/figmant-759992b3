
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '@/types/subscription';
import { PlanFormFields } from './PlanFormFields';

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: SubscriptionPlan | null;
  onSubmit: (data: CreateSubscriptionPlanData) => void;
  isLoading: boolean;
}

export const SubscriptionPlanDialog = ({ 
  open, 
  onOpenChange, 
  plan, 
  onSubmit, 
  isLoading 
}: SubscriptionPlanDialogProps) => {
  const [formData, setFormData] = useState<CreateSubscriptionPlanData>({
    name: '',
    description: '',
    credits: 0,
    price_monthly: undefined,
    price_annual: undefined,
    is_active: true,
    plan_type: 'recurring',
    credit_price: undefined
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        credits: plan.credits,
        price_monthly: plan.price_monthly || undefined,
        price_annual: plan.price_annual || undefined,
        is_active: plan.is_active,
        plan_type: plan.plan_type,
        credit_price: plan.credit_price || undefined
      });
    } else {
      setFormData({
        name: '',
        description: '',
        credits: 0,
        price_monthly: undefined,
        price_annual: undefined,
        is_active: true,
        plan_type: 'recurring',
        credit_price: undefined
      });
    }
  }, [plan, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!plan;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the subscription plan details below.' 
              : 'Create a new subscription plan with pricing and credits.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PlanFormFields
            formData={formData}
            onFormDataChange={setFormData}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update Plan' : 'Create Plan')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
