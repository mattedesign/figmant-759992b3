
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Coins, Plus, Minus, RefreshCw, DollarSign } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'owner' | 'subscriber';
}

interface UserCredits {
  current_balance: number;
  total_purchased: number;
  total_used: number;
}

interface CreditManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  credits: UserCredits | null;
  onCreditsUpdated: () => void;
}

export const CreditManagementDialog = ({ 
  open, 
  onOpenChange, 
  user, 
  credits, 
  onCreditsUpdated 
}: CreditManagementDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<'purchase' | 'admin_adjustment' | 'refund'>('admin_adjustment');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || amount <= 0) return;

    setIsLoading(true);
    try {
      // Get current user for created_by
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Create credit transaction first
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          transaction_type: transactionType,
          amount: amount,
          description: description || `${transactionType} by admin`,
          created_by: currentUser.id
        });

      if (transactionError) throw transactionError;

      // Calculate new values
      const currentBalance = credits?.current_balance || 0;
      const totalPurchased = credits?.total_purchased || 0;
      const totalUsed = credits?.total_used || 0;

      let newBalance = currentBalance;
      let newTotalPurchased = totalPurchased;

      if (transactionType === 'purchase' || transactionType === 'admin_adjustment' || transactionType === 'refund') {
        newBalance += amount;
        if (transactionType === 'purchase') {
          newTotalPurchased += amount;
        }
      }

      // Check if user_credits record exists first
      const { data: existingCredits } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingCredits) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            current_balance: newBalance,
            total_purchased: newTotalPurchased,
            total_used: totalUsed,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record if none exists
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            current_balance: newBalance,
            total_purchased: newTotalPurchased,
            total_used: totalUsed
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Credits Updated",
        description: `Successfully ${transactionType === 'admin_adjustment' ? 'adjusted' : transactionType}d ${amount} credits.`,
      });

      onCreditsUpdated();
      onOpenChange(false);
      setAmount(0);
      setDescription('');
    } catch (error: any) {
      console.error('Credit transaction error:', error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "Failed to update credits.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Manage Credits</span>
          </DialogTitle>
          <DialogDescription>
            Manage credit balance for {user.full_name || user.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Credits Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Credit Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {credits?.current_balance || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Current Balance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {credits?.total_purchased || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Purchased</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {credits?.total_used || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Used</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Transaction Form */}
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || amount <= 0}>
                {isLoading ? 'Processing...' : 'Apply Transaction'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
