
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { WizardHeader } from './WizardHeader';
import { WizardSteps } from './WizardSteps';
import { WizardContent } from './WizardContent';
import { WizardNavigation } from './WizardNavigation';
import { useWizardState } from './useWizardState';

export const DesignWizardUploader = () => {
  const {
    currentStep,
    wizardData,
    canProceed,
    isComplete,
    nextStep,
    prevStep,
    updateData,
    resetWizard,
    submitWizard
  } = useWizardState();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WizardHeader 
        currentStep={currentStep} 
        isComplete={isComplete}
        onReset={resetWizard}
      />
      
      <Card className="p-6">
        <WizardSteps currentStep={currentStep} />
        
        <div className="mt-8">
          <WizardContent
            currentStep={currentStep}
            data={wizardData}
            onUpdateData={updateData}
          />
        </div>
        
        <WizardNavigation
          currentStep={currentStep}
          canProceed={canProceed}
          isComplete={isComplete}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={submitWizard}
        />
      </Card>
    </div>
  );
};
