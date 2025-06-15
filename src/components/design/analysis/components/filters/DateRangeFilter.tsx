
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { AdvancedFilters, DateRange } from '@/hooks/filters/types';

interface DateRangeFilterProps {
  dateRange: DateRange;
  updateFilter: (key: keyof AdvancedFilters, value: any) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  updateFilter
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Date Range</Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'From date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => updateFilter('dateRange', { ...dateRange, from: date })}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'To date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => updateFilter('dateRange', { ...dateRange, to: date })}
            />
          </PopoverContent>
        </Popover>
      </div>
      {(dateRange.from || dateRange.to) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateFilter('dateRange', { from: null, to: null })}
          className="w-full"
        >
          Clear Date Range
        </Button>
      )}
    </div>
  );
};
