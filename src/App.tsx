
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { KpiProvider } from "@/context/KpiContext";
import Dashboard from "./pages/Dashboard";
import DailyKPIs from "./pages/DailyKPIs";
import WeeklyKPIs from "./pages/WeeklyKPIs";
import MonthlyKPIs from "./pages/MonthlyKPIs";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <KpiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <RequireAuth>
                  <DashboardLayout><Dashboard /></DashboardLayout>
                </RequireAuth>
              } />
              <Route path="/daily" element={
                <RequireAuth>
                  <DashboardLayout><DailyKPIs /></DashboardLayout>
                </RequireAuth>
              } />
              <Route path="/weekly" element={
                <RequireAuth>
                  <DashboardLayout><WeeklyKPIs /></DashboardLayout>
                </RequireAuth>
              } />
              <Route path="/monthly" element={
                <RequireAuth>
                  <DashboardLayout><MonthlyKPIs /></DashboardLayout>
                </RequireAuth>
              } />
              <Route path="/settings" element={
                <RequireAuth>
                  <DashboardLayout><Settings /></DashboardLayout>
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </KpiProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
