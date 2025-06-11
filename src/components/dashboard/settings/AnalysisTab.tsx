
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';

interface AnalysisTabProps {
  analysisFrequency: string;
  setAnalysisFrequency: (value: string) => void;
}

export const AnalysisTab = ({ analysisFrequency, setAnalysisFrequency }: AnalysisTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Zap className="h-4 w-4" />
        <h3 className="text-lg font-medium">Analysis Configuration</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>AI Analysis Frequency</Label>
          <Select value={analysisFrequency} onValueChange={setAnalysisFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Custom Analysis Prompts</Label>
          <Textarea
            placeholder="Enter custom prompts for Claude AI analysis..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Customize what Claude should focus on when analyzing your UX data
          </p>
        </div>

        <div className="space-y-2">
          <Label>Metrics Thresholds</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Bounce Rate Alert (%)</Label>
              <Input type="number" placeholder="75" />
            </div>
            <div>
              <Label className="text-xs">Conversion Drop (%)</Label>
              <Input type="number" placeholder="20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
