
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CreateSubscriptionPlanData } from '@/types/subscription';
import { PlanTypeSelector } from './PlanTypeSelector';
import { PricingFields } from './PricingFields';

interface PlanFormFieldsProps {
  formData: CreateSubscriptionPlanData;
  onFormDataChange: (data: CreateSubscriptionPlanData) => void;
}

export const PlanFormFields = ({ formData, onFormDataChange }: PlanFormFieldsProps) => {
  const isRecurring = formData.plan_type === 'recurring';

  const handlePlanTypeChange = (value: 'recurring' | 'credits') => {
    onFormDataChange({
      ...formData,
      plan_type: value,
      // Clear irrelevant pricing fields when switching types
      price_monthly: value === 'credits' ? undefined : formData.price_monthly,
      price_annual: value === 'credits' ? undefined : formData.price_annual,
      credit_price: value === 'recurring' ? undefined : formData.credit_price
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          placeholder="e.g., Pro Plan"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          placeholder="Plan description..."
          rows={3}
        />
      </div>

      <PlanTypeSelector
        value={formData.plan_type}
        onChange={handlePlanTypeChange}
      />

      <div className="space-y-2">
        <Label htmlFor="credits">
          {isRecurring ? 'Monthly/Annual Credit Allowance' : 'Credits in Pack'}
        </Label>
        <Input
          id="credits"
          type="number"
          min="0"
          value={formData.credits}
          onChange={(e) => onFormDataChange({ 
            ...formData, 
            credits: parseInt(e.target.value) || 0 
          })}
          required
        />
      </div>

      <PricingFields
        planType={formData.plan_type}
        priceMonthly={formData.price_monthly}
        priceAnnual={formData.price_annual}
        creditPrice={formData.credit_price}
        onPriceMonthlyChange={(value) => onFormDataChange({ 
          ...formData, 
          price_monthly: value 
        })}
        onPriceAnnualChange={(value) => onFormDataChange({ 
          ...formData, 
          price_annual: value 
        })}
        onCreditPriceChange={(value) => onFormDataChange({ 
          ...formData, 
          credit_price: value 
        })}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onFormDataChange({ 
            ...formData, 
            is_active: checked 
          })}
        />
        <Label htmlFor="is_active">Active Plan</Label>
      </div>
    </div>
  );
};
