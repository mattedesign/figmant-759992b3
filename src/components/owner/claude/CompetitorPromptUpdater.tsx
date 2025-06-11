
import React from 'react';
import { Target } from 'lucide-react';
import { PromptUpdaterCard } from './PromptUpdaterCard';

export const CompetitorPromptUpdater: React.FC = () => {
  return (
    <PromptUpdaterCard 
      templateId="competitor-analysis"
      icon={Target}
      accentColor="green"
    />
  );
};
