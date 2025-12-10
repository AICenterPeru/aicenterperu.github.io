import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import AttendancePage from "./pages/AttendancePage";
import EnrollmentPage from "./pages/EnrollmentPage";
import EnrollmentListPage from "./pages/EnrollmentListPage";
import CameraPage from "./pages/CameraPage";
import LaserPage from "./pages/LaserPage";
import AttendanceListPage from "./pages/AttendanceListPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Cambiado de BrowserRouter → HashRouter */}
      <HashRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/enrollment-list" element={<EnrollmentListPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/laser" element={<LaserPage />} />
            <Route path="/attendance-list" element={<AttendanceListPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
