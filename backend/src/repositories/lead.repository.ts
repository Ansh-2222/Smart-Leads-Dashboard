import mongoose from 'mongoose';
import { LeadModel } from '../models/Lead.model';
import { ILead, LeadFilters, CreateLeadDto, UpdateLeadDto, PaginatedResponse, UserRole } from '../types';

interface LeadQueryContext {
  userId: string;
  userRole: UserRole;
}

type LeadQuery = mongoose.QueryFilter<ILead>;

export class LeadRepository {
  private buildBaseQuery(filters: LeadFilters, ctx: LeadQueryContext): LeadQuery {
    const query: LeadQuery = {};

    if (ctx.userRole !== UserRole.ADMIN) {
      query['createdBy'] = ctx.userId;
    }

    if (filters.status) query['status'] = filters.status;
    if (filters.source) query['source'] = filters.source;

    if (filters.search) {
      const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query['$or'] = [{ name: regex }, { email: regex }];
    }

    return query;
  }

  async findPaginated(
    filters: LeadFilters,
    ctx: LeadQueryContext,
  ): Promise<PaginatedResponse<ILead>> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
    const skip = (page - 1) * limit;

    const sortField = filters.sortBy ?? 'createdAt';
    const sortOrder: 1 | -1 = filters.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const query = this.buildBaseQuery(filters, ctx);

    const [leads, total] = await Promise.all([
      LeadModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      LeadModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: leads as unknown as ILead[],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findAllForExport(filters: LeadFilters, ctx: LeadQueryContext): Promise<ILead[]> {
    const query = this.buildBaseQuery(filters, ctx);
    return LeadModel.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean() as unknown as ILead[];
  }

  async findById(id: string): Promise<ILead | null> {
    return LeadModel.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
  }

  async create(data: CreateLeadDto & { createdBy: string }): Promise<ILead> {
    const lead = new LeadModel(data);
    const saved = await lead.save();
    return saved.populate('createdBy', 'name email');
  }

  async update(id: string, data: UpdateLeadDto): Promise<ILead | null> {
    return LeadModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await LeadModel.findByIdAndDelete(id);
    return result !== null;
  }

  async canAccess(leadId: string, userId: string, role: UserRole): Promise<boolean> {
    if (role === UserRole.ADMIN) return true;
    const lead = await LeadModel.findById(leadId).select('createdBy');
    if (!lead) return false;
    return lead.createdBy.toString() === userId;
  }
}

export const leadRepository = new LeadRepository();
