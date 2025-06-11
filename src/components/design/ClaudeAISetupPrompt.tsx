
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, Key } from 'lucide-react';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useToast } from '@/hooks/use-toast';

interface ClaudeAISetupPromptProps {
  onSetupComplete?: () => void;
}

export const ClaudeAISetupPrompt = ({ onSetupComplete }: ClaudeAISetupPromptProps) => {
  const { data: claudeSettings, isLoading } = useClaudeSettings();
  const { toast } = useToast();

  const handleGoToSettings = () => {
    // Navigate to Claude settings - fixed URL
    window.location.href = '/owner?tab=claude';
  };

  const handleAPIKeySetup = () => {
    toast({
      title: "API Key Required",
      description: "Please contact your administrator to set up the Claude API key in the Owner Dashboard.",
    });
  };

  if (isLoading) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <span className="text-sm">Checking Claude AI configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!claudeSettings?.claude_ai_enabled) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Claude AI Disabled</span>
          </CardTitle>
          <CardDescription className="text-red-700">
            Design analysis requires Claude AI to be enabled. Please contact your administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoToSettings}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if API key is missing (this would be indicated by specific error patterns)
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-800">
          <Key className="h-5 w-5" />
          <span>Claude AI Configuration</span>
        </CardTitle>
        <CardDescription className="text-yellow-700">
          If uploads are failing, the Claude API key may need to be configured.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button
            onClick={handleGoToSettings}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Check Settings
          </Button>
          <Button
            onClick={handleAPIKeySetup}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <Key className="h-4 w-4 mr-2" />
            Setup API Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
