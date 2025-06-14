
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  title,
  subtitle,
  showLogo = true
}) => {
  return (
    <div className="w-full max-w-md space-y-8">
      {showLogo && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="auth-heading">UX Analytics AI</h1>
              <p className="auth-subheading">{subtitle}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="modern-card border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
