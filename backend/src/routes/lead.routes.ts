import { Router } from 'express';
import { body } from 'express-validator';
import * as leadController from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const createValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes max 1000 chars'),
];

const updateValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes max 1000 chars'),
];

router.use(authenticate);

router.get('/', leadController.getLeads);
router.get('/export/csv', leadController.exportLeads);
router.get('/stats', leadController.getStats);
router.get('/:id', leadController.getLeadById);
router.post('/', validate(createValidation), leadController.createLead);
router.put('/:id', validate(updateValidation), leadController.updateLead);
router.delete('/:id', leadController.deleteLead);

export default router;
