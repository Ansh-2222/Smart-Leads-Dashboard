import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { LeadFilters } from '../components/LeadFilters';
import { LeadTable } from '../components/LeadTable';
import { LeadForm } from '../components/LeadForm';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { Pagination } from '../components/Pagination';
import { useLeads } from '@/hooks/useLeads';
import { useLeadStore } from '@/stores/leadStore';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '@/types';
import toast from 'react-hot-toast';

export const LeadsPage = () => {
  const { createLead, updateLead, deleteLead, exportCsv } = useLeads();
  const { pagination } = useLeadStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleCreate = async (data: CreateLeadDto) => {
    try {
      await createLead(data);
      setIsCreateOpen(false);
    } catch {
      toast.error('Failed to create lead');
    }
  };

  const handleUpdate = async (data: UpdateLeadDto) => {
    if (!editingLead) return;
    try {
      await updateLead(editingLead._id, data);
      setEditingLead(null);
    } catch {
      toast.error('Failed to update lead');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportCsv();
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pagination ? `${pagination.total} total leads` : 'Manage your leads'}
          </p>
        </div>
      </div>

      <LeadFilters
        onAdd={() => setIsCreateOpen(true)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <LeadTable
        onEdit={setEditingLead}
        onView={setViewingLead}
        onDelete={deleteLead}
      />

      <Pagination />

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead">
        <LeadForm
          lead={editingLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditingLead(null)}
        />
      </Modal>

      <LeadDetailModal lead={viewingLead} onClose={() => setViewingLead(null)} />
    </div>
  );
};
