
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PricingFieldsProps {
  planType: 'recurring' | 'credits';
  priceMonthly?: number;
  priceAnnual?: number;
  creditPrice?: number;
  onPriceMonthlyChange: (value: number | undefined) => void;
  onPriceAnnualChange: (value: number | undefined) => void;
  onCreditPriceChange: (value: number | undefined) => void;
}

export const PricingFields = ({
  planType,
  priceMonthly,
  priceAnnual,
  creditPrice,
  onPriceMonthlyChange,
  onPriceAnnualChange,
  onCreditPriceChange
}: PricingFieldsProps) => {
  const isRecurring = planType === 'recurring';

  if (isRecurring) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price_monthly">Monthly Price ($)</Label>
          <Input
            id="price_monthly"
            type="number"
            min="0"
            step="0.01"
            value={priceMonthly || ''}
            onChange={(e) => onPriceMonthlyChange(
              e.target.value ? parseFloat(e.target.value) : undefined
            )}
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
            value={priceAnnual || ''}
            onChange={(e) => onPriceAnnualChange(
              e.target.value ? parseFloat(e.target.value) : undefined
            )}
            placeholder="0.00"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="credit_price">Credit Pack Price ($)</Label>
      <Input
        id="credit_price"
        type="number"
        min="0"
        step="0.01"
        value={creditPrice || ''}
        onChange={(e) => onCreditPriceChange(
          e.target.value ? parseFloat(e.target.value) : undefined
        )}
        placeholder="0.00"
        required={!isRecurring}
      />
    </div>
  );
};
