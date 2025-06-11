
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileImage, Upload, X, Replace } from 'lucide-react';
import { DesignUpload } from '@/types/design';
import { FileUploadSection } from './uploader/FileUploadSection';

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
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [replacements, setReplacements] = useState<Record<string, File>>({});
  const [modificationSummary, setModificationSummary] = useState<string>('');

  const handleFileReplacement = (uploadId: string, file: File | null) => {
    if (file) {
      setReplacements(prev => ({ ...prev, [uploadId]: file }));
    } else {
      setReplacements(prev => {
        const newReplacements = { ...prev };
        delete newReplacements[uploadId];
        return newReplacements;
      });
    }
  };

  const handleSubmit = () => {
    onSubmit({
      newFiles,
      replacements,
      modificationSummary
    });
  };

  const handleReset = () => {
    setNewFiles([]);
    setReplacements({});
    setModificationSummary('');
  };

  const totalModifications = newFiles.length + Object.keys(replacements).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Replace className="h-5 w-5" />
            Modify Batch Analysis
          </DialogTitle>
          <DialogDescription>
            Add new files or replace existing ones to create a new version of this batch analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Files */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Add New Files</Label>
            <FileUploadSection
              selectedFiles={newFiles}
              setSelectedFiles={setNewFiles}
            />
          </div>

          {/* Replace Existing Files */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Replace Existing Files</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {originalUploads.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{upload.file_name}</span>
                  </div>
                  
                  {replacements[upload.id] ? (
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full justify-center">
                        Replacing with: {replacements[upload.id].name}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileReplacement(upload.id, null)}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Replacement
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileReplacement(upload.id, file);
                        }}
                        className="hidden"
                        id={`replace-${upload.id}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`replace-${upload.id}`)?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Replace File
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modification Summary */}
          <div className="space-y-2">
            <Label htmlFor="modification-summary">
              Modification Summary
            </Label>
            <Textarea
              id="modification-summary"
              placeholder="Describe what changes you're making and why..."
              value={modificationSummary}
              onChange={(e) => setModificationSummary(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Summary */}
          {totalModifications > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Modification Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                {newFiles.length > 0 && (
                  <div>• Adding {newFiles.length} new file(s)</div>
                )}
                {Object.keys(replacements).length > 0 && (
                  <div>• Replacing {Object.keys(replacements).length} existing file(s)</div>
                )}
                <div>• Total modifications: {totalModifications}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={totalModifications === 0 || !modificationSummary.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating Modified Analysis...' : `Create New Version`}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
