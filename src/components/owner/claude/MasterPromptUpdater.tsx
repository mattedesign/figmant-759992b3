
import React from 'react';
import { Zap } from 'lucide-react';
import { PromptUpdaterCard } from './PromptUpdaterCard';

export const MasterPromptUpdater: React.FC = () => {
  return (
    <PromptUpdaterCard 
      templateId="master-ux"
      icon={Zap}
      accentColor="blue"
    />
  );
};
