
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => (
  <div className="text-center py-8">
    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
);

export const RecentAnalysisError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Failed to load analyses"
    message="There was an error loading your recent analyses. Please try again."
    onRetry={onRetry}
  />
);

export const InsightsSectionError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Failed to load insights"
    message="There was an error loading your insights. Please try again."
    onRetry={onRetry}
  />
);

export const MyPromptsError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Failed to load prompts"
    message="There was an error loading your recent prompts. Please try again."
    onRetry={onRetry}
  />
);

export const NotesError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Failed to load notes"
    message="There was an error loading your notes. Please try again."
    onRetry={onRetry}
  />
);
