
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, RefreshCw, DollarSign } from 'lucide-react';

interface CreditTransactionFormProps {
  onSubmit: (transactionType: 'purchase' | 'admin_adjustment' | 'refund', amount: number, description: string) => Promise<boolean>;
  isLoading: boolean;
}

export const CreditTransactionForm = ({ onSubmit, isLoading }: CreditTransactionFormProps) => {
  const [transactionType, setTransactionType] = useState<'purchase' | 'admin_adjustment' | 'refund'>('admin_adjustment');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const success = await onSubmit(transactionType, amount, description);
    if (success) {
      setAmount(0);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="transaction_type">Transaction Type</Label>
        <Select
          value={transactionType}
          onValueChange={(value: 'purchase' | 'admin_adjustment' | 'refund') => 
            setTransactionType(value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin_adjustment">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Admin Adjustment</span>
              </div>
            </SelectItem>
            <SelectItem value="purchase">
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Purchase Credits</span>
              </div>
            </SelectItem>
            <SelectItem value="refund">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Refund Credits</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Credit Amount</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          value={amount || ''}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          placeholder="Enter credit amount"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter transaction description..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading || amount <= 0}>
          {isLoading ? 'Processing...' : 'Apply Transaction'}
        </Button>
      </div>
    </form>
  );
};
