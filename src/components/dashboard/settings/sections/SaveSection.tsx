
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface SaveSectionProps {
  loading: boolean;
  lastSaved: Date | null;
  onSave: () => void;
}

export const SaveSection: React.FC<SaveSectionProps> = ({
  loading,
  lastSaved,
  onSave,
}) => {
  return (
    <>
      {/* Last Saved Indicator */}
      {lastSaved && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Save Button with Enhanced Feedback */}
      <div className="flex justify-end space-x-3">
        <Button 
          onClick={onSave} 
          disabled={loading}
          className="flex items-center space-x-2 min-w-[140px]"
          variant={loading ? "secondary" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
};
