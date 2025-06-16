
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { useChatState } from './analysis/ChatStateManager';
import { useCategoryColors } from './analysis/useCategoryColors';
import { MobileAnalysisLayout } from './analysis/MobileAnalysisLayout';
import { AnalysisListSidebar } from './analysis/AnalysisListSidebar';
import { AnalysisChatPanel } from './analysis/AnalysisChatPanel';
import { AnalysisDynamicRightPanel } from './analysis/AnalysisDynamicRightPanel';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    selectedPromptCategory,
    setSelectedPromptCategory,
    selectedPromptTemplate,
    setSelectedPromptTemplate,
    showUrlInput,
    setShowUrlInput,
    urlInput,
    setUrlInput
  } = useChatState();

  const { data: promptTemplates, isLoading: promptsLoading } = useFigmantPromptTemplates();
  const { data: bestPrompt } = useBestFigmantPrompt(selectedPromptCategory);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<any>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'templates' | 'analysis'>('templates');
  const [showAnalysisDetail, setShowAnalysisDetail] = useState(false);
  const { getCategoryColor } = useCategoryColors();
  const isMobile = useIsMobile();

  // Handle template from navigation
  useEffect(() => {
    if (selectedTemplate) {
      setSelectedPromptCategory(selectedTemplate.category);
      setSelectedPromptTemplate(selectedTemplate.id);
    }
  }, [selectedTemplate, setSelectedPromptCategory, setSelectedPromptTemplate]);

  // Switch to analysis mode when analysis starts or completes
  useEffect(() => {
    if (messages.length > 0 || lastAnalysisResult) {
      setRightPanelMode('analysis');
    } else {
      setRightPanelMode('templates');
    }
  }, [messages.length, lastAnalysisResult]);

  const handleAnalysisComplete = (analysisResult: any) => {
    setLastAnalysisResult(analysisResult);
    setRightPanelMode('analysis');
  };

  const handleAnalysisSelect = (analysis: any) => {
    setSelectedAnalysis(analysis);
  };

  const handlePromptTemplateSelect = (templateId: string) => {
    setSelectedPromptTemplate(templateId);
    const template = promptTemplates?.find(t => t.id === templateId);
    if (template) {
      setSelectedPromptCategory(template.category);
    }
  };

  const handleAnalysisDetailClick = () => {
    setShowAnalysisDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowAnalysisDetail(false);
  };

  const clearTemplateSelection = () => {
    setSelectedPromptCategory('');
    setSelectedPromptTemplate('');
  };

  const currentTemplate = promptTemplates?.find(t => t.id === selectedPromptTemplate);
  const currentAnalysis = lastAnalysisResult || {
    title: 'Current Analysis',
    status: messages.length > 0 ? 'In Progress' : 'Ready',
    score: lastAnalysisResult?.score
  };

  // Common chat panel props
  const chatPanelProps = {
    message,
    setMessage,
    messages,
    setMessages,
    attachments,
    setAttachments,
    urlInput,
    setUrlInput,
    showUrlInput,
    setShowUrlInput,
    selectedPromptTemplate: currentTemplate,
    selectedPromptCategory,
    promptTemplates,
    onAnalysisComplete: handleAnalysisComplete
  };

  if (isMobile) {
    return (
      <MobileAnalysisLayout
        promptTemplates={promptTemplates}
        promptsLoading={promptsLoading}
        selectedPromptCategory={selectedPromptCategory}
        selectedPromptTemplate={selectedPromptTemplate}
        onPromptCategoryChange={setSelectedPromptCategory}
        onPromptTemplateChange={setSelectedPromptTemplate}
        bestPrompt={bestPrompt}
        currentTemplate={currentTemplate}
        showTemplateDetails={false}
        onToggleTemplateDetails={() => {}}
        onClearTemplateSelection={clearTemplateSelection}
        getCategoryColor={getCategoryColor}
        chatPanelProps={chatPanelProps}
      />
    );
  }

  if (showAnalysisDetail) {
    return (
      <div className="h-full flex">
        <AnalysisListSidebar 
          selectedAnalysis={selectedAnalysis}
          onAnalysisSelect={handleAnalysisSelect}
        />
        <div className="flex-1 p-6">
          <div className="mb-4">
            <button 
              onClick={handleBackFromDetail}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ← Back to Analysis
            </button>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Analysis Results</h3>
                <p className="text-gray-600 mt-2">
                  Detailed analysis results would be displayed here...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout with new structure
  return (
    <div className="h-full flex">
      <AnalysisListSidebar 
        selectedAnalysis={selectedAnalysis}
        onAnalysisSelect={handleAnalysisSelect}
      />
      
      <div className="flex-1 flex min-w-0">
        <div className="flex-1 min-w-0">
          <AnalysisChatPanel {...chatPanelProps} />
        </div>
        
        <div className="w-80 flex-shrink-0">
          <AnalysisDynamicRightPanel
            mode={rightPanelMode}
            promptTemplates={promptTemplates}
            selectedPromptCategory={selectedPromptCategory}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptTemplateSelect={handlePromptTemplateSelect}
            onPromptCategoryChange={setSelectedPromptCategory}
            currentAnalysis={currentAnalysis}
            attachments={attachments}
            onAnalysisClick={handleAnalysisDetailClick}
            onBackClick={rightPanelMode === 'analysis' ? () => setRightPanelMode('templates') : undefined}
          />
        </div>
      </div>
    </div>
  );
};
