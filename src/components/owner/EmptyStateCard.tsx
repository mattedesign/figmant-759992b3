
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Coins } from 'lucide-react';

interface EmptyStateCardProps {
  activeFilter: string;
  onCreatePlan: () => void;
}

export const EmptyStateCard = ({ activeFilter, onCreatePlan }: EmptyStateCardProps) => {
  const getEmptyStateContent = () => {
    switch (activeFilter) {
      case 'credits':
        return {
          title: "No Credit Packs",
          description: "Create your first credit pack to allow users to purchase analysis credits.",
          icon: Coins
        };
      default:
        return {
          title: "No Credit Packs",
          description: "Get started by creating your first credit pack for users to purchase.",
          icon: Coins
        };
    }
  };

  const { title, description, icon: Icon } = getEmptyStateContent();

  return (
    <Card className="text-center py-8">
      <CardHeader>
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onCreatePlan}>
          <Plus className="h-4 w-4 mr-2" />
          Create Credit Pack
        </Button>
      </CardContent>
    </Card>
  );
};
