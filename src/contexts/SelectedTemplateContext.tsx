
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedTemplateContextType {
  selectedTemplateId: string | null;
  selectedTemplateCost: number;
  setSelectedTemplate: (templateId: string | null, creditCost?: number) => void;
  clearSelection: () => void;
}

const SelectedTemplateContext = createContext<SelectedTemplateContextType | undefined>(undefined);

export const useSelectedTemplate = () => {
  const context = useContext(SelectedTemplateContext);
  if (!context) {
    throw new Error('useSelectedTemplate must be used within a SelectedTemplateProvider');
  }
  return context;
};

interface SelectedTemplateProviderProps {
  children: ReactNode;
}

export const SelectedTemplateProvider: React.FC<SelectedTemplateProviderProps> = ({
  children
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplateCost, setSelectedTemplateCost] = useState<number>(1);

  const setSelectedTemplate = (templateId: string | null, creditCost: number = 1) => {
    setSelectedTemplateId(templateId);
    setSelectedTemplateCost(creditCost);
  };

  const clearSelection = () => {
    setSelectedTemplateId(null);
    setSelectedTemplateCost(1);
  };

  return (
    <SelectedTemplateContext.Provider
      value={{
        selectedTemplateId,
        selectedTemplateCost,
        setSelectedTemplate,
        clearSelection
      }}
    >
      {children}
    </SelectedTemplateContext.Provider>
  );
};
