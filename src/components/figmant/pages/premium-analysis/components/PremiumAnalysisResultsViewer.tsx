
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { isPremiumAnalysis, getAnalysisValue } from '@/hooks/premium-analysis/creditCostManager';
import { Diamond, FileText, Calendar, TrendingUp, Download, ExternalLink } from 'lucide-react';

interface PremiumAnalysisResultsViewerProps {
  analysisResults: any;
  selectedTemplate: any;
  className?: string;
}

export const PremiumAnalysisResultsViewer: React.FC<PremiumAnalysisResultsViewerProps> = ({
  analysisResults,
  selectedTemplate,
  className = ""
}) => {
  const isPremium = selectedTemplate && isPremiumAnalysis(selectedTemplate.id);
  const analysisValue = selectedTemplate ? getAnalysisValue(selectedTemplate.id) : '$197';

  if (!analysisResults) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {isPremium && (
        <Card className="border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Diamond className="h-6 w-6 text-amber-600" />
                <div>
                  <CardTitle className="text-lg text-amber-800">
                    Premium Competitive Intelligence Analysis
                  </CardTitle>
                  <p className="text-sm text-amber-700 mt-1">
                    Strategic business insights with market positioning analysis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white mb-2">
                  Strategic Analysis Value: {analysisValue}
                </Badge>
                <div className="text-xs text-amber-600">
                  Premium Report Generated
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {analysisResults.analysis || analysisResults.response}
            </div>
          </div>
        </CardContent>
      </Card>

      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Diamond className="h-5 w-5 text-amber-600" />
              Premium Action Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={() => {
                  // Implementation for report export
                  console.log('Exporting strategic report...');
                }}
              >
                <FileText className="h-4 w-4" />
                Export Strategic Report
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={() => {
                  // Implementation for scheduling consultation
                  console.log('Scheduling strategy call...');
                }}
              >
                <Calendar className="h-4 w-4" />
                Schedule Strategy Call
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-12"
                onClick={() => {
                  // Implementation for downloading detailed analysis
                  const element = document.createElement('a');
                  const file = new Blob([analysisResults.analysis || analysisResults.response], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = `competitive-intelligence-${Date.now()}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
              >
                <Download className="h-4 w-4" />
                Download Analysis
              </Button>
              
              <Button 
                variant="default" 
                className="flex items-center gap-2 h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                onClick={() => {
                  // Implementation for opening implementation guide
                  window.open('/figmant/implementation-guide', '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Implementation Guide
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">What's Included in Premium Analysis:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>✨ <strong>Strategic Market Positioning:</strong> Competitive landscape mapping and differentiation opportunities</li>
                <li>📊 <strong>Revenue Impact Predictions:</strong> Estimated business outcomes and conversion improvements</li>
                <li>🛣️ <strong>8-Week Implementation Roadmap:</strong> Step-by-step execution plan with priorities</li>
                <li>💰 <strong>Messaging Framework:</strong> A/B testing recommendations and pricing psychology insights</li>
                <li>🎯 <strong>Competitive Response Strategy:</strong> How to position against direct competitors</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
