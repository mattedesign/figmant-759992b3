
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';

interface DataSettingsTabProps {
  dataRetention: string;
  setDataRetention: (value: string) => void;
}

export const DataSettingsTab = ({ dataRetention, setDataRetention }: DataSettingsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Database className="h-4 w-4" />
        <h3 className="text-lg font-medium">Data Management</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Data Retention Period</Label>
          <Select value={dataRetention} onValueChange={setDataRetention}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How long to keep user analytics data
          </p>
        </div>

        <div className="space-y-2">
          <Label>Data Export Format</Label>
          <div className="flex space-x-2">
            <Badge variant="outline">JSON</Badge>
            <Badge variant="outline">CSV</Badge>
            <Badge variant="outline">Excel</Badge>
            <Badge variant="outline">PDF</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Privacy Settings</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch defaultChecked />
              <Label className="text-sm">Anonymize user data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked />
              <Label className="text-sm">GDPR compliance mode</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
