
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Send } from 'lucide-react';

interface AnalysisChatPanelProps {
  analysis: any;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  analysis
}) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-48 grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* AI Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm">
                  Hi! Let's create a new GPT together. How about "a creative GPT for generating product visuals" or "a GPT for formatting code"? What do you think?
                </p>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex items-start gap-3 justify-end">
            <div className="flex-1 max-w-md">
              <div className="bg-blue-600 text-white rounded-lg p-3">
                <p className="text-sm">
                  I'm an interior designer and want to create layout and design for my clients alongside with the precise material dimension measurement
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-medium">R</span>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type '/' for commands"
              className="pr-20"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Mic className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={handleSendMessage}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
