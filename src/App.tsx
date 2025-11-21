import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import AuthChecker from './utils/AuthChecker';
import { Toaster } from './components/ui/toaster';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MyRequestsPage = lazy(() => import('./pages/staff/MyRequestsPage'));
const CreateRequestPage = lazy(() => import('./pages/staff/CreateRequestPage'));
const ApprovalsPage = lazy(() => import('./pages/dashboard/ApprovalsPage'));
const FinancePage = lazy(() => import('./pages/dashboard/FinancePage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthChecker>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />

            {/* Staff Routes */}
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute requiredRoles={['staff']}>
                  <MyRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-request"
              element={
                <ProtectedRoute requiredRoles={['staff']}>
                  <CreateRequestPage />
                </ProtectedRoute>
              }
            />

            {/* Approver Routes */}
            <Route
              path="/approvals"
              element={
                <ProtectedRoute requiredRoles={['approvelevel1', 'approvelevel2']}>
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            />

            {/* Finance Routes */}
            <Route
              path="/finance"
              element={
                <ProtectedRoute requiredRoles={['finance']}>
                  <FinancePage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthChecker>
    </BrowserRouter>
  );
}

export default App;
