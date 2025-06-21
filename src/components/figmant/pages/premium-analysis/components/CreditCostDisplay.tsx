
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreditCostDisplayProps {
  templateId: string;
  isSelected?: boolean;
}

const fetchTemplateCreditCost = async (templateId: string) => {
  const { data, error } = await supabase
    .from('claude_prompt_examples')
    .select('credit_cost')
    .eq('id', templateId)
    .single();
  
  if (error) throw error;
  return data.credit_cost || 3;
};

export const CreditCostDisplay = ({ templateId, isSelected = false }: CreditCostDisplayProps) => {
  const { data: creditCost, isLoading } = useQuery({
    queryKey: ['template-credit-cost', templateId],
    queryFn: () => fetchTemplateCreditCost(templateId),
    enabled: !!templateId
  });

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Loading...
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isSelected ? "default" : "outline"} 
      className={`flex items-center gap-1 ${
        isSelected ? 'bg-blue-100 text-blue-800 border-blue-200' : ''
      }`}
    >
      <CreditCard className="h-3 w-3" />
      {creditCost || 3} credits
    </Badge>
  );
};
