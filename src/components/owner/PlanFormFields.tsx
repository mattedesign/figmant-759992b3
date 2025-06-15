
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CreateSubscriptionPlanData } from '@/types/subscription';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PlanFormFieldsProps {
  formData: CreateSubscriptionPlanData;
  onFormDataChange: (data: CreateSubscriptionPlanData) => void;
}

export const PlanFormFields = ({ formData, onFormDataChange }: PlanFormFieldsProps) => {
  const updateField = (field: keyof CreateSubscriptionPlanData, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Only credit-based packs are supported. Each pack provides a specific number of analysis credits.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="name">Pack Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g., Starter Pack, Professional Pack"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe what this credit pack offers..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credits">Number of Credits</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            value={formData.credits}
            onChange={(e) => updateField('credits', parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit_price">Total Price ($)</Label>
          <Input
            id="credit_price"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.credit_price || ''}
            onChange={(e) => updateField('credit_price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {formData.credits > 0 && formData.credit_price && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Price per credit: ${(formData.credit_price / formData.credits).toFixed(3)}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => updateField('is_active', checked)}
        />
        <Label htmlFor="is_active">Active (available for purchase)</Label>
      </div>
    </div>
  );
};
