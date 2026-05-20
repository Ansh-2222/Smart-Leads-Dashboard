import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Lead } from '@/types';
import { LeadSource, LeadStatus } from '@/types';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
  source: z.nativeEnum(LeadSource, { required_error: 'Source is required' }),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  lead?: Lead;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export const LeadForm = ({ lead, onSubmit, onCancel }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: lead
      ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes ?? '' }
      : { status: LeadStatus.NEW },
  });

  useEffect(() => {
    if (lead) {
      reset({ name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes ?? '' });
    }
  }, [lead, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        id="name"
        placeholder="e.g. Rahul Sharma"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="e.g. rahul@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          id="status"
          options={Object.values(LeadStatus).map((s) => ({ value: s, label: s }))}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Source"
          id="source"
          placeholder="Select source..."
          options={Object.values(LeadSource).map((s) => ({ value: s, label: s }))}
          error={errors.source?.message}
          {...register('source')}
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Add any notes about this lead..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          {...register('notes')}
        />
        {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
