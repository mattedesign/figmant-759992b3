
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';
import { ClaudeFormData } from '@/types/claude';
import { validateApiKey } from '@/constants/claude';

interface ClaudeActionButtonsProps {
  isEditing: boolean;
  formData: ClaudeFormData;
  isTestingConnection: boolean;
  isSaving: boolean;
  onEditClick: () => void;
  onTestConnection: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ClaudeActionButtons = ({
  isEditing,
  formData,
  isTestingConnection,
  isSaving,
  onEditClick,
  onTestConnection,
  onSave,
  onCancel
}: ClaudeActionButtonsProps) => {
  if (!isEditing) {
    return (
      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={onEditClick}
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Edit Settings</span>
        </Button>
        {formData.enabled && validateApiKey(formData.apiKey) && (
          <Button
            type="button"
            variant="outline"
            onClick={onTestConnection}
            disabled={isTestingConnection}
            className="flex items-center space-x-2"
          >
            {isTestingConnection ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Test Connection</span>
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center space-x-2"
      >
        {isSaving ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            <span>Save Changes</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
