import { useEffect, useState } from 'react';
import { Users, TrendingUp, Target, XCircle, BarChart2 } from 'lucide-react';
import { leadsApi } from '@/api/leads.api';
import type { LeadStats } from '@/types';
import { LeadStatus, LeadSource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';
import { useLeadStore } from '@/stores/leadStore';
import toast from 'react-hot-toast';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const statsVersion = useLeadStore((s) => s.statsVersion);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leadsApi.getStats()
      .then(setStats)
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, [statsVersion]);

  const getStatusCount = (status: LeadStatus) =>
    stats?.byStatus.find((s) => s._id === status)?.count ?? 0;

  const getSourceCount = (source: LeadSource) =>
    stats?.bySource.find((s) => s._id === source)?.count ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your leads today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total Leads"
          value={stats?.total ?? 0}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          color="bg-indigo-50 dark:bg-indigo-900/30"
        />
        <StatCard
          label="Qualified"
          value={getStatusCount(LeadStatus.QUALIFIED)}
          icon={<Target className="h-5 w-5 text-green-600" />}
          color="bg-green-50 dark:bg-green-900/30"
        />
        <StatCard
          label="Contacted"
          value={getStatusCount(LeadStatus.CONTACTED)}
          icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
          color="bg-yellow-50 dark:bg-yellow-900/30"
        />
        <StatCard
          label="Lost"
          value={getStatusCount(LeadStatus.LOST)}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          color="bg-red-50 dark:bg-red-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            Leads by Status
          </h2>
          <div className="space-y-4">
            {Object.values(LeadStatus).map((status) => {
              const count = getStatusCount(status);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge value={status} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-purple-600" />
            Leads by Source
          </h2>
          <div className="space-y-4">
            {Object.values(LeadSource).map((source) => {
              const count = getSourceCount(source);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge value={source} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
