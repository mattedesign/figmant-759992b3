
import { SubscriptionPlan } from '@/types/subscription';
import { ProductFilterTabs } from './ProductFilterTabs';
import { EmptyStateCard } from './EmptyStateCard';
import { PlansList } from './PlansList';

interface PlansManagerContentProps {
  plans: SubscriptionPlan[] | undefined;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onCreatePlan: () => void;
  onEditPlan: (plan: SubscriptionPlan) => void;
  onDeletePlan: (plan: SubscriptionPlan) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export const PlansManagerContent = ({
  plans,
  activeFilter,
  onFilterChange,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
  isDeleting,
  isUpdating
}: PlansManagerContentProps) => {
  const filteredPlans = plans?.filter(plan => {
    if (activeFilter === 'all') return true;
    return plan.plan_type === activeFilter;
  });

  return (
    <div className="space-y-6">
      <ProductFilterTabs 
        plans={plans}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      {!filteredPlans || filteredPlans.length === 0 ? (
        <EmptyStateCard 
          activeFilter={activeFilter}
          onCreatePlan={onCreatePlan}
        />
      ) : (
        <PlansList
          plans={filteredPlans}
          onEdit={onEditPlan}
          onDelete={onDeletePlan}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};
