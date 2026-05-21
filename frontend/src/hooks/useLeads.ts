import { useCallback, useEffect } from 'react';
import { leadsApi } from '@/api/leads.api';
import { useLeadStore } from '@/stores/leadStore';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';
import type { CreateLeadDto, UpdateLeadDto } from '@/types';

export const useLeads = () => {
  const { filters, setLeads, setLoading, isLoading, bumpStats } = useLeadStore();
  const debouncedSearch = useDebounce(filters.search ?? '', 400);

  // Destructure non-search filters so that typing in search doesn't trigger
  // an intermediate fetch with the stale debounced value.
  const { status, source, sortBy, sortOrder, page, limit } = filters;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await leadsApi.getLeads({
        status,
        source,
        sortBy,
        sortOrder,
        page,
        limit,
        search: debouncedSearch,
      });
      setLeads(result.data, result.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [status, source, sortBy, sortOrder, page, limit, debouncedSearch, setLeads, setLoading]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = async (dto: CreateLeadDto) => {
    const lead = await leadsApi.createLead(dto);
    toast.success('Lead created successfully');
    fetchLeads();
    bumpStats();
    return lead;
  };

  const updateLead = async (id: string, dto: UpdateLeadDto) => {
    const lead = await leadsApi.updateLead(id, dto);
    toast.success('Lead updated successfully');
    fetchLeads();
    bumpStats();
    return lead;
  };

  const deleteLead = async (id: string) => {
    await leadsApi.deleteLead(id);
    toast.success('Lead deleted');
    fetchLeads();
    bumpStats();
  };

  const exportCsv = async () => {
    try {
      await leadsApi.exportCsv(filters);
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  return { fetchLeads, createLead, updateLead, deleteLead, exportCsv, isLoading };
};
