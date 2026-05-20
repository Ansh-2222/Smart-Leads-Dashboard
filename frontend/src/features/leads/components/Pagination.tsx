import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLeadStore } from '@/stores/leadStore';

export const Pagination = () => {
  const { pagination, filters, setFilters } = useLeadStore();

  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-6 py-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-white">{start}–{end}</span>{' '}
        of <span className="font-medium text-gray-900 dark:text-white">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => setFilters({ page: page - 1 })}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilters({ page: p })}
            className="w-9"
          >
            {p}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => setFilters({ page: page + 1 })}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
