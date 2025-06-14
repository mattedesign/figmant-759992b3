
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, Key, Info } from 'lucide-react';
import { useClaudeSettings } from '@/hooks/useClaudeSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ClaudeAISetupPromptProps {
  onSetupComplete?: () => void;
}

export const ClaudeAISetupPrompt = ({ onSetupComplete }: ClaudeAISetupPromptProps) => {
  const { data: claudeSettings, isLoading } = useClaudeSettings();
  const { isOwner } = useAuth();
  const { toast } = useToast();

  const handleGoToSettings = () => {
    if (isOwner) {
      // Navigate to Claude settings
      window.location.href = '/owner?tab=claude';
    } else {
      toast({
        title: "Access Restricted",
        description: "Please contact your administrator to configure Claude AI settings.",
      });
    }
  };

  const handleAPIKeySetup = () => {
    if (isOwner) {
      toast({
        title: "API Key Setup",
        description: "Please configure the Claude API key in the Owner Dashboard settings.",
      });
    } else {
      toast({
        title: "Contact Administrator",
        description: "Please contact your administrator to set up the Claude API key.",
      });
    }
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
    if (!isOwner) {
      return (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Info className="h-5 w-5" />
              <span>Claude AI Unavailable</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Claude AI analysis is currently unavailable. Please contact your administrator if you need this feature.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Claude AI Disabled</span>
          </CardTitle>
          <CardDescription className="text-red-700">
            Design analysis requires Claude AI to be enabled. Please configure the settings.
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

  // For subscribers, show a simple status when Claude is enabled
  if (!isOwner) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Info className="h-5 w-5" />
            <span>Claude AI Available</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Claude AI analysis is ready for your design uploads.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // For owners, show configuration options if API key might be missing
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
