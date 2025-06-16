
import React from 'react';
import { Button } from '@/components/ui/button';
import { PromptData } from './types/dashboard';

interface MyPromptsSectionProps {
  promptsData: PromptData[];
}

export const MyPromptsSection: React.FC<MyPromptsSectionProps> = ({ promptsData }) => {
  return (
    <div
      style={{
        borderRadius: 'var(--corner-radius-2xl, 16px)',
        border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
        background: 'var(--background-base-white, #FFF)',
        padding: '24px'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">My Prompts</h3>
        <Button variant="ghost" size="sm" className="text-gray-500">
          Today
        </Button>
      </div>
      <div className="space-y-3">
        {promptsData.map((prompt, index) => (
          <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{prompt.title}</div>
              {prompt.subtitle && (
                <div className="text-sm text-gray-600 truncate">{prompt.subtitle}</div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{prompt.date}</span>
                {prompt.status && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{prompt.status}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
