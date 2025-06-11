
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { FigmantPromptTemplate, FigmantPromptVariables } from '@/types/figmant';
import { FigmantTemplateGrid } from './FigmantTemplateGrid';
import { FigmantConfigurationForm } from './FigmantConfigurationForm';

interface AnalysisFrameworkTabsProps {
  analysisMode: 'standard' | 'figmant';
  setAnalysisMode: (mode: 'standard' | 'figmant') => void;
  selectedUseCase: string;
  setSelectedUseCase: (value: string) => void;
  selectedTemplate: FigmantPromptTemplate | null;
  onTemplateSelect: (templateId: string) => void;
  promptVariables: FigmantPromptVariables;
  onVariableChange: (key: keyof FigmantPromptVariables, value: string | string[]) => void;
  customInstructions: string;
  onCustomInstructionsChange: (value: string) => void;
}

export const AnalysisFrameworkTabs = ({
  analysisMode,
  setAnalysisMode,
  selectedUseCase,
  setSelectedUseCase,
  selectedTemplate,
  onTemplateSelect,
  promptVariables,
  onVariableChange,
  customInstructions,
  onCustomInstructionsChange
}: AnalysisFrameworkTabsProps) => {
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignUseCases();

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">Analysis Framework</Label>
      <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as 'standard' | 'figmant')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="figmant" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Figmant.ai Templates
          </TabsTrigger>
          <TabsTrigger value="standard">Standard Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="figmant" className="space-y-4">
          <FigmantTemplateGrid
            selectedTemplate={selectedTemplate}
            onTemplateSelect={onTemplateSelect}
          />

          {selectedTemplate && (
            <FigmantConfigurationForm
              selectedTemplate={selectedTemplate}
              promptVariables={promptVariables}
              onVariableChange={onVariableChange}
              customInstructions={customInstructions}
              onCustomInstructionsChange={onCustomInstructionsChange}
            />
          )}
        </TabsContent>

        <TabsContent value="standard" className="space-y-4">
          <div className="space-y-2">
            <Label>Standard Analysis Type</Label>
            <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {useCases.map((useCase) => (
                  <SelectItem key={useCase.id} value={useCase.id}>
                    <div>
                      <div className="font-medium">{useCase.name}</div>
                      <div className="text-xs text-muted-foreground">{useCase.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
