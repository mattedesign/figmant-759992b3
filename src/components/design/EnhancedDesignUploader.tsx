import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileImage, Globe, X, Plus, Target, FileText, Settings } from 'lucide-react';
import { useDesignUseCases } from '@/hooks/useDesignUseCases';
import { useBatchUploadDesign } from '@/hooks/useBatchUploadDesign';
import { AnalysisPreferences } from '@/types/design';

export const EnhancedDesignUploader = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>(['']);
  const [batchName, setBatchName] = useState<string>('');
  const [analysisGoals, setAnalysisGoals] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'urls'>('files');
  const [analysisPreferences, setAnalysisPreferences] = useState<AnalysisPreferences>({
    auto_comparative: true,
    context_integration: true,
    analysis_depth: 'detailed'
  });
  
  const { data: useCases = [], isLoading: loadingUseCases } = useDesignUseCases();
  const batchUpload = useBatchUploadDesign();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const onContextDrop = useCallback((acceptedFiles: File[]) => {
    setContextFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const { getRootProps: getContextRootProps, getInputProps: getContextInputProps, isDragActive: isContextDragActive } = useDropzone({
    onDrop: onContextDrop,
    accept: {
      'text/*': ['.txt', '.md', '.csv'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeContextFile = (index: number) => {
    setContextFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addUrlField = () => {
    setUrls(prev => [...prev, '']);
  };

  const removeUrlField = (index: number) => {
    setUrls(prev => prev.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    setUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const validUrls = urls.filter(url => url.trim() !== '');
  const hasValidContent = selectedFiles.length > 0 || validUrls.length > 0;
  const totalItems = selectedFiles.length + validUrls.length;

  const handleUpload = async () => {
    if (!hasValidContent || !selectedUseCase) return;

    await batchUpload.mutateAsync({
      files: selectedFiles,
      urls: validUrls,
      contextFiles: contextFiles,
      useCase: selectedUseCase,
      batchName: batchName || `Batch ${new Date().toLocaleDateString()}`,
      analysisGoals: analysisGoals.trim() || undefined,
      analysisPreferences: analysisPreferences
    });

    // Reset form
    setSelectedFiles([]);
    setContextFiles([]);
    setUrls(['']);
    setBatchName('');
    setAnalysisGoals('');
    setSelectedUseCase('');
    setAnalysisPreferences({
      auto_comparative: true,
      context_integration: true,
      analysis_depth: 'detailed'
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.md')) return '📝';
    if (fileName.endsWith('.txt')) return '📄';
    if (fileName.endsWith('.pdf')) return '📕';
    if (fileName.endsWith('.json')) return '🔧';
    if (fileName.endsWith('.csv')) return '📊';
    return '📄';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enhanced Design Analysis</CardTitle>
        <CardDescription>
          Upload multiple design files or analyze website URLs with optional context files for comprehensive AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Batch Name */}
        <div className="space-y-2">
          <Label htmlFor="batch-name">Batch Name (Optional)</Label>
          <Input
            id="batch-name"
            placeholder="e.g., Landing Page Redesign, Mobile App Flow"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        {/* Analysis Goals */}
        <div className="space-y-2">
          <Label htmlFor="analysis-goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analysis Goals & Context
          </Label>
          <Textarea
            id="analysis-goals"
            placeholder="Describe what you want to learn from this analysis. For example: 'Focus on conversion optimization for e-commerce checkout flow' or 'Compare mobile vs desktop user experience'"
            value={analysisGoals}
            onChange={(e) => setAnalysisGoals(e.target.value)}
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground">
            Providing specific goals helps Claude deliver more targeted and actionable insights.
          </p>
        </div>

        {/* Analysis Preferences */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Analysis Preferences
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-comparative"
                checked={analysisPreferences.auto_comparative}
                onCheckedChange={(checked) =>
                  setAnalysisPreferences(prev => ({
                    ...prev,
                    auto_comparative: checked as boolean
                  }))
                }
              />
              <Label htmlFor="auto-comparative" className="text-sm">
                Enable automatic comparative analysis for multiple items
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="context-integration"
                checked={analysisPreferences.context_integration}
                onCheckedChange={(checked) =>
                  setAnalysisPreferences(prev => ({
                    ...prev,
                    context_integration: checked as boolean
                  }))
                }
              />
              <Label htmlFor="context-integration" className="text-sm">
                Use context files to enhance analysis
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Analysis Depth</Label>
              <Select
                value={analysisPreferences.analysis_depth || 'detailed'}
                onValueChange={(value) =>
                  setAnalysisPreferences(prev => ({
                    ...prev,
                    analysis_depth: value as 'basic' | 'detailed' | 'comprehensive'
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Analysis</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upload Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'files' | 'urls')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="urls" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website URLs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
                ${selectedFiles.length > 0 ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm mb-2">
                {isDragActive
                  ? 'Drop your design files here'
                  : 'Drag & drop multiple design files here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, PDF (max 10MB each)
              </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
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
          </TabsContent>

          <TabsContent value="urls" className="space-y-4">
            <div className="space-y-3">
              <Label>Website URLs to Analyze</Label>
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/page"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                  />
                  {urls.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeUrlField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addUrlField}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another URL
              </Button>
            </div>

            {/* Valid URLs Summary */}
            {validUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Valid URLs ({validUrls.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {validUrls.map((url, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <Globe className="h-3 w-3 mr-1" />
                      {new URL(url).hostname}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Context Files Upload */}
        {analysisPreferences.context_integration && (
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Context Files (Optional)
            </Label>
            <div
              {...getContextRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isContextDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
              `}
            >
              <input {...getContextInputProps()} />
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs mb-1">
                {isContextDragActive
                  ? 'Drop context files here'
                  : 'Upload brand guidelines, briefs, or documentation'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: TXT, MD, PDF, JSON, CSV, DOC (max 5MB each)
              </p>
            </div>

            {contextFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Context Files ({contextFiles.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {contextFiles.map((file, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      <span className="mr-1">{getFileIcon(file.name)}</span>
                      <FileText className="h-3 w-3 mr-1" />
                      {file.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={() => removeContextFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Use Case Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Analysis Type</Label>
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

        {/* Upload Summary */}
        {hasValidContent && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Upload Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              {selectedFiles.length > 0 && (
                <div>• {selectedFiles.length} design file(s) selected</div>
              )}
              {validUrls.length > 0 && (
                <div>• {validUrls.length} URL(s) to analyze</div>
              )}
              {contextFiles.length > 0 && (
                <div>• {contextFiles.length} context file(s) for enhanced analysis</div>
              )}
              <div>• Total design items: {totalItems}</div>
              {totalItems > 1 && analysisPreferences.auto_comparative && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 border border-blue-200">
                  <strong>✨ Comparative Analysis:</strong> Multiple items detected - automatic comparative analysis will be performed
                </div>
              )}
              {analysisGoals && (
                <div className="mt-2 p-2 bg-green-50 rounded text-green-800 border border-green-200">
                  <strong>Goals:</strong> {analysisGoals.slice(0, 100)}
                  {analysisGoals.length > 100 && '...'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!hasValidContent || !selectedUseCase || batchUpload.isPending}
          className="w-full"
          size="lg"
        >
          {batchUpload.isPending 
            ? 'Processing...' 
            : `Analyze ${totalItems} Item(s)${totalItems > 1 && analysisPreferences.auto_comparative ? ' (Comparative)' : ''}`
          }
        </Button>
      </CardContent>
    </Card>
  );
};
