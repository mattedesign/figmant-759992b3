
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Coins, DollarSign } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface ProductPlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const ProductPlanCard = ({ 
  plan, 
  onEdit, 
  onDelete, 
  isDeleting, 
  isUpdating 
}: ProductPlanCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const pricePerCredit = plan.credit_price && plan.credits > 0 
    ? (plan.credit_price / plan.credits) 
    : 0;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription className="mt-1">
                {plan.description || 'Credit pack for analysis services'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={plan.is_active ? "default" : "secondary"}>
              {plan.is_active ? "Active" : "Inactive"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(plan)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pack
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(plan)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Pack
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Credits</div>
            <div className="text-2xl font-bold">{plan.credits}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Price</div>
            <div className="text-2xl font-bold">
              {plan.credit_price ? formatPrice(plan.credit_price) : 'Free'}
            </div>
          </div>
        </div>
        
        {pricePerCredit > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price per credit:</span>
              <span className="font-medium flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {pricePerCredit.toFixed(3)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          Created {new Date(plan.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
