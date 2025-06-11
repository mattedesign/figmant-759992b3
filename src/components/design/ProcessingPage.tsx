
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';

export const ProcessingPage = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();
  const [processingStage, setProcessingStage] = useState('uploading');
  const [progress, setProgress] = useState(10);
  
  const { data: allUploads = [] } = useDesignUploads();
  const { data: batchAnalyses = [] } = useDesignBatchAnalyses();
  
  const batchUploads = allUploads.filter(upload => upload.batch_id === batchId);
  const batchAnalysis = batchAnalyses.find(analysis => analysis.batch_id === batchId);
  
  const completedUploads = batchUploads.filter(upload => upload.status === 'completed');
  const failedUploads = batchUploads.filter(upload => upload.status === 'failed');
  const totalUploads = batchUploads.length;
  
  const allUploadsCompleted = totalUploads > 0 && completedUploads.length === totalUploads;
  const hasFailures = failedUploads.length > 0;
  const analysisComplete = !!batchAnalysis;

  useEffect(() => {
    if (totalUploads === 0) {
      setProcessingStage('uploading');
      setProgress(10);
    } else if (!allUploadsCompleted) {
      setProcessingStage('analyzing');
      const uploadProgress = (completedUploads.length / totalUploads) * 70;
      setProgress(30 + uploadProgress);
    } else if (allUploadsCompleted && !analysisComplete) {
      setProcessingStage('batch-analysis');
      setProgress(85);
    } else if (analysisComplete) {
      setProcessingStage('complete');
      setProgress(100);
    }
  }, [totalUploads, completedUploads.length, allUploadsCompleted, analysisComplete]);

  const getStageInfo = () => {
    switch (processingStage) {
      case 'uploading':
        return {
          title: 'Uploading Designs',
          description: 'Your design files are being uploaded and processed...',
          icon: <Clock className="h-5 w-5 animate-spin" />
        };
      case 'analyzing':
        return {
          title: 'Analyzing Individual Designs',
          description: `Analyzing ${completedUploads.length} of ${totalUploads} designs...`,
          icon: <Clock className="h-5 w-5 animate-spin" />
        };
      case 'batch-analysis':
        return {
          title: 'Running Comparative Analysis',
          description: 'Comparing designs and generating insights...',
          icon: <Clock className="h-5 w-5 animate-spin" />
        };
      case 'complete':
        return {
          title: 'Analysis Complete!',
          description: 'Your design analysis is ready to view.',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />
        };
      default:
        return {
          title: 'Processing',
          description: 'Please wait...',
          icon: <Clock className="h-5 w-5 animate-spin" />
        };
    }
  };

  const stageInfo = getStageInfo();

  const handleViewResults = () => {
    if (batchAnalysis) {
      navigate('/dashboard', { 
        state: { 
          viewBatchAnalysis: batchAnalysis 
        } 
      });
    } else if (batchUploads.length === 1) {
      navigate('/dashboard', { 
        state: { 
          viewUpload: batchUploads[0] 
        } 
      });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            {stageInfo.icon}
            <div>
              <CardTitle>{stageInfo.title}</CardTitle>
              <CardDescription>{stageInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Upload Status */}
          {totalUploads > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{totalUploads}</p>
                <p className="text-sm text-muted-foreground">Total Designs</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{completedUploads.length}</p>
                <p className="text-sm text-green-700">Analyzed</p>
              </div>
              {hasFailures && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{failedUploads.length}</p>
                  <p className="text-sm text-red-700">Failed</p>
                </div>
              )}
            </div>
          )}

          {/* Individual Upload Status */}
          {batchUploads.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Design Status</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {batchUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm truncate flex-1">{upload.file_name}</span>
                    <Badge variant={
                      upload.status === 'completed' ? 'default' :
                      upload.status === 'failed' ? 'destructive' :
                      'secondary'
                    }>
                      {upload.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Messages */}
          {hasFailures && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm font-medium text-red-800">
                  Some designs failed to analyze
                </p>
              </div>
              <p className="text-sm text-red-700 mt-1">
                You can still view results for the successful analyses.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            {processingStage === 'complete' && (
              <Button
                onClick={handleViewResults}
                className="flex-1"
              >
                View Analysis Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
