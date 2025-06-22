
import React from 'react';
import { X, Eye, Save, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaveStatusIndicator } from './SaveStatusIndicator';

interface EditorHeaderProps {
  templateTitle: string;
  isDirty: boolean;
  saveStatus: 'saved' | 'saving' | 'error' | 'idle';
  showPreview: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onClose: () => void;
  isLoading?: boolean;
  isValid?: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  templateTitle,
  isDirty,
  saveStatus,
  showPreview,
  onTogglePreview,
  onSave,
  onClose,
  isLoading = false,
  isValid = true
}) => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose} size="sm">
          <X className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">
            Edit Template: {templateTitle}
          </h1>
          {isDirty && (
            <p className="text-sm text-muted-foreground">
              Unsaved changes
            </p>
          )}
        </div>
        <SaveStatusIndicator status={saveStatus} />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={onTogglePreview}
          size="sm"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
        
        <Button 
          onClick={onSave} 
          disabled={isLoading || !isValid}
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </header>
  );
};
