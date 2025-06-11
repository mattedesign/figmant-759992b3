
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, Cpu, Cloud, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FallbackMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  estimatedTime: string;
  qualityImpact: 'none' | 'minimal' | 'moderate' | 'significant';
  reliabilityScore: number;
}

interface FallbackImageProcessorProps {
  fileName: string;
  fileSize: number;
  originalError: string;
  onProcessWithFallback: (methodId: string, file: File) => Promise<void>;
  onCancel: () => void;
  file: File;
}

export const FallbackImageProcessor: React.FC<FallbackImageProcessorProps> = ({
  fileName,
  fileSize,
  originalError,
  onProcessWithFallback,
  onCancel,
  file
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const fallbackMethods: FallbackMethod[] = [
    {
      id: 'client-side-basic',
      name: 'Basic Client-Side Processing',
      description: 'Simple compression using canvas API with reduced quality settings',
      icon: Cpu,
      available: true,
      estimatedTime: '5-10 seconds',
      qualityImpact: 'moderate',
      reliabilityScore: 90
    },
    {
      id: 'chunked-upload',
      name: 'Chunked Upload',
      description: 'Break the image into smaller chunks for more reliable upload',
      icon: Cloud,
      available: fileSize > 5 * 1024 * 1024, // Only for files > 5MB
      estimatedTime: '10-30 seconds',
      qualityImpact: 'none',
      reliabilityScore: 85
    },
    {
      id: 'progressive-quality',
      name: 'Progressive Quality Reduction',
      description: 'Gradually reduce quality until processing succeeds',
      icon: Shield,
      available: true,
      estimatedTime: '15-45 seconds',
      qualityImpact: 'minimal',
      reliabilityScore: 95
    }
  ];

  const getQualityImpactColor = (impact: FallbackMethod['qualityImpact']) => {
    switch (impact) {
      case 'none': return 'bg-green-100 text-green-800';
      case 'minimal': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'significant': return 'bg-red-100 text-red-800';
    }
  };

  const handleMethodSelect = async (methodId: string) => {
    setSelectedMethod(methodId);
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      await onProcessWithFallback(methodId, file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Fallback Processing Successful",
        description: "Image processed using alternative method.",
      });
    } catch (error) {
      console.error('Fallback processing failed:', error);
      setIsProcessing(false);
      setProgress(0);
      
      toast({
        variant: "destructive",
        title: "Fallback Processing Failed",
        description: "All processing methods have failed. Please try a different image.",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Shield className="h-4 w-4" />
          Fallback Processing Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Original processing failed:</strong> {originalError}</p>
              <p><strong>File:</strong> {fileName} ({formatFileSize(fileSize)})</p>
              <p>Please select an alternative processing method below.</p>
            </div>
          </AlertDescription>
        </Alert>

        {isProcessing && selectedMethod && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">
                Processing with {fallbackMethods.find(m => m.id === selectedMethod)?.name}...
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              This may take longer than usual due to the fallback method.
            </p>
          </div>
        )}

        {!isProcessing && (
          <div className="space-y-3">
            {fallbackMethods.filter(method => method.available).map(method => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getQualityImpactColor(method.qualityImpact)}>
                        {method.qualityImpact} impact
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {method.reliabilityScore}% reliable
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Estimated time: {method.estimatedTime}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          {progress === 100 && (
            <Button className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3" />
              Processing Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
