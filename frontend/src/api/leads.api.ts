import { apiClient } from './axios';
import type {
  ApiResponse,
  CreateLeadDto,
  Lead,
  LeadFilters,
  LeadStats,
  PaginatedResponse,
  UpdateLeadDto,
} from '@/types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Lead>>>(`/leads?${params}`);
    return res.data.data!;
  },

  getLeadById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data.data!.lead;
  },

  createLead: async (dto: CreateLeadDto) => {
    const res = await apiClient.post<ApiResponse<{ lead: Lead }>>('/leads', dto);
    return res.data.data!.lead;
  },

  updateLead: async (id: string, dto: UpdateLeadDto) => {
    const res = await apiClient.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, dto);
    return res.data.data!.lead;
  },

  deleteLead: async (id: string) => {
    await apiClient.delete(`/leads/${id}`);
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data.data!;
  },

  exportCsv: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await apiClient.get(`/leads/export/csv?${params}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
