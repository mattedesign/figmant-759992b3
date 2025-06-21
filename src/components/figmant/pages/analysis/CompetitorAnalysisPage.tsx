
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompetitorAnalysisPanel } from '@/components/competitor/CompetitorAnalysisPanel';
import { CompetitorTemplateSelector } from './components/CompetitorTemplateSelector';
import { CompetitorAnalysisData } from '@/hooks/useCompetitorAnalysis';
import { FigmantPromptTemplate } from '@/types/figmant';
import { useIsMobile } from '@/hooks/use-mobile';
import { Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AnalysisStep = 'template-selection' | 'competitor-analysis' | 'results';

export const CompetitorAnalysisPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<FigmantPromptTemplate | null>(null);
  const [templateContext, setTemplateContext] = useState<Record<string, any>>({});
  const [analysisResults, setAnalysisResults] = useState<CompetitorAnalysisData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMobile = useIsMobile();

  const handleTemplateSelect = (template: FigmantPromptTemplate, context: Record<string, any>) => {
    console.log('Template selected:', template.displayName, 'with context:', context);
    setSelectedTemplate(template);
    setTemplateContext(context);
    setCurrentStep('competitor-analysis');
  };

  const handleAnalysisComplete = (results: CompetitorAnalysisData[]) => {
    setAnalysisResults(results);
    setCurrentStep('results');
    setIsAnalyzing(false);
    console.log('Competitor analysis completed:', results);
  };

  const handleBackToTemplates = () => {
    setCurrentStep('template-selection');
    setSelectedTemplate(null);
    setTemplateContext({});
    setAnalysisResults([]);
  };

  const handleBackToAnalysis = () => {
    setCurrentStep('competitor-analysis');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'template-selection':
        return (
          <CompetitorTemplateSelector 
            onTemplateSelect={handleTemplateSelect}
            isAnalyzing={isAnalyzing}
          />
        );

      case 'competitor-analysis':
        return (
          <div className="space-y-6">
            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTemplate?.displayName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter competitor URLs to analyze with your selected template
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleBackToTemplates}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Template
              </Button>
            </div>

            {/* Template Context Summary */}
            {Object.keys(templateContext).length > 0 && (
              <Card className="bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Analysis Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {Object.entries(templateContext).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Competitor Analysis Panel */}
            <CompetitorAnalysisPanel 
              onAnalysisComplete={handleAnalysisComplete}
              selectedTemplate={selectedTemplate}
              templateContext={templateContext}
            />
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Analysis Complete
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate?.displayName} results ready
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackToAnalysis}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Analysis
                </Button>
                <Button variant="outline" onClick={handleBackToTemplates}>
                  New Analysis
                </Button>
              </div>
            </div>

            {/* Analysis Results Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResults.length}
                      </div>
                      <div className="text-sm text-blue-700">Competitors Analyzed</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analysisResults.filter(r => r.status === 'completed').length}
                      </div>
                      <div className="text-sm text-green-700">Successful Captures</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysisResults.filter(r => r.screenshots?.desktop?.success || r.screenshots?.mobile?.success).length}
                      </div>
                      <div className="text-sm text-yellow-700">Screenshots Captured</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Analysis completed using <strong>{selectedTemplate?.displayName}</strong> template. 
                    Use the chat interface to get AI-powered insights about your competitors' design strategies and market positioning.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0 border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Competitor Analysis
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              {currentStep === 'template-selection' && 'Choose your analysis approach and get competitor insights'}
              {currentStep === 'competitor-analysis' && 'Analyze competitor websites to gain market positioning insights'}
              {currentStep === 'results' && 'Review your competitor analysis results and insights'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};
