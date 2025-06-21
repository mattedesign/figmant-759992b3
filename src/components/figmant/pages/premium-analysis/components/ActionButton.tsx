
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  variant = 'outline', 
  icon: Icon, 
  children, 
  className = '' 
}) => {
  return (
    <Button 
      variant={variant} 
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
};
