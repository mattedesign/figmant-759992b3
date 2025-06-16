
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, MessageSquare, StickyNote } from 'lucide-react';

interface EmptyStateProps {
  onAction?: () => void;
}

export const RecentAnalysisEmpty: React.FC<EmptyStateProps> = ({ onAction }) => (
  <div className="text-center py-8">
    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
    <p className="text-gray-500 mb-4">
      Upload your first design to get AI-powered insights
    </p>
    {onAction && (
      <Button onClick={onAction}>
        Start First Analysis
      </Button>
    )}
  </div>
);

export const InsightsSectionEmpty: React.FC = () => (
  <div className="text-center py-8">
    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available</h3>
    <p className="text-gray-500">
      Complete some analyses to see your insights and patterns
    </p>
  </div>
);

export const MyPromptsEmpty: React.FC<EmptyStateProps> = ({ onAction }) => (
  <div className="text-center py-8">
    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts used yet</h3>
    <p className="text-gray-500 mb-4">
      Start using AI analysis to see your recent prompts
    </p>
    {onAction && (
      <Button variant="outline" onClick={onAction}>
        Explore Templates
      </Button>
    )}
  </div>
);

export const NotesEmpty: React.FC<EmptyStateProps> = ({ onAction }) => (
  <div className="text-center py-8">
    <StickyNote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
    <p className="text-gray-500 mb-4">
      Create your first note to keep track of important insights
    </p>
    {onAction && (
      <Button variant="outline" onClick={onAction}>
        Add Note
      </Button>
    )}
  </div>
);
