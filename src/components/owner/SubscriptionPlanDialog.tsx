
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '@/types/subscription';

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
    is_active: true
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        credits: plan.credits,
        price_monthly: plan.price_monthly || undefined,
        price_annual: plan.price_annual || undefined,
        is_active: plan.is_active
      });
    } else {
      setFormData({
        name: '',
        description: '',
        credits: 0,
        price_monthly: undefined,
        price_annual: undefined,
        is_active: true
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
      <DialogContent className="sm:max-w-[425px]">
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
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pro Plan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Plan description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              min="0"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_monthly">Monthly Price ($)</Label>
              <Input
                id="price_monthly"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_monthly || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  price_monthly: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_annual">Annual Price ($)</Label>
              <Input
                id="price_annual"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_annual || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  price_annual: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active Plan</Label>
          </div>

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
