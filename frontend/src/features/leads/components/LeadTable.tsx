import { useState } from 'react';
import { Pencil, Trash2, Eye, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Lead } from '@/types';
import { useLeadStore } from '@/stores/leadStore';

interface LeadTableProps {
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export const LeadTable = ({ onEdit, onView, onDelete }: LeadTableProps) => {
  const { leads, isLoading } = useLeadStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <EmptyState
          icon={<Users className="h-16 w-16" />}
          title="No leads found"
          description="Add your first lead or adjust your filters to see results here."
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Name</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Source</th>
              <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Created</th>
              <th className="text-right px-6 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {lead.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{lead.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.email}</td>
                <td className="px-6 py-4">
                  <Badge value={lead.status} />
                </td>
                <td className="px-6 py-4">
                  <Badge value={lead.source} />
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(lead)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lead._id)}
                      isLoading={deletingId === lead._id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
