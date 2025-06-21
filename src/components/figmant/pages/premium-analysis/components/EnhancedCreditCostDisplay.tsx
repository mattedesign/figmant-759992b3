
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface EnhancedCreditCostDisplayProps {
  templateId: string;
  isSelected?: boolean;
  showPreview?: boolean;
}

const fetchTemplateCreditCost = async (templateId: string) => {
  const { data, error } = await supabase
    .from('claude_prompt_examples')
    .select('credit_cost, category')
    .eq('id', templateId)
    .single();
  
  if (error) throw error;
  return {
    credit_cost: data.credit_cost || 3,
    category: data.category
  };
};

export const EnhancedCreditCostDisplay: React.FC<EnhancedCreditCostDisplayProps> = ({
  templateId,
  isSelected = false,
  showPreview = false
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ['enhanced-template-cost', templateId],
    queryFn: () => fetchTemplateCreditCost(templateId),
    enabled: !!templateId
  });

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        <CreditCard className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  const creditCost = data?.credit_cost || 3;
  const category = data?.category;

  const getIcon = () => {
    if (creditCost >= 5) return <Crown className="h-3 w-3" />;
    if (creditCost >= 3) return <Zap className="h-3 w-3" />;
    return <CreditCard className="h-3 w-3" />;
  };

  const getVariantClass = () => {
    if (isSelected) {
      if (creditCost >= 5) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none';
      if (creditCost >= 3) return 'bg-blue-500 text-white border-none';
      return 'bg-gray-600 text-white border-none';
    }
    
    if (creditCost >= 5) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (creditCost >= 3) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        className={cn(
          "flex items-center gap-1 font-medium transition-all duration-200",
          getVariantClass()
        )}
      >
        {getIcon()}
        {creditCost} credit{creditCost !== 1 ? 's' : ''}
      </Badge>
      
      {showPreview && creditCost >= 5 && (
        <Badge variant="outline" className="text-xs">
          Premium
        </Badge>
      )}
    </div>
  );
};
