
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';

interface EditFormHeaderProps {
  promptTitle: string;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const EditFormHeader: React.FC<EditFormHeaderProps> = ({
  promptTitle,
  onSave,
  onCancel,
  isSaving
}) => {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <span className="text-lg">Edit Prompt Template: {promptTitle}</span>
        <div className="flex items-center gap-2">
          <Button 
            size="sm"
            onClick={onSave} 
            disabled={isSaving}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            size="sm"
            variant="outline" 
            onClick={onCancel}
            className="h-8"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
