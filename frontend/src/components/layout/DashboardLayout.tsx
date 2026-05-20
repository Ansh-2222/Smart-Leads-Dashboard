import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
    <Sidebar />
    <main className="flex-1 ml-64 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">{children}</div>
    </main>
  </div>
);
