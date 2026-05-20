import { cn } from '@/utils/cn';
import { LeadSource, LeadStatus } from '@/types';

interface BadgeProps {
  value: LeadStatus | LeadSource | string;
  className?: string;
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  Website: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  Referral: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

export const Badge = ({ value, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusColors[value] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      className,
    )}
  >
    {value}
  </span>
);
