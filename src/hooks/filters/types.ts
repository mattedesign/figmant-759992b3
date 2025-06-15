
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface AdvancedFilters {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  confidenceRange: [number, number];
  dateRange: DateRange;
  analysisTypes: string[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export interface FilterOptions {
  statuses: string[];
  types: string[];
  analysisTypes: string[];
  confidenceRange: {
    min: number;
    max: number;
  };
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<AdvancedFilters>;
}

export interface QuickFilters {
  today: () => void;
  thisWeek: () => void;
  thisMonth: () => void;
  highConfidence: () => void;
  lowConfidence: () => void;
}
