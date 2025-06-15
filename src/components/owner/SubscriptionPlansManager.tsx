
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Coins } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlanDialog } from './SubscriptionPlanDialog';
import { DeletePlanDialog } from './DeletePlanDialog';
import { PlansList } from './PlansList';
import { EmptyStateCard } from './EmptyStateCard';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '@/types/subscription';

export const SubscriptionPlansManager = () => {
  const { plans, isLoading, createPlan, updatePlan, deletePlan, isCreating, isUpdating, isDeleting } = useSubscriptionPlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  // Filter to only show credit-based plans
  const creditPlans = plans?.filter(plan => plan.plan_type === 'credits') || [];

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setDialogOpen(true);
  };

  const handleDeletePlan = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = (data: CreateSubscriptionPlanData) => {
    // Ensure we're always creating credit-based plans
    const creditData = {
      ...data,
      plan_type: 'credits' as const,
      price_monthly: undefined,
      price_annual: undefined
    };

    if (editingPlan) {
      updatePlan({ ...creditData, id: editingPlan.id });
    } else {
      createPlan(creditData);
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (planToDelete) {
      deletePlan(planToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit Packs</CardTitle>
          <CardDescription>Loading credit packs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5" />
              <span>Credit Packs</span>
            </div>
            <Button onClick={handleCreatePlan} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Credit Pack
            </Button>
          </CardTitle>
          <CardDescription>
            Manage credit packs for your platform. Users purchase credits to perform design analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!creditPlans || creditPlans.length === 0 ? (
            <EmptyStateCard 
              activeFilter="credits"
              onCreatePlan={handleCreatePlan}
            />
          ) : (
            <PlansList
              plans={creditPlans}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
            />
          )}
        </CardContent>
      </Card>

      <SubscriptionPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <DeletePlanDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        planToDelete={planToDelete}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};
