
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, X, Plus, Loader2 } from 'lucide-react';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { DesignBatchAnalysis } from '@/types/design';
import { useToast } from '@/hooks/use-toast';

interface ContinueAnalysisUploaderProps {
  batchAnalysis: DesignBatchAnalysis;
  onAnalysisStarted?: () => void;
}

export const ContinueAnalysisUploader = ({ batchAnalysis, onAnalysisStarted }: ContinueAnalysisUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: uploadBatch, isPending } = useBatchUploadDesign();
  const { toast } = useToast();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinueAnalysis = () => {
    if (selectedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files Selected",
        description: "Please select at least one file to continue the analysis.",
      });
      return;
    }

    const batchName = `${batchAnalysis.batch_id.slice(0, 8)} - Continuation`;
    
    uploadBatch({
      batchName,
      files: selectedFiles,
      urls: [],
      contextFiles: [],
      useCase: 'continuation-analysis', // We'll need to create this use case or use existing one
      analysisGoals: `Continue analysis from previous batch: ${batchAnalysis.id}`,
      analysisPreferences: {
        auto_comparative: true,
        context_integration: true,
        analysis_depth: 'detailed'
      }
    }, {
      onSuccess: () => {
        setSelectedFiles([]);
        setIsExpanded(false);
        onAnalysisStarted?.();
        toast({
          title: "Analysis Continued",
          description: "Additional screenshots uploaded successfully. Analysis is starting...",
        });
      }
    });
  };

  if (!isExpanded) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Continue Analysis</p>
                <p className="text-sm text-blue-700">Upload additional screenshots to extend this analysis</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsExpanded(true)}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Add Screenshots
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Continue Analysis
            </CardTitle>
            <CardDescription>
              Upload additional screenshots to extend this batch analysis
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setIsExpanded(false);
              setSelectedFiles([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${selectedFiles.length > 0 ? 'border-green-500 bg-green-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm mb-2">
            {isDragActive
              ? 'Drop your additional screenshots here'
              : 'Drag & drop additional screenshots, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: PNG, JPG, PDF (max 10MB each)
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Additional Files ({selectedFiles.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  <FileImage className="h-3 w-3 mr-1" />
                  {file.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleContinueAnalysis}
            disabled={selectedFiles.length === 0 || isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting Analysis...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Continue Analysis ({selectedFiles.length} files)
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsExpanded(false);
              setSelectedFiles([]);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload additional screenshots or designs</li>
            <li>Analysis will include both original and new files</li>
            <li>Results will be delivered to your dashboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
