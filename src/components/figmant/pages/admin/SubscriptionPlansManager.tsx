
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, DollarSign, CreditCard, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  credits: number;
  price_monthly: number | null;
  price_annual: number | null;
  credit_price: number | null;
  plan_type: 'recurring' | 'one_time';
  is_active: boolean;
  created_at: string;
}

export const SubscriptionPlansManager: React.FC = () => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Mock data - in real implementation, this would come from a hook
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Starter',
      description: 'Perfect for individuals getting started with UX analysis',
      credits: 50,
      price_monthly: 19.99,
      price_annual: 199.99,
      credit_price: null,
      plan_type: 'recurring',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Ideal for UX teams and agencies',
      credits: 200,
      price_monthly: 49.99,
      price_annual: 499.99,
      credit_price: null,
      plan_type: 'recurring',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Credit Pack',
      description: 'Additional credits for existing subscribers',
      credits: 100,
      price_monthly: null,
      price_annual: null,
      credit_price: 29.99,
      plan_type: 'one_time',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    credits: 0,
    price_monthly: '',
    price_annual: '',
    credit_price: '',
    plan_type: 'recurring' as 'recurring' | 'one_time',
    is_active: true
  });

  const handleCreatePlan = () => {
    // Validate form
    if (!formData.name || !formData.description || formData.credits <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields."
      });
      return;
    }

    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      credits: formData.credits,
      price_monthly: formData.price_monthly ? parseFloat(formData.price_monthly) : null,
      price_annual: formData.price_annual ? parseFloat(formData.price_annual) : null,
      credit_price: formData.credit_price ? parseFloat(formData.credit_price) : null,
      plan_type: formData.plan_type,
      is_active: formData.is_active,
      created_at: new Date().toISOString()
    };

    setPlans([...plans, newPlan]);
    setShowCreateForm(false);
    resetForm();
    
    toast({
      title: "Plan Created",
      description: `${newPlan.name} plan has been created successfully.`
    });
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;

    const updatedPlans = plans.map(plan => 
      plan.id === editingPlan.id 
        ? {
            ...plan,
            name: formData.name,
            description: formData.description,
            credits: formData.credits,
            price_monthly: formData.price_monthly ? parseFloat(formData.price_monthly) : null,
            price_annual: formData.price_annual ? parseFloat(formData.price_annual) : null,
            credit_price: formData.credit_price ? parseFloat(formData.credit_price) : null,
            plan_type: formData.plan_type,
            is_active: formData.is_active
          }
        : plan
    );

    setPlans(updatedPlans);
    setEditingPlan(null);
    resetForm();
    
    toast({
      title: "Plan Updated",
      description: `${formData.name} plan has been updated successfully.`
    });
  };

  const handleDeletePlan = (planId: string) => {
    const planToDelete = plans.find(p => p.id === planId);
    setPlans(plans.filter(plan => plan.id !== planId));
    
    toast({
      title: "Plan Deleted",
      description: `${planToDelete?.name} plan has been deleted.`
    });
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      credits: plan.credits,
      price_monthly: plan.price_monthly?.toString() || '',
      price_annual: plan.price_annual?.toString() || '',
      credit_price: plan.credit_price?.toString() || '',
      plan_type: plan.plan_type,
      is_active: plan.is_active
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      credits: 0,
      price_monthly: '',
      price_annual: '',
      credit_price: '',
      plan_type: 'recurring',
      is_active: true
    });
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPlan(null);
    resetForm();
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans, pricing, and credit packages
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Plan Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Professional"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Credits</label>
                    <Input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value) || 0})}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Plan description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Monthly Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_monthly}
                      onChange={(e) => setFormData({...formData, price_monthly: e.target.value})}
                      placeholder="19.99"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Annual Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_annual}
                      onChange={(e) => setFormData({...formData, price_annual: e.target.value})}
                      placeholder="199.99"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Credit Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.credit_price}
                      onChange={(e) => setFormData({...formData, credit_price: e.target.value})}
                      placeholder="29.99"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <label className="text-sm font-medium">Active Plan</label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}>
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plans List */}
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {plan.plan_type === 'recurring' ? 'Recurring' : 'One-time'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{plan.credits}</p>
                        <p className="text-xs text-muted-foreground">Credits</p>
                      </div>
                    </div>
                    
                    {plan.price_monthly && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">${plan.price_monthly}</p>
                          <p className="text-xs text-muted-foreground">Monthly</p>
                        </div>
                      </div>
                    )}
                    
                    {plan.price_annual && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">${plan.price_annual}</p>
                          <p className="text-xs text-muted-foreground">Annual</p>
                        </div>
                      </div>
                    )}
                    
                    {plan.credit_price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium">${plan.credit_price}</p>
                          <p className="text-xs text-muted-foreground">Credit Pack</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Subscription Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">3</p>
                  <p className="text-sm text-muted-foreground">Active Plans</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">$569.97</p>
                  <p className="text-sm text-muted-foreground">Total Revenue Potential</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">350</p>
                  <p className="text-sm text-muted-foreground">Total Credits Available</p>
                </div>
              </div>
              
              <div className="mt-6 text-center text-muted-foreground">
                <p>Detailed analytics will be implemented with real subscription data integration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
