
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share, Bookmark, CheckCircle } from 'lucide-react';
import { StepData } from '../types';

interface RealAnalysisResultsProps {
  stepData: StepData;
  analysisResult: string;
  onExport?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const RealAnalysisResults: React.FC<RealAnalysisResultsProps> = ({
  stepData,
  analysisResult,
  onExport,
  onShare,
  onSave
}) => {
  return (
    <div className="w-full min-h-full">
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-3xl font-bold text-center">Analysis Complete</h2>
        </div>
        <p className="text-center text-muted-foreground">
          Your {stepData.selectedType.replace('-', ' ')} analysis has been completed
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Analysis
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
        </div>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Premium Analysis Results
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {stepData.selectedType.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline">
                Claude AI Powered
              </Badge>
              {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 && (
                <Badge variant="outline">
                  {stepData.uploadedFiles.length} file{stepData.uploadedFiles.length !== 1 ? 's' : ''} analyzed
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {analysisResult}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Context Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Project:</span> {stepData.projectName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Analysis Type:</span> {stepData.selectedType.replace('-', ' ')}
                </p>
                {stepData.analysisGoals && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Goals:</span> {stepData.analysisGoals}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Files Analyzed</h4>
                {stepData.uploadedFiles && stepData.uploadedFiles.length > 0 ? (
                  <div className="space-y-1">
                    {stepData.uploadedFiles.map((file, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
