
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

interface EmptyStateCardProps {
  activeFilter: string;
  onCreatePlan: () => void;
}

export const EmptyStateCard = ({ activeFilter, onCreatePlan }: EmptyStateCardProps) => {
  const getEmptyStateConfig = () => {
    switch (activeFilter) {
      case 'recurring':
        return {
          title: 'No subscription plans found',
          description: 'Create recurring subscription plans for ongoing access',
          buttonText: 'Add Subscription Plan'
        };
      case 'credits':
        return {
          title: 'No credit packs found',
          description: 'Create credit packs for one-time purchases',
          buttonText: 'Add Credit Pack'
        };
      default:
        return {
          title: 'No products found',
          description: 'Create your first product to get started',
          buttonText: 'Add Product'
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className="text-center py-12 text-muted-foreground">
      <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">{config.title}</h3>
      <p className="text-sm mb-4">{config.description}</p>
      <Button onClick={onCreatePlan} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        {config.buttonText}
      </Button>
    </div>
  );
};
