
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { ConnectionStatus } from '@/types/claude';

interface ClaudeHeaderProps {
  connectionStatus: ConnectionStatus;
}

export const ClaudeHeader = ({ connectionStatus }: ClaudeHeaderProps) => {
  const StatusIcon = connectionStatus.icon;

  return (
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Bot className="h-5 w-5" />
        <span>Claude AI Configuration</span>
        <Badge variant="outline" className={`ml-auto ${connectionStatus.color}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {connectionStatus.text}
        </Badge>
      </CardTitle>
      <CardDescription>
        Configure Claude AI integration for enhanced UX analytics insights
      </CardDescription>
    </CardHeader>
  );
};
