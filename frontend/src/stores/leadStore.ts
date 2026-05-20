import { create } from 'zustand';
import type { Lead, LeadFilters, PaginationMeta } from '@/types';

interface LeadState {
  leads: Lead[];
  pagination: PaginationMeta | null;
  filters: LeadFilters;
  isLoading: boolean;
  selectedLead: Lead | null;
  setLeads: (leads: Lead[], pagination: PaginationMeta) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  setLoading: (v: boolean) => void;
  setSelectedLead: (lead: Lead | null) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Lead) => void;
  removeLead: (id: string) => void;
}

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useLeadStore = create<LeadState>()((set) => ({
  leads: [],
  pagination: null,
  filters: defaultFilters,
  isLoading: false,
  selectedLead: null,
  setLeads: (leads, pagination) => set({ leads, pagination }),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters, page: filters.page ?? 1 } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedLead: (selectedLead) => set({ selectedLead }),
  addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLead: (id, lead) =>
    set((s) => ({ leads: s.leads.map((l) => (l._id === id ? lead : l)) })),
  removeLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l._id !== id) })),
}));
