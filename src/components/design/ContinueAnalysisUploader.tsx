
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { DesignBatchAnalysis } from '@/types/design';
import { FileUploadSection } from './uploader/FileUploadSection';

interface ContinueAnalysisUploaderProps {
  batchAnalysis: DesignBatchAnalysis;
  onAnalysisStarted?: () => void;
}

export const ContinueAnalysisUploader = ({ 
  batchAnalysis, 
  onAnalysisStarted 
}: ContinueAnalysisUploaderProps) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [analysisGoals, setAnalysisGoals] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const batchUpload = useBatchUploadDesign();

  const handleContinueAnalysis = async () => {
    if (newFiles.length === 0) return;

    const continuationGoals = analysisGoals || `Continue analysis from batch ${batchAnalysis.batch_id} with additional screenshots`;

    await batchUpload.mutateAsync({
      files: newFiles,
      urls: [],
      contextFiles: [],
      useCase: 'continuation-analysis',
      batchName: `Continuation - ${new Date().toLocaleDateString()}`,
      analysisGoals: continuationGoals,
      analysisPreferences: {
        auto_comparative: true,
        context_integration: true,
        analysis_depth: 'detailed'
      }
    });

    // Reset form
    setNewFiles([]);
    setAnalysisGoals('');
    setIsExpanded(false);
    
    if (onAnalysisStarted) {
      onAnalysisStarted();
    }
  };

  if (!isExpanded) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25 bg-muted/10">
        <CardContent className="py-6">
          <div className="text-center">
            <Plus className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">Add More Screenshots</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload additional designs to extend this analysis with deeper insights
            </p>
            <Button 
              onClick={() => setIsExpanded(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Continue Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Continue Analysis
        </CardTitle>
        <CardDescription>
          Add more screenshots to extend your batch analysis with additional insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUploadSection
          selectedFiles={newFiles}
          setSelectedFiles={setNewFiles}
        />

        <div className="space-y-2">
          <Label htmlFor="continuation-goals">
            Analysis Goals for New Screenshots (Optional)
          </Label>
          <Textarea
            id="continuation-goals"
            placeholder="Describe what specific insights you want from these additional screenshots..."
            value={analysisGoals}
            onChange={(e) => setAnalysisGoals(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleContinueAnalysis}
            disabled={newFiles.length === 0 || batchUpload.isPending}
            className="flex-1"
          >
            {batchUpload.isPending ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze {newFiles.length} New Screenshot(s)
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(false)}
            disabled={batchUpload.isPending}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
