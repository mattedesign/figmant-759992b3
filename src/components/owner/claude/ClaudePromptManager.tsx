
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useClaudePromptExamples, useCreatePromptExample, ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { ConnectionStatus } from '@/types/claude';
import { CreatePromptForm } from './CreatePromptForm';
import { TemplateMigrationHelper } from './TemplateMigrationHelper';

// Lazy load the heavy components
const ClaudeHeader = React.lazy(() => import('./ClaudeHeader').then(module => ({ default: module.ClaudeHeader })));
const PromptTemplateList = React.lazy(() => import('./PromptTemplateList').then(module => ({ default: module.PromptTemplateList })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const ClaudePromptManager: React.FC = () => {
  const { isOwner, loading } = useAuth();
  const { data: claudeSettings, isLoading: settingsLoading } = useClaudeSettings();
  const { data: promptTemplates = [], isLoading: templatesLoading } = useClaudePromptExamples();
  const createPromptMutation = useCreatePromptExample();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Partial<ClaudePromptExample>>({
    title: '',
    display_name: '',
    description: '',
    category: 'general' as const,
    original_prompt: '',
    claude_response: '',
    use_case_context: '',
    business_domain: '',
    is_template: true,
    is_active: true,
    effectiveness_rating: 5
  });

  console.log('🚀 ClaudePromptManager mounting with auth state:', { isOwner, loading });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isOwner) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the prompt template manager. Owner access required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Determine connection status based on Claude settings
  const getConnectionStatus = (): ConnectionStatus => {
    if (settingsLoading) {
      return {
        status: 'disabled',
        icon: Clock,
        color: 'text-gray-500',
        text: 'Loading...'
      };
    }

    if (!claudeSettings?.claude_ai_enabled || !claudeSettings?.claude_api_key) {
      return {
        status: 'disabled',
        icon: XCircle,
        color: 'text-red-500',
        text: 'Disabled'
      };
    }

    return {
      status: 'ready',
      icon: CheckCircle,
      color: 'text-green-500',
      text: 'Connected'
    };
  };

  const handleSavePrompt = async () => {
    if (!newPrompt.title || !newPrompt.display_name || !newPrompt.original_prompt || !newPrompt.claude_response) {
      return;
    }

    try {
      await createPromptMutation.mutateAsync(newPrompt as Omit<ClaudePromptExample, 'id' | 'created_at' | 'updated_at'>);
      setShowCreateForm(false);
      setNewPrompt({
        title: '',
        display_name: '',
        description: '',
        category: 'general' as const,
        original_prompt: '',
        claude_response: '',
        use_case_context: '',
        business_domain: '',
        is_template: true,
        is_active: true,
        effectiveness_rating: 5
      });
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewPrompt({
      title: '',
      display_name: '',
      description: '',
      category: 'general' as const,
      original_prompt: '',
      claude_response: '',
      use_case_context: '',
      business_domain: '',
      is_template: true,
      is_active: true,
      effectiveness_rating: 5
    });
  };

  // Group prompt templates by category
  const groupedTemplates = promptTemplates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof promptTemplates>);

  const connectionStatus = getConnectionStatus();

  if (templatesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<LoadingSpinner />}>
        <ClaudeHeader connectionStatus={connectionStatus} />
      </Suspense>

      {/* Migration Helper - only show if no templates exist */}
      {promptTemplates.length === 0 && (
        <TemplateMigrationHelper />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Prompt Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage AI prompt templates for enhanced analysis quality ({promptTemplates.length} templates)
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {showCreateForm && (
        <CreatePromptForm
          newPrompt={newPrompt}
          setNewPrompt={setNewPrompt}
          onSave={handleSavePrompt}
          onCancel={handleCancelCreate}
          isSaving={createPromptMutation.isPending}
        />
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <PromptTemplateList groupedTemplates={groupedTemplates} />
      </Suspense>
    </div>
  );
};
