import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
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
      <Textarea
        label="Notes"
        hint="(optional)"
        id="notes"
        rows={3}
        placeholder="Add any notes about this lead..."
        error={errors.notes?.message}
        {...register('notes')}
      />

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
