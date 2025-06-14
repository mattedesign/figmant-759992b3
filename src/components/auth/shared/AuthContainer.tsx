
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
    <div className="w-full space-y-6">
      {showLogo && (
        <div className="text-center">
          <Logo size="md" />
        </div>
      )}

      <Card className="modern-card border-0 shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
