
import React, { useState } from 'react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptExampleView } from './PromptExampleView';
import { PromptEditDrawer } from './PromptEditDrawer';

interface PromptExampleCardProps {
  prompt: ClaudePromptExample;
}

export const PromptExampleCard: React.FC<PromptExampleCardProps> = ({ prompt }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  console.log('🔄 PromptExampleCard render - ID:', prompt.id, 'drawerOpen:', isDrawerOpen);
  
  const handleEdit = () => {
    console.log('🖱️ handleEdit called for prompt:', prompt.id);
    console.log('🔄 Opening edit drawer...');
    setIsDrawerOpen(true);
    console.log('✅ Edit drawer should be opening for prompt:', prompt.id);
  };

  const handleCloseDrawer = () => {
    console.log('❌ Closing edit drawer for prompt:', prompt.id);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <PromptExampleView
        prompt={prompt}
        onEdit={handleEdit}
      />
      
      <PromptEditDrawer
        prompt={prompt}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};
