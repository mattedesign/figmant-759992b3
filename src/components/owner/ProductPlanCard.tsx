
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CreditCard, Coins } from 'lucide-react';
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
  const formatPrice = (price: number | null) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const getPlanTypeIcon = (planType: string) => {
    return planType === 'credits' ? <Coins className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />;
  };

  const getPlanTypeLabel = (planType: string) => {
    return planType === 'credits' ? 'Credit Pack' : 'Subscription';
  };

  const getPlanTypeColor = (planType: string) => {
    return planType === 'credits' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <Badge variant={plan.is_active ? "default" : "secondary"}>
              {plan.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge className={`flex items-center space-x-1 ${getPlanTypeColor(plan.plan_type)}`}>
              {getPlanTypeIcon(plan.plan_type)}
              <span>{getPlanTypeLabel(plan.plan_type)}</span>
            </Badge>
          </div>
          
          {plan.description && (
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded">
              <p className="font-medium text-muted-foreground">Credits</p>
              <p className="text-lg font-bold">{plan.credits.toLocaleString()}</p>
            </div>
            
            {plan.plan_type === 'recurring' ? (
              <>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Monthly</p>
                  <p className="text-lg font-bold">{formatPrice(plan.price_monthly)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Annual</p>
                  <p className="text-lg font-bold">{formatPrice(plan.price_annual)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Billing</p>
                  <p className="text-sm font-medium">Recurring</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Pack Price</p>
                  <p className="text-lg font-bold">{formatPrice(plan.credit_price)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Per Credit</p>
                  <p className="text-sm font-bold">
                    {plan.credit_price && plan.credits > 0 
                      ? `$${(plan.credit_price / plan.credits).toFixed(3)}`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="font-medium text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">One-time</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(plan)}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
