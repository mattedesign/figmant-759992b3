
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisPageContainerProps {
  selectedTemplate?: any;
}

export const AnalysisPageContainer: React.FC<AnalysisPageContainerProps> = ({ 
  selectedTemplate 
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Force empty analyses to show "Start your analysis" state
  const [analyses] = useState([]); // Always empty for now
  const [isLoading, setIsLoading] = useState(true);
  const [currentCreditCost, setCurrentCreditCost] = useState<number>(1);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');

  useEffect(() => {
    // Simulate loading then show empty state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTemplateSelect = async (templateId: string) => {
    console.log('Template selected:', templateId);
    
    // Set the selected template
    setSelectedPromptTemplate(templateId);
    
    // Fetch credit cost from database
    try {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('credit_cost')
        .eq('id', templateId)
        .single();
      
      if (error) {
        console.error('Error fetching credit cost:', error);
        setCurrentCreditCost(3); // Fallback
      } else {
        const creditCost = data.credit_cost || 3;
        console.log('Credit cost fetched:', creditCost);
        setCurrentCreditCost(creditCost);
      }
    } catch (error) {
      console.error('Error in handleTemplateSelect:', error);
      setCurrentCreditCost(3); // Fallback
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // ALWAYS show "Start your analysis" content for both mobile and desktop
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          {/* Icon and Header */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start your analysis</h2>
            <p className="text-gray-600 mb-6">
              Upload files, add URLs, or select a template to get started with your design analysis.
            </p>
          </div>

          {/* Files Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2 text-left">Files</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <div className="mb-2">
                <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">No files uploaded yet</p>
            </div>
          </div>

          {/* Links Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2 text-left">Links</h3>
            <div className="text-center py-3 border border-gray-200 rounded-lg">
              <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <p className="text-sm text-gray-600">No links added yet</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => {
                navigate('/figmant', { 
                  state: { 
                    activeSection: 'chat',
                    selectedTemplate: selectedTemplate 
                  } 
                });
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Upload Files
            </button>
            <button 
              onClick={() => {
                navigate('/figmant', { 
                  state: { 
                    activeSection: 'chat',
                    selectedTemplate: selectedTemplate 
                  } 
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add URL
            </button>
            <button 
              onClick={() => {
                navigate('/figmant', { 
                  state: { 
                    activeSection: 'templates'
                  } 
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Select Template
            </button>
          </div>

          {/* Chat Interface */}
          <div className="w-full">
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1 flex-1">
                  <button className="p-1 rounded text-orange-600 bg-orange-50">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">Master UX Analysis</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <button 
                  onClick={() => {
                    navigate('/figmant', { 
                      state: { 
                        activeSection: 'chat',
                        selectedTemplate: 'master_ux_analysis'
                      } 
                    });
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  Analyse
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Ask about your design using Master UX Analysis..."
                className="w-full p-2 border border-gray-300 rounded text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/figmant', { 
                      state: { 
                        activeSection: 'chat',
                        selectedTemplate: 'master_ux_analysis'
                      } 
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
