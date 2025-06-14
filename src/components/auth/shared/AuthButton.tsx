
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LucideIcon } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  variant?: 'default' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  type = 'button',
  variant = 'default',
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  icon: Icon,
  className = ''
}) => {
  const isDisabled = disabled || loading;
  const buttonClassName = variant === 'default' 
    ? `modern-button h-12 flex items-center justify-center gap-2 ${className}`
    : `h-12 flex items-center justify-center gap-2 ${className}`;

  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClassName}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {children}
          {Icon && <Icon className="h-4 w-4" />}
        </>
      )}
    </Button>
  );
};
