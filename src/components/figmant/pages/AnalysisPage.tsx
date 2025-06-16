
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { AnalysisChatPanel } from './analysis/AnalysisChatPanel';
import { PromptTemplateSelector } from './analysis/PromptTemplateSelector';
import { useChatState } from './analysis/ChatStateManager';

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
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);
  const isMobile = useIsMobile();

  // Handle template from navigation
  useEffect(() => {
    if (selectedTemplate) {
      setSelectedPromptCategory(selectedTemplate.category);
      setSelectedPromptTemplate(selectedTemplate.id);
    }
  }, [selectedTemplate, setSelectedPromptCategory, setSelectedPromptTemplate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'competitor': return 'bg-blue-100 text-blue-800';
      case 'visual_hierarchy': return 'bg-green-100 text-green-800';
      case 'copy_messaging': return 'bg-orange-100 text-orange-800';
      case 'ecommerce_revenue': return 'bg-emerald-100 text-emerald-800';
      case 'ab_testing': return 'bg-pink-100 text-pink-800';
      case 'premium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAnalysisComplete = (analysisResult: any) => {
    setLastAnalysisResult(analysisResult);
  };

  const clearTemplateSelection = () => {
    setSelectedPromptCategory('');
    setSelectedPromptTemplate('');
  };

  const currentTemplate = promptTemplates?.find(t => t.id === selectedPromptTemplate);

  if (isMobile) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold">Analysis</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered design insights
              </p>
            </div>
          </div>

          {/* Template Selection - Collapsible on Mobile */}
          <div className="space-y-3">
            <PromptTemplateSelector
              promptTemplates={promptTemplates}
              promptsLoading={promptsLoading}
              selectedPromptCategory={selectedPromptCategory}
              selectedPromptTemplate={selectedPromptTemplate}
              onPromptCategoryChange={setSelectedPromptCategory}
              onPromptTemplateChange={setSelectedPromptTemplate}
              bestPrompt={bestPrompt}
            />

            {/* Selected Template Display - Compact Mobile */}
            {currentTemplate && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                      <CardTitle className="text-sm truncate">
                        {currentTemplate.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowTemplateDetails(!showTemplateDetails)}
                        className="h-6 w-6 p-0"
                      >
                        {showTemplateDetails ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearTemplateSelection}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {showTemplateDetails && (
                  <CardContent className="pt-0">
                    {currentTemplate.description && (
                      <CardDescription className="text-xs mb-2">
                        {currentTemplate.description}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${getCategoryColor(currentTemplate.category)} text-xs`}>
                        {currentTemplate.category.replace('_', ' ')}
                      </Badge>
                      {currentTemplate.effectiveness_rating && (
                        <Badge variant="secondary" className="text-xs">
                          Rating: {currentTemplate.effectiveness_rating}/10
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <AnalysisChatPanel
            message={message}
            setMessage={setMessage}
            messages={messages}
            setMessages={setMessages}
            attachments={attachments}
            setAttachments={setAttachments}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            showUrlInput={showUrlInput}
            setShowUrlInput={setShowUrlInput}
            selectedPromptTemplate={currentTemplate}
            selectedPromptCategory={selectedPromptCategory}
            promptTemplates={promptTemplates}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Design Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your designs with AI-powered insights
            </p>
          </div>
        </div>

        {/* Template Selection Section */}
        <div className="space-y-4">
          <PromptTemplateSelector
            promptTemplates={promptTemplates}
            promptsLoading={promptsLoading}
            selectedPromptCategory={selectedPromptCategory}
            selectedPromptTemplate={selectedPromptTemplate}
            onPromptCategoryChange={setSelectedPromptCategory}
            onPromptTemplateChange={setSelectedPromptTemplate}
            bestPrompt={bestPrompt}
          />

          {/* Selected Template Display */}
          {currentTemplate && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Active Template: {currentTemplate.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearTemplateSelection}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {currentTemplate.description && (
                  <CardDescription>
                    {currentTemplate.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(currentTemplate.category)}>
                    {currentTemplate.category.replace('_', ' ')}
                  </Badge>
                  {currentTemplate.effectiveness_rating && (
                    <Badge variant="secondary">
                      Rating: {currentTemplate.effectiveness_rating}/10
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <AnalysisChatPanel
          message={message}
          setMessage={setMessage}
          messages={messages}
          setMessages={setMessages}
          attachments={attachments}
          setAttachments={setAttachments}
          urlInput={urlInput}
          setUrlInput={setUrlInput}
          showUrlInput={showUrlInput}
          setShowUrlInput={setShowUrlInput}
          selectedPromptTemplate={currentTemplate}
          selectedPromptCategory={selectedPromptCategory}
          promptTemplates={promptTemplates}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  );
};
