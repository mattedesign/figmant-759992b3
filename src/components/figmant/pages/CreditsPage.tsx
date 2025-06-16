
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Zap } from 'lucide-react';

export const CreditsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="text-muted-foreground">
          Manage your analysis credits and upgrade your plan
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Current Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">50 / 110</div>
              <Progress value={45} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Credits remaining this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Design Analysis</span>
                <span className="text-sm font-medium">45 credits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Premium Analysis</span>
                <span className="text-sm font-medium">15 credits</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium">Total Used</span>
                <span className="font-medium">60 credits</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buy More Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold mb-2">100</div>
              <div className="text-sm text-muted-foreground mb-4">Credits</div>
              <div className="text-lg font-semibold mb-4">$9.99</div>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold mb-2">250</div>
              <div className="text-sm text-muted-foreground mb-4">Credits</div>
              <div className="text-lg font-semibold mb-4">$19.99</div>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl font-bold mb-2">500</div>
              <div className="text-sm text-muted-foreground mb-4">Credits</div>
              <div className="text-lg font-semibold mb-4">$39.99</div>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
