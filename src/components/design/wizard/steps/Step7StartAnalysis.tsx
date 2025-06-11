
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WizardData } from '../types';

interface Step7StartAnalysisProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step7StartAnalysis: React.FC<Step7StartAnalysisProps> = ({
  data,
  onUpdate
}) => {
  const totalItems = data.selectedFiles.length + data.urls.filter(url => url.trim() !== '').length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Ready to Start Analysis</h2>
        <p className="text-muted-foreground">
          Click "Start Analysis" to begin processing your {totalItems} item(s)
        </p>
      </div>

      {data.submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {data.submitError}
          </AlertDescription>
        </Alert>
      )}

      {data.isSubmitting && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Uploading your files and starting analysis...
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          What happens next:
        </div>
        <ul className="text-sm text-muted-foreground space-y-2 ml-6">
          <li>• Your files will be uploaded to secure storage</li>
          <li>• AI analysis will begin automatically</li>
          <li>• You'll be redirected to the processing page</li>
          <li>• Results will be available in your analysis history</li>
          {data.analysisPreferences.auto_comparative && totalItems > 1 && (
            <li>• Comparative analysis will be performed automatically</li>
          )}
        </ul>
      </div>
    </div>
  );
};
