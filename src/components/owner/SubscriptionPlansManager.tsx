
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CreditCard, Coins } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlanDialog } from './SubscriptionPlanDialog';
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

  const formatPrice = (price: number | null) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const getPlanTypeIcon = (planType: string) => {
    return planType === 'credits' ? <Coins className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />;
  };

  const getPlanTypeLabel = (planType: string) => {
    return planType === 'credits' ? 'Credit Pack' : 'Recurring';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Loading subscription plans...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
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
              <CreditCard className="h-5 w-5" />
              <span>Subscription Plans</span>
            </div>
            <Button onClick={handleCreatePlan} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </CardTitle>
          <CardDescription>
            Manage subscription plans, pricing, and credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!plans || plans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscription plans found</p>
              <p className="text-sm">Create your first plan to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getPlanTypeIcon(plan.plan_type)}
                          <span>{getPlanTypeLabel(plan.plan_type)}</span>
                        </Badge>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                      )}
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Credits</p>
                          <p className="text-muted-foreground">{plan.credits.toLocaleString()}</p>
                        </div>
                        {plan.plan_type === 'recurring' ? (
                          <>
                            <div>
                              <p className="font-medium">Monthly</p>
                              <p className="text-muted-foreground">{formatPrice(plan.price_monthly)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Annual</p>
                              <p className="text-muted-foreground">{formatPrice(plan.price_annual)}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="font-medium">Pack Price</p>
                              <p className="text-muted-foreground">{formatPrice(plan.credit_price)}</p>
                            </div>
                            <div>
                              <p className="font-medium">Price per Credit</p>
                              <p className="text-muted-foreground">
                                {plan.credit_price && plan.credits > 0 
                                  ? `$${(plan.credit_price / plan.credits).toFixed(3)}`
                                  : 'N/A'
                                }
                              </p>
                            </div>
                          </>
                        )}
                        <div></div> {/* Empty div to maintain grid alignment */}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
            <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{planToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
