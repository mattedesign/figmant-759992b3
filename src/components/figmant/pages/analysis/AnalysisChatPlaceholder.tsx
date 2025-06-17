
import React from 'react';
import { SuggestedPrompts } from '@/components/design/chat/SuggestedPrompts';

interface AnalysisChatPlaceholderProps {
  onSelectPrompt?: (prompt: string) => void;
}

export const AnalysisChatPlaceholder: React.FC<AnalysisChatPlaceholderProps> = ({
  onSelectPrompt
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            AI Design Analysis
          </h2>
          <p className="text-gray-600">
            Upload designs, share URLs, or ask questions to get comprehensive UX analysis powered by Claude AI.
          </p>
        </div>
        
        {onSelectPrompt && (
          <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
        )}
      </div>
    </div>
  );
};
