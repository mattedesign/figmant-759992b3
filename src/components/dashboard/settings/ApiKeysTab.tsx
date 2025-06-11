
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface ApiKeys {
  claude: string;
  analytics: string;
  heatmap: string;
}

interface ApiKeysTabProps {
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
}

export const ApiKeysTab = ({ apiKeys, setApiKeys }: ApiKeysTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Key className="h-4 w-4" />
        <h3 className="text-lg font-medium">API Configuration</h3>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="claude-key">Claude AI API Key</Label>
          <Input
            id="claude-key"
            type="password"
            placeholder="sk-ant-..."
            value={apiKeys.claude}
            onChange={(e) => setApiKeys({...apiKeys, claude: e.target.value})}
          />
          <p className="text-xs text-muted-foreground">
            Required for AI-powered insights and recommendations
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="analytics-key">Google Analytics API Key</Label>
          <Input
            id="analytics-key"
            type="password"
            placeholder="AIza..."
            value={apiKeys.analytics}
            onChange={(e) => setApiKeys({...apiKeys, analytics: e.target.value})}
          />
          <p className="text-xs text-muted-foreground">
            Connect your Google Analytics data
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heatmap-key">Heatmap Service API Key</Label>
          <Input
            id="heatmap-key"
            type="password"
            placeholder="hm_..."
            value={apiKeys.heatmap}
            onChange={(e) => setApiKeys({...apiKeys, heatmap: e.target.value})}
          />
          <p className="text-xs text-muted-foreground">
            For heatmap and user session recordings
          </p>
        </div>
      </div>
    </div>
  );
};
