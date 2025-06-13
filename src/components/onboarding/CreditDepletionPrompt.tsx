
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreditDepletionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  remainingCredits: number;
}

export const CreditDepletionPrompt: React.FC<CreditDepletionPromptProps> = ({
  isOpen,
  onClose,
  remainingCredits
}) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    navigate('/subscription');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {remainingCredits === 0 ? 'Credits Depleted' : 'Low on Credits'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {remainingCredits === 0 
              ? "You've used all your free credits. Continue analyzing designs with a subscription or by purchasing more credits."
              : `You have ${remainingCredits} credit${remainingCredits === 1 ? '' : 's'} remaining. Consider upgrading to continue your analysis journey.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-orange-800">Continue Your UX Journey</h3>
              <p className="text-sm text-orange-700">
                Get unlimited access to design analysis with our subscription plans or purchase additional credits.
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleViewPlans} className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Subscribe
            </Button>
            <Button variant="outline" onClick={handleViewPlans} className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Buy Credits
            </Button>
          </div>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full">
          Continue with {remainingCredits} credit{remainingCredits === 1 ? '' : 's'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
