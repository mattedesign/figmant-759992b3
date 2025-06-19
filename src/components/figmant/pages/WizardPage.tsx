
import React from 'react';
import { PremiumAnalysisTabController } from './premium-analysis/PremiumAnalysisTabController';

export const WizardPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analysis Wizard</h1>
            <p className="text-gray-600 mt-1">Guided step-by-step design analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <PremiumAnalysisTabController />
      </div>
    </div>
  );
};
