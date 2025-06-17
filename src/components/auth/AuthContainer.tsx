
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showLogo?: boolean;
  welcomeText?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
  welcomeText
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      {showLogo && (
        <div className="mb-8">
          <Logo size="md" />
          {welcomeText && (
            <div className="mt-6 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{welcomeText}</h1>
              <p className="text-gray-600 text-sm leading-relaxed">{subtitle}</p>
            </div>
          )}
        </div>
      )}

      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {!welcomeText && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
