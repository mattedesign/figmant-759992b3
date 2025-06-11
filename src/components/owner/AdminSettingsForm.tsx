
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface AdminSettingsFormData {
  stripeWebhook: boolean;
  maxSubscribers: number;
  claudeEnabled: boolean;
}

interface AdminSettingsFormProps {
  formData: AdminSettingsFormData;
  setFormData: (data: AdminSettingsFormData) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSave: () => void;
  resetFormData: () => void;
  isPending: boolean;
}

export const AdminSettingsForm = ({
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  handleSave,
  resetFormData,
  isPending
}: AdminSettingsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch 
          id="stripeWebhook"
          checked={formData.stripeWebhook}
          onCheckedChange={(checked) => setFormData({ ...formData, stripeWebhook: checked })}
          disabled={!isEditing}
        />
        <Label htmlFor="stripeWebhook">Enable Stripe Webhook Processing</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxSubscribers">Maximum Subscribers Limit</Label>
        <Input
          id="maxSubscribers"
          type="number"
          min="1"
          value={formData.maxSubscribers}
          onChange={(e) => setFormData({ ...formData, maxSubscribers: parseInt(e.target.value) || 1000 })}
          disabled={!isEditing}
        />
        <p className="text-xs text-muted-foreground">
          Maximum number of subscribers allowed on the platform
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="claudeEnabled"
          checked={formData.claudeEnabled}
          onCheckedChange={(checked) => setFormData({ ...formData, claudeEnabled: checked })}
          disabled={!isEditing}
        />
        <Label htmlFor="claudeEnabled">Enable Claude AI Features</Label>
      </div>

      <div className="flex space-x-4">
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Edit Settings</span>
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center space-x-2"
            >
              {isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>
                {isPending ? 'Saving...' : 'Save Changes'}
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                resetFormData();
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
