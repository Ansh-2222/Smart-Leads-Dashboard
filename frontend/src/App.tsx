import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/leads/pages/DashboardPage';
import { LeadsPage } from '@/features/leads/pages/LeadsPage';
import { StatsPage } from '@/features/leads/pages/StatsPage';
import { useThemeStore } from '@/stores/themeStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const TOAST_BASE = { borderRadius: '10px' } as const;

const App = () => {
  const { isDark } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toastStyle = isDark
    ? { ...TOAST_BASE, background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }
    : { ...TOAST_BASE, background: '#fff', color: '#111827', border: '1px solid #e5e7eb' };

  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: toastStyle }} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
