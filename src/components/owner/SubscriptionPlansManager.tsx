
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlanDialog } from './SubscriptionPlanDialog';
import { DeletePlanDialog } from './DeletePlanDialog';
import { PlansManagerContent } from './PlansManagerContent';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '@/types/subscription';

export const SubscriptionPlansManager = () => {
  const { plans, isLoading, createPlan, updatePlan, deletePlan, isCreating, isUpdating, isDeleting } = useSubscriptionPlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

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
    if (editingPlan) {
      updatePlan({ ...data, id: editingPlan.id });
    } else {
      createPlan(data);
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
          <CardTitle>Plans & Products</CardTitle>
          <CardDescription>Loading subscription plans and credit packs...</CardDescription>
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
              <Package className="h-5 w-5" />
              <span>Plans & Products</span>
            </div>
            <Button onClick={handleCreatePlan} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardTitle>
          <CardDescription>
            Manage subscription plans and credit packs for your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlansManagerContent
            plans={plans}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onCreatePlan={handleCreatePlan}
            onEditPlan={handleEditPlan}
            onDeletePlan={handleDeletePlan}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
          />
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
