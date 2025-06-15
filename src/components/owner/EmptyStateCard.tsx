
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';

interface EmptyStateCardProps {
  onCreatePlan: () => void;
}

export const EmptyStateCard = ({ onCreatePlan }: EmptyStateCardProps) => {
  return (
    <Card className="text-center py-8">
      <CardContent>
        <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Credit Packs Available</h3>
        <p className="text-muted-foreground mb-4">
          Create your first credit pack to allow users to purchase analysis credits.
        </p>
        <Button onClick={onCreatePlan}>
          <Plus className="h-4 w-4 mr-2" />
          Create Credit Pack
        </Button>
      </CardContent>
    </Card>
  );
};
