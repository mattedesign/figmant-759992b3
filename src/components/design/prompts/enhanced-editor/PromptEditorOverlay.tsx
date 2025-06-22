
import React, { useState, useEffect } from 'react';
import { X, Eye, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from './components/EditorHeader';
import { SectionNavigation } from './components/SectionNavigation';
import { SectionEditor } from './components/SectionEditor';
import { PromptPreview } from './components/PromptPreview';
import { SaveStatusIndicator } from './components/SaveStatusIndicator';
import { useAutoSave } from './hooks/useAutoSave';
import { usePromptValidation } from './hooks/usePromptValidation';
import { useEditorState } from './hooks/useEditorState';
import { editorSections } from './config/editorSections';

interface PromptEditorOverlayProps {
  isOpen: boolean;
  templateId: string;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const PromptEditorOverlay: React.FC<PromptEditorOverlayProps> = ({
  isOpen,
  templateId,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const {
    formData,
    setFormData,
    isDirty,
    isLoading: isFormLoading,
    loadTemplate
  } = useEditorState(templateId);

  const { validationErrors, isValid, validate } = usePromptValidation(formData);
  
  const { autoSaveStatus, saveNow } = useAutoSave({
    data: formData,
    onSave,
    delay: 30000,
    enabled: isDirty && isValid
  });

  useEffect(() => {
    if (isOpen && templateId) {
      loadTemplate();
    }
  }, [isOpen, templateId, loadTemplate]);

  const handleSave = async () => {
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(formData);
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmed) return;
    }
    onClose();
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  if (isFormLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50">
      <EditorHeader
        templateTitle={formData.title || 'New Template'}
        isDirty={isDirty}
        saveStatus={autoSaveStatus}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onSave={handleSave}
        onClose={handleClose}
        isLoading={isLoading}
        isValid={isValid}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <SectionNavigation
          sections={editorSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          validationErrors={validationErrors}
          formData={formData}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            <div className={`${showPreview ? 'w-2/3' : 'w-full'} p-6 overflow-auto`}>
              <SectionEditor
                section={activeSection}
                formData={formData}
                onChange={handleFormChange}
                validationErrors={validationErrors}
              />
            </div>
            
            {showPreview && (
              <div className="w-1/3 border-l bg-muted/20 p-4 overflow-auto">
                <PromptPreview template={formData} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {Object.keys(validationErrors).length} validation error{Object.keys(validationErrors).length > 1 ? 's' : ''} found
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
