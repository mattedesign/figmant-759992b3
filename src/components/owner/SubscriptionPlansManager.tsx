
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlanDialog } from './SubscriptionPlanDialog';
import { ProductPlanCard } from './ProductPlanCard';
import { ProductFilterTabs } from './ProductFilterTabs';
import { SubscriptionPlan, CreateSubscriptionPlanData } from '@/types/subscription';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

  const filteredPlans = plans?.filter(plan => {
    if (activeFilter === 'all') return true;
    return plan.plan_type === activeFilter;
  });

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
        <CardContent className="space-y-6">
          <ProductFilterTabs 
            plans={plans}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {!filteredPlans || filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {activeFilter === 'all' ? 'No products found' : 
                 activeFilter === 'recurring' ? 'No subscription plans found' : 
                 'No credit packs found'}
              </h3>
              <p className="text-sm mb-4">
                {activeFilter === 'all' ? 'Create your first product to get started' :
                 activeFilter === 'recurring' ? 'Create recurring subscription plans for ongoing access' :
                 'Create credit packs for one-time purchases'}
              </p>
              <Button onClick={handleCreatePlan} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add {activeFilter === 'recurring' ? 'Subscription Plan' : 
                     activeFilter === 'credits' ? 'Credit Pack' : 'Product'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => (
                <ProductPlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                  isDeleting={isDeleting}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
