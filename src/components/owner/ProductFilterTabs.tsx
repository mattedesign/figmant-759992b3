
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Package } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscription';

interface ProductFilterTabsProps {
  plans: SubscriptionPlan[] | undefined;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ProductFilterTabs = ({ plans, activeFilter, onFilterChange }: ProductFilterTabsProps) => {
  const allCount = plans?.length || 0;
  const creditPackCount = plans?.filter(p => p.plan_type === 'credits').length || 0;

  return (
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="all" className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <span>All Packs ({allCount})</span>
        </TabsTrigger>
        <TabsTrigger value="credits" className="flex items-center space-x-2">
          <Coins className="h-4 w-4" />
          <span>Credit Packs ({creditPackCount})</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
