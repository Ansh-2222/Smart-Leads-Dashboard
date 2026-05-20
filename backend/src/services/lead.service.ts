import { leadRepository } from '../repositories/lead.repository';
import { ApiError } from '../utils/ApiError';
import { CreateLeadDto, UpdateLeadDto, LeadFilters, UserRole } from '../types';

interface UserCtx {
  userId: string;
  userRole: UserRole;
}

export class LeadService {
  async getLeads(filters: LeadFilters, ctx: UserCtx) {
    return leadRepository.findPaginated(filters, ctx);
  }

  async getLeadById(id: string, ctx: UserCtx) {
    const canAccess = await leadRepository.canAccess(id, ctx.userId, ctx.userRole);
    if (!canAccess) throw new ApiError(403, 'Access denied');

    const lead = await leadRepository.findById(id);
    if (!lead) throw new ApiError(404, 'Lead not found');
    return lead;
  }

  async createLead(dto: CreateLeadDto, ctx: UserCtx) {
    return leadRepository.create({ ...dto, createdBy: ctx.userId });
  }

  async updateLead(id: string, dto: UpdateLeadDto, ctx: UserCtx) {
    const canAccess = await leadRepository.canAccess(id, ctx.userId, ctx.userRole);
    if (!canAccess) throw new ApiError(403, 'Access denied');

    const lead = await leadRepository.update(id, dto);
    if (!lead) throw new ApiError(404, 'Lead not found');
    return lead;
  }

  async deleteLead(id: string, ctx: UserCtx) {
    const canAccess = await leadRepository.canAccess(id, ctx.userId, ctx.userRole);
    if (!canAccess) throw new ApiError(403, 'Access denied');

    const deleted = await leadRepository.delete(id);
    if (!deleted) throw new ApiError(404, 'Lead not found');
  }

  async exportLeads(filters: LeadFilters, ctx: UserCtx) {
    return leadRepository.findAllForExport(filters, ctx);
  }
}

export const leadService = new LeadService();
