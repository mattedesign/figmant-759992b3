
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ClaudeLoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claude AI Settings</CardTitle>
        <CardDescription>Loading settings...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
