
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Sparkles, Upload, Zap } from 'lucide-react';

interface WelcomePromptProps {
  isOpen: boolean;
  onClose: () => void;
  userCredits: number;
}

export const WelcomePrompt: React.FC<WelcomePromptProps> = ({
  isOpen,
  onClose,
  userCredits
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to UX Analytics!</DialogTitle>
          <DialogDescription className="text-center">
            We're excited to have you on board. Let's get you started with your design analysis journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Free Credits Bonus!</h3>
                <p className="text-sm text-muted-foreground">
                  You've received {userCredits} free credits to get started with design analysis.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium">What you can do with your credits:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 text-primary" />
                Upload and analyze your designs (1 credit per analysis)
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                Get AI-powered UX insights and recommendations
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            After using your free credits, you can subscribe for unlimited access or purchase more credits.
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Start Analyzing Designs
        </Button>
      </DialogContent>
    </Dialog>
  );
};
