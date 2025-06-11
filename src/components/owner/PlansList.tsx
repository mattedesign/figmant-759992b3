
import { SubscriptionPlan } from '@/types/subscription';
import { ProductPlanCard } from './ProductPlanCard';

interface PlansListProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const PlansList = ({ 
  plans, 
  onEdit, 
  onDelete, 
  isDeleting, 
  isUpdating 
}: PlansListProps) => {
  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <ProductPlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
};
