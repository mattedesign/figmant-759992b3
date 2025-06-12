
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useCreditTransactionManager } from '@/hooks/useCreditTransactionManager';
import { CreditStatusCard } from './credit-management/CreditStatusCard';
import { CreditTransactionForm } from './credit-management/CreditTransactionForm';

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
  console.log('CreditManagementDialog rendering:', { open, user: user?.id, credits });
  
  const { processTransaction, isLoading } = useCreditTransactionManager();

  const handleTransactionSubmit = async (
    transactionType: 'purchase' | 'admin_adjustment' | 'refund',
    amount: number,
    description: string
  ) => {
    if (!user) {
      console.error('No user provided to handleTransactionSubmit');
      return false;
    }

    console.log('Submitting transaction:', { transactionType, amount, description, userId: user.id });

    try {
      const success = await processTransaction(user, credits, transactionType, amount, description);
      if (success) {
        console.log('Transaction successful, updating credits and closing dialog');
        onCreditsUpdated();
        onOpenChange(false);
      }
      return success;
    } catch (error) {
      console.error('Transaction submission failed:', error);
      return false;
    }
  };

  if (!user) {
    console.log('CreditManagementDialog: No user provided, not rendering');
    return null;
  }

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
          <CreditStatusCard credits={credits} />
          
          <CreditTransactionForm 
            onSubmit={handleTransactionSubmit}
            isLoading={isLoading}
          />

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
