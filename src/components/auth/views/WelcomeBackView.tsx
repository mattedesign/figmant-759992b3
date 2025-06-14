
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AuthButton } from '../shared/AuthButton';
import { LogOut, ArrowRight } from 'lucide-react';

interface WelcomeBackViewProps {
  onGoToDashboard: () => void;
  onSignOut: () => void;
  loading?: boolean;
}

export const WelcomeBackView: React.FC<WelcomeBackViewProps> = ({
  onGoToDashboard,
  onSignOut,
  loading = false
}) => {
  return (
    <Card className="modern-card border-0 shadow-xl">
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Ready to continue?</h2>
          <p className="text-sm text-muted-foreground">
            You're signed in and ready to analyze your designs with AI-powered insights.
          </p>
        </div>

        <div className="space-y-3">
          <AuthButton 
            onClick={onGoToDashboard}
            icon={ArrowRight}
            className="w-full"
          >
            Go to Dashboard
          </AuthButton>
          
          <AuthButton 
            onClick={onSignOut}
            variant="outline"
            disabled={loading}
            icon={LogOut}
            className="w-full"
          >
            Sign out
          </AuthButton>
        </div>
      </CardContent>
    </Card>
  );
};
