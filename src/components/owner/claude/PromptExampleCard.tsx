
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
    console.log('🖱️ PromptExampleCard handleEdit called for prompt:', prompt.id);
    console.log('🔄 Current drawer state before opening:', isDrawerOpen);
    console.log('🔄 Opening edit drawer...');
    setIsDrawerOpen(true);
    console.log('✅ setIsDrawerOpen(true) called');
    
    // Add a small delay to check if state actually changes
    setTimeout(() => {
      console.log('🔄 Drawer state after 100ms:', isDrawerOpen);
    }, 100);
  };

  const handleCloseDrawer = () => {
    console.log('❌ Closing edit drawer for prompt:', prompt.id);
    console.log('🔄 Current drawer state before closing:', isDrawerOpen);
    setIsDrawerOpen(false);
    console.log('✅ setIsDrawerOpen(false) called');
  };

  console.log('🎨 About to render PromptEditDrawer with isOpen:', isDrawerOpen);

  return (
    <div className="relative">
      <PromptExampleView
        prompt={prompt}
        onEdit={handleEdit}
      />
      
      <PromptEditDrawer
        prompt={prompt}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
