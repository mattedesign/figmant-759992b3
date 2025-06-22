
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, Download, Loader2 } from 'lucide-react';
import { ExportOptions, ExportShareService } from '@/services/exportShareService';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';
import { StepData } from '../types';
import { useToast } from '@/hooks/use-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: ContextualAnalysisResult;
  stepData: StepData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  stepData
}) => {
  const [format, setFormat] = useState<ExportOptions['format']>('pdf');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', description: 'Formatted report ready for printing' },
    { value: 'json', label: 'JSON Data', description: 'Complete data export for developers' },
    { value: 'csv', label: 'CSV Spreadsheet', description: 'Recommendations in spreadsheet format' },
    { value: 'markdown', label: 'Markdown', description: 'Text format for documentation' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportOptions: ExportOptions = {
        format,
        includeAttachments,
        includeMetrics,
        includeRecommendations
      };

      const result = await ExportShareService.exportAnalysis(
        analysisResult,
        stepData,
        exportOptions
      );

      if (result.success) {
        if (result.data && format !== 'pdf') {
          const filename = `${stepData.projectName}-analysis-${new Date().toISOString().split('T')[0]}.${format}`;
          ExportShareService.downloadFile(result.data as Blob, filename);
        }
        
        toast({
          title: "Export Successful",
          description: `Analysis exported as ${format.toUpperCase()} format.`,
        });
        onClose();
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Export Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportOptions['format'])}>
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Include in Export</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommendations" 
                  checked={includeRecommendations}
                  onCheckedChange={setIncludeRecommendations}
                />
                <Label htmlFor="recommendations" className="text-sm cursor-pointer">
                  Recommendations ({analysisResult.recommendations.length})
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metrics" 
                  checked={includeMetrics}
                  onCheckedChange={setIncludeMetrics}
                />
                <Label htmlFor="metrics" className="text-sm cursor-pointer">
                  Analysis Metrics & Summary
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="attachments" 
                  checked={includeAttachments}
                  onCheckedChange={setIncludeAttachments}
                />
                <Label htmlFor="attachments" className="text-sm cursor-pointer">
                  File Information ({analysisResult.attachments.length})
                </Label>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Project:</strong> {stepData.projectName}<br />
              <strong>Recommendations:</strong> {analysisResult.recommendations.length}<br />
              <strong>Files:</strong> {analysisResult.attachments.length}<br />
              <strong>Format:</strong> {formatOptions.find(f => f.value === format)?.label}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
