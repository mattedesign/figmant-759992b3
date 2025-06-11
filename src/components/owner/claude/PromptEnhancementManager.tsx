
import React from 'react';
import { MasterPromptUpdater } from './MasterPromptUpdater';
import { CompetitorPromptUpdater } from './CompetitorPromptUpdater';

export const PromptEnhancementManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <MasterPromptUpdater />
      <CompetitorPromptUpdater />
    </div>
  );
};
