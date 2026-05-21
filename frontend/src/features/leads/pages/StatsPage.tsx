import { useEffect, useState } from 'react';
import { leadsApi } from '@/api/leads.api';
import type { LeadStats } from '@/types';
import { LeadStatus, LeadSource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useLeadStore } from '@/stores/leadStore';
import toast from 'react-hot-toast';

export const StatsPage = () => {
  const statsVersion = useLeadStore((s) => s.statsVersion);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leadsApi.getStats().then(setStats).catch(() => toast.error('Failed to load stats')).finally(() => setLoading(false));
  }, [statsVersion]);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed overview of your lead pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Status Breakdown</h2>
          <div className="space-y-3">
            {Object.values(LeadStatus).map((status) => {
              const item = stats?.byStatus.find((s) => s._id === status);
              const count = item?.count ?? 0;
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className="w-28"><Badge value={status} /></div>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Source Breakdown</h2>
          <div className="space-y-3">
            {Object.values(LeadSource).map((source) => {
              const item = stats?.bySource.find((s) => s._id === source);
              const count = item?.count ?? 0;
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={source} className="flex items-center gap-4">
                  <div className="w-28"><Badge value={source} /></div>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Total Leads</h2>
        <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{stats?.total ?? 0}</p>
      </div>
    </div>
  );
};
