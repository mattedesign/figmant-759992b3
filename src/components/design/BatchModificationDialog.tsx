
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileImage, Upload, X, Replace, Plus } from 'lucide-react';
import { DesignUpload } from '@/types/design';
import { useDropzone } from 'react-dropzone';

interface BatchModificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalUploads: DesignUpload[];
  onSubmit: (modifications: {
    newFiles: File[];
    replacements: Record<string, File>;
    modificationSummary: string;
  }) => void;
  isLoading: boolean;
}

export const BatchModificationDialog = ({
  open,
  onOpenChange,
  originalUploads,
  onSubmit,
  isLoading
}: BatchModificationDialogProps) => {
  const [activeTab, setActiveTab] = useState('add');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [replacements, setReplacements] = useState<Record<string, File>>({});
  const [modificationSummary, setModificationSummary] = useState('');

  const { getRootProps: getAddRootProps, getInputProps: getAddInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setNewFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const createReplacementDropzone = (uploadId: string) => {
    return useDropzone({
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
        'application/pdf': ['.pdf']
      },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          setReplacements(prev => ({
            ...prev,
            [uploadId]: acceptedFiles[0]
          }));
        }
      }
    });
  };

  const handleSubmit = () => {
    if (!modificationSummary.trim()) {
      alert('Please provide a summary of your modifications');
      return;
    }

    onSubmit({
      newFiles,
      replacements,
      modificationSummary: modificationSummary.trim()
    });

    // Reset form
    setNewFiles([]);
    setReplacements({});
    setModificationSummary('');
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeReplacement = (uploadId: string) => {
    setReplacements(prev => {
      const { [uploadId]: removed, ...rest } = prev;
      return rest;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modify Batch for Re-analysis</DialogTitle>
          <DialogDescription>
            Add new designs or replace existing ones, then re-run the comparative analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Designs ({newFiles.length})
              </TabsTrigger>
              <TabsTrigger value="replace" className="flex items-center gap-2">
                <Replace className="h-4 w-4" />
                Replace Existing ({Object.keys(replacements).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Designs</CardTitle>
                  <CardDescription>
                    Upload additional designs to include in the comparative analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    {...getAddRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                  >
                    <input {...getAddInputProps()} />
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>

                  {newFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>New files to add:</Label>
                      {newFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileImage className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNewFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="replace" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Replace Existing Designs</CardTitle>
                  <CardDescription>
                    Upload new versions to replace specific designs from the original batch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {originalUploads.map((upload) => {
                    const replacementDropzone = createReplacementDropzone(upload.id);
                    const hasReplacement = replacements[upload.id];

                    return (
                      <div key={upload.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileImage className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{upload.file_name}</span>
                          </div>
                          {hasReplacement && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeReplacement(upload.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {hasReplacement ? (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Replace className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Will be replaced with: {replacements[upload.id].name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            {...replacementDropzone.getRootProps()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary cursor-pointer transition-colors"
                          >
                            <input {...replacementDropzone.getInputProps()} />
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Drop replacement file here
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="summary">Modification Summary *</Label>
            <Textarea
              id="summary"
              placeholder="Describe what changes you're making and why (e.g., 'Added mobile wireframes and replaced hero section with updated design')"
              value={modificationSummary}
              onChange={(e) => setModificationSummary(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || (!newFiles.length && !Object.keys(replacements).length)}
            >
              {isLoading ? 'Processing...' : 'Re-run Analysis'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
