
import React from 'react';
import { PremiumAnalysisTabController } from './premium-analysis/PremiumAnalysisTabController';

export const WizardPage: React.FC = () => {
  console.log('🧙 WIZARD ANALYSIS PAGE - Rendering wizard analysis system');

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wizard Analysis</h1>
            <p className="text-gray-600 mt-1">Guided step-by-step design analysis wizard</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <PremiumAnalysisTabController />
      </div>
    </div>
  );
};
