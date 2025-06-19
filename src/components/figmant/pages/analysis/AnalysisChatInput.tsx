
import React from 'react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { ChatInputContainer } from './components/ChatInputContainer';

interface AnalysisChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedPromptTemplate: FigmantPromptTemplate | null;
  canSend: boolean;
  isAnalyzing: boolean;
  onFileUpload: (files: FileList) => void;
  onToggleUrlInput: () => void;
  onTemplateSelect: (templateId: string) => void;
  availableTemplates: FigmantPromptTemplate[];
  onViewTemplate: (template: FigmantPromptTemplate) => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (id: string) => void;
  showUrlInput: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  onAddUrl: () => void;
  onCancelUrl: () => void;
}

export const AnalysisChatInput: React.FC<AnalysisChatInputProps> = (props) => {
  return <ChatInputContainer {...props} />;
};
