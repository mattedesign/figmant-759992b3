
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface AnalysisChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  selectedPromptTemplate?: any;
  canSend: boolean;
}

export const AnalysisChatInput: React.FC<AnalysisChatInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  selectedPromptTemplate,
  canSend
}) => {
  return (
    <div className="p-6">
      <div 
        className="relative"
        style={{
          minHeight: '120px',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          background: '#FAFAFA'
        }}
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedPromptTemplate ? `Using template: ${selectedPromptTemplate.name}` : "Describe what you'd like to analyze..."}
          className="w-full h-full resize-none border-0 bg-transparent placeholder:text-gray-500 focus:ring-0 p-4"
          style={{ minHeight: '120px' }}
        />
        <div className="absolute bottom-3 right-3">
          <Button
            onClick={onSendMessage}
            disabled={!canSend}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
