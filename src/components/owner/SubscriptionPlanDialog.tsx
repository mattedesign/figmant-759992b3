
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
    credits: 10,
    price_monthly: undefined,
    price_annual: undefined,
    is_active: true,
    plan_type: 'credits', // Force credit-based plans only
    credit_price: 1.00
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        credits: plan.credits,
        price_monthly: undefined, // Remove monthly pricing
        price_annual: undefined, // Remove annual pricing
        is_active: plan.is_active,
        plan_type: 'credits', // Force credit-based
        credit_price: plan.credit_price || 1.00
      });
    } else {
      setFormData({
        name: '',
        description: '',
        credits: 10,
        price_monthly: undefined,
        price_annual: undefined,
        is_active: true,
        plan_type: 'credits',
        credit_price: 1.00
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
            {isEditing ? 'Edit Credit Pack' : 'Create Credit Pack'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the credit pack details below.' 
              : 'Create a new credit pack with pricing and credit amounts.'}
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
              {isLoading ? 'Saving...' : (isEditing ? 'Update Pack' : 'Create Pack')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
