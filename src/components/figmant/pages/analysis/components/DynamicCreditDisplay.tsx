
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicCreditDisplayProps {
  creditCost: number;
  isLoading?: boolean;
  variant?: 'default' | 'premium' | 'basic';
  className?: string;
  showIcon?: boolean;
}

export const DynamicCreditDisplay: React.FC<DynamicCreditDisplayProps> = ({
  creditCost,
  isLoading = false,
  variant = 'default',
  className,
  showIcon = true
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none';
      case 'basic':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getVariantByCredits = (credits: number) => {
    if (credits >= 5) return 'premium';
    if (credits >= 3) return 'basic';
    return 'default';
  };

  const displayVariant = variant === 'default' ? getVariantByCredits(creditCost) : variant;

  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("flex items-center gap-1", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge 
      className={cn(
        "flex items-center gap-1 font-medium transition-all duration-200",
        getVariantStyles(),
        className
      )}
    >
      {showIcon && <CreditCard className="h-3 w-3" />}
      {creditCost} Credit{creditCost !== 1 ? 's' : ''}
    </Badge>
  );
};
