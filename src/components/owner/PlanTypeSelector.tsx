
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlanTypeSelectorProps {
  value: 'recurring' | 'credits';
  onChange: (value: 'recurring' | 'credits') => void;
}

export const PlanTypeSelector = ({ value, onChange }: PlanTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="plan_type">Plan Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recurring">Recurring Subscription</SelectItem>
          <SelectItem value="credits">Credit Pack</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
