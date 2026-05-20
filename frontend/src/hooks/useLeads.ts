import { useCallback, useEffect } from 'react';
import { leadsApi } from '@/api/leads.api';
import { useLeadStore } from '@/stores/leadStore';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';
import type { CreateLeadDto, LeadFilters, UpdateLeadDto } from '@/types';

export const useLeads = () => {
  const { filters, setLeads, setLoading, isLoading } = useLeadStore();
  const debouncedSearch = useDebounce(filters.search ?? '', 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const effectiveFilters: LeadFilters = { ...filters, search: debouncedSearch };
      const result = await leadsApi.getLeads(effectiveFilters);
      setLeads(result.data, result.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, setLeads, setLoading]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = async (dto: CreateLeadDto) => {
    const lead = await leadsApi.createLead(dto);
    toast.success('Lead created successfully');
    fetchLeads();
    return lead;
  };

  const updateLead = async (id: string, dto: UpdateLeadDto) => {
    const lead = await leadsApi.updateLead(id, dto);
    toast.success('Lead updated successfully');
    fetchLeads();
    return lead;
  };

  const deleteLead = async (id: string) => {
    await leadsApi.deleteLead(id);
    toast.success('Lead deleted');
    fetchLeads();
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
