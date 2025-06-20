
import React, { Suspense, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useClaudePromptExamples, ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { ConnectionStatus } from '@/types/claude';
import { CreatePromptForm } from './CreatePromptForm';
import { TemplateMigrationHelper } from './TemplateMigrationHelper';
import { PromptTemplateItem } from './PromptTemplateItem';

// Lazy load the heavy components
const ClaudeHeader = React.lazy(() => import('./ClaudeHeader').then(module => ({ default: module.ClaudeHeader })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const ClaudePromptManager: React.FC = () => {
  const { isOwner, loading } = useAuth();
  const { data: claudeSettings, isLoading: settingsLoading } = useClaudeSettings();
  const { data: promptTemplates = [], isLoading: templatesLoading, refetch } = useClaudePromptExamples();
  const [showCreateForm, setShowCreateForm] = useState(false);

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

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handleView = (template: ClaudePromptExample) => {
    console.log('View template:', template.id);
  };
  
  const handleDelete = (template: ClaudePromptExample) => {
    console.log('Delete template:', template.id);
  };
  
  const handleEditSuccess = () => {
    console.log('Edit success - refreshing templates');
    refetch();
  };

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
          onCancel={handleCancelCreate}
          onSuccess={handleCreateSuccess}
        />
      )}
      
      {/* TEMPLATES LIST */}
      <div className="space-y-4">
        {templatesLoading ? (
          <LoadingSpinner />
        ) : promptTemplates.length > 0 ? (
          promptTemplates.map((template) => (
            <PromptTemplateItem
              key={template.id}
              template={template}
              onView={handleView}
              onDelete={handleDelete}
              onEditSuccess={handleEditSuccess}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No prompt templates found. Create your first template to get started.
          </div>
        )}
      </div>
    </div>
  );
};
