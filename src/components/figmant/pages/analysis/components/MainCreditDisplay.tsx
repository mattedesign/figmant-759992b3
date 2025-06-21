
import React from 'react';
import { DynamicCreditDisplay } from './DynamicCreditDisplay';
import { useSelectedTemplate } from '@/contexts/SelectedTemplateContext';
import { useSelectedTemplateCost } from '@/hooks/premium-analysis/useSelectedTemplateCost';

interface MainCreditDisplayProps {
  className?: string;
}

export const MainCreditDisplay: React.FC<MainCreditDisplayProps> = ({ className }) => {
  const { selectedTemplateId } = useSelectedTemplate();
  const { creditCost, isLoading } = useSelectedTemplateCost(selectedTemplateId);

  return (
    <DynamicCreditDisplay
      creditCost={creditCost}
      isLoading={isLoading}
      className={className}
      showIcon={true}
    />
  );
};
