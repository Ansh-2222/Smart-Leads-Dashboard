import { useRef } from 'react';
import { Search, X, Download, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useLeadStore } from '@/stores/leadStore';
import { LeadSource, LeadStatus } from '@/types';


interface LeadFiltersProps {
  onAdd: () => void;
  onExport: () => void;
  isExporting: boolean;
}

export const LeadFilters = ({ onAdd, onExport, isExporting }: LeadFiltersProps) => {
  const { filters, setFilters, resetFilters } = useLeadStore();
  const searchRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters =
    filters.status || filters.source || filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <Input
            ref={searchRef}
            placeholder="Search name or email..."
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
          />
        </div>

        <div className="w-36">
          <Select
            placeholder="All Statuses"
            value={filters.status ?? ''}
            options={Object.values(LeadStatus).map((s) => ({ value: s, label: s }))}
            onChange={(e) => setFilters({ status: e.target.value as LeadStatus | '', page: 1 })}
          />
        </div>

        <div className="w-36">
          <Select
            placeholder="All Sources"
            value={filters.source ?? ''}
            options={Object.values(LeadSource).map((s) => ({ value: s, label: s }))}
            onChange={(e) => setFilters({ source: e.target.value as LeadSource | '', page: 1 })}
          />
        </div>

        <div className="w-40">
          <Select
            value={`${filters.sortBy ?? 'createdAt'}-${filters.sortOrder ?? 'desc'}`}
            options={[
              { value: 'createdAt-desc', label: 'Latest First' },
              { value: 'createdAt-asc', label: 'Oldest First' },
              { value: 'name-asc', label: 'Name A-Z' },
              { value: 'name-desc', label: 'Name Z-A' },
            ]}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                'createdAt' | 'name',
                'asc' | 'desc',
              ];
              setFilters({ sortBy, sortOrder, page: 1 });
            }}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="md" onClick={resetFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={onExport} isLoading={isExporting}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={onAdd}>
            <SlidersHorizontal className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
    </div>
  );
};
