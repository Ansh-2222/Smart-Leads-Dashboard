import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import type { Lead } from '@/types';
import { formatDateTime } from '@/utils/formatDate';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const fields = [
    { label: 'Email', value: lead.email },
    { label: 'Status', value: <Badge value={lead.status} /> },
    { label: 'Source', value: <Badge value={lead.source} /> },
    { label: 'Created By', value: lead.createdBy?.name ?? 'Unknown' },
    { label: 'Created At', value: formatDateTime(lead.createdAt) },
  ];

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {lead.name[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
              <span className="text-sm text-gray-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>

        {lead.notes && (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lead.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
