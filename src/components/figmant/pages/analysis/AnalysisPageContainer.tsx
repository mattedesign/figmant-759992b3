
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisNavigationHeader } from './components/AnalysisNavigationHeader';
import { EmptyAnalysisState } from './components/EmptyAnalysisState';
import { useTemplateCreditStore } from '@/stores/templateCreditStore';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({ 
  selectedTemplate 
}) => {
  const isMobile = useIsMobile();
  const { currentCreditCost, setTemplateCreditCost, resetCreditCost } = useTemplateCreditStore();
  
  // Force empty analyses to show "Start your analysis" state
  const [analyses] = useState([]); // Always empty for now
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');

  useEffect(() => {
    // Simulate loading then show empty state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Reset credit cost when leaving the page
  useEffect(() => {
    return () => {
      resetCreditCost();
    };
  }, [resetCreditCost]);

  const handleTemplateSelect = async (templateId: string) => {
    console.log('Template selected:', templateId);
    
    // Set the selected template
    setSelectedPromptTemplate(templateId);
    
    // Fetch credit cost from database and update global store
    try {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('credit_cost')
        .eq('id', templateId)
        .single();
      
      if (error) {
        console.error('Error fetching credit cost:', error);
        setTemplateCreditCost(templateId, 3); // Fallback
      } else {
        const creditCost = data.credit_cost || 3;
        console.log('Credit cost fetched:', creditCost);
        setTemplateCreditCost(templateId, creditCost);
      }
    } catch (error) {
      console.error('Error in handleTemplateSelect:', error);
      setTemplateCreditCost(templateId, 3); // Fallback
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <AnalysisNavigationHeader creditCost={currentCreditCost} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Always show "Start your analysis" content for both mobile and desktop
  return (
    <div className="h-full flex flex-col">
      <AnalysisNavigationHeader creditCost={currentCreditCost} />
      <EmptyAnalysisState 
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};
