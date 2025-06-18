
import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CompleteStateProps {
  selectedTemplateTitle?: string;
  analysisResult: string;
  onViewInAnalysis: () => void;
  onBackToAnalysis: () => void;
}

export const CompleteState: React.FC<CompleteStateProps> = ({
  selectedTemplateTitle,
  analysisResult,
  onViewInAnalysis,
  onBackToAnalysis
}) => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex-shrink-0 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-green-600">Premium Analysis Complete!</h3>
          <p className="text-gray-600">
            Your comprehensive {selectedTemplateTitle} analysis is ready
          </p>
        </div>
      </div>
      
      {/* Scrollable Analysis Results */}
      <div className="flex-1 min-h-0 bg-gray-50 border rounded-lg flex flex-col">
        <div className="flex-shrink-0 p-4 border-b bg-white rounded-t-lg">
          <h4 className="font-medium">Analysis Results:</h4>
        </div>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {analysisResult}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex-shrink-0 flex gap-4 justify-center pt-4">
        <Button onClick={onViewInAnalysis} className="bg-blue-600 hover:bg-blue-700">
          View in Analysis Panel
        </Button>
        <Button variant="outline" onClick={onBackToAnalysis}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analysis
        </Button>
      </div>
    </div>
  );
};
