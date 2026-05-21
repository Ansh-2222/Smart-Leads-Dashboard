import { Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { leadService } from '../services/lead.service';
import { sendSuccess } from '../utils/ApiResponse';
import { AuthenticatedRequest, LeadFilters, LeadStatus, LeadSource, UserRole } from '../types';

const getUserCtx = (req: AuthenticatedRequest) => ({
  userId: req.user!.id,
  userRole: req.user!.role,
});

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters: LeadFilters = {
      status: req.query['status'] as LeadStatus | undefined,
      source: req.query['source'] as LeadSource | undefined,
      search: req.query['search'] as string | undefined,
      sortBy: (req.query['sortBy'] as LeadFilters['sortBy']) ?? 'createdAt',
      sortOrder: (req.query['sortOrder'] as 'asc' | 'desc') ?? 'desc',
      page: req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1,
      limit: req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 10,
    };
    const result = await leadService.getLeads(filters, getUserCtx(req));
    sendSuccess(res, result, 'Leads fetched');
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await leadService.getLeadById(req.params['id'] as string, getUserCtx(req));
    sendSuccess(res, { lead }, 'Lead fetched');
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await leadService.createLead(req.body, getUserCtx(req));
    sendSuccess(res, { lead }, 'Lead created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lead = await leadService.updateLead(req.params['id'] as string, req.body, getUserCtx(req));
    sendSuccess(res, { lead }, 'Lead updated');
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await leadService.deleteLead(req.params['id'] as string, getUserCtx(req));
    sendSuccess(res, null, 'Lead deleted');
  } catch (err) {
    next(err);
  }
};

export const exportLeads = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters: LeadFilters = {
      status: req.query['status'] as LeadStatus | undefined,
      source: req.query['source'] as LeadSource | undefined,
      search: req.query['search'] as string | undefined,
    };
    const leads = await leadService.exportLeads(filters, getUserCtx(req));

    const csvHeaders = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const csvRows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.status}"`,
      `"${l.source}"`,
      `"${l.notes ?? ''}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
    ]);

    const csv = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ctx = getUserCtx(req);
    const baseFilter =
      ctx.userRole === UserRole.ADMIN
        ? {}
        : { createdBy: new Types.ObjectId(ctx.userId) };

    const { LeadModel } = await import('../models/Lead.model');
    const [total, byStatus, bySource] = await Promise.all([
      LeadModel.countDocuments(baseFilter),
      LeadModel.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      LeadModel.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    sendSuccess(res, { total, byStatus, bySource }, 'Stats fetched');
  } catch (err) {
    next(err);
  }
};
