import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SelectRole from "./pages/SelectRole.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import {
  StudentsPage, TeachersPage, AcademicsPage as AdminAcademicsPage,
  AttendancePage as AdminAttendancePage, FeesPage as AdminFeesPage,
  InventoryPage, AnnouncementsPage as AdminAnnouncementsPage,
  CertificatesPage, SettingsPage,
} from "./pages/admin/pages.tsx";

// Student
import StudentLayout from "./pages/student/StudentLayout.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import {
  ProfilePage, AcademicsPage as StudentAcademicsPage,
  ExamsPage as StudentExamsPage, AttendancePage as StudentAttendancePage,
  FeesPage as StudentFeesPage, AnnouncementsPage as StudentAnnouncementsPage,
} from "./pages/student/pages.tsx";

// Parent
import ParentLayout from "./pages/parent/ParentLayout.tsx";
import ParentDashboard from "./pages/parent/ParentDashboard.tsx";
import {
  ChildProfilePage, ResultsPage, AttendancePage as ParentAttendancePage,
  FeesPage as ParentFeesPage, AnnouncementsPage as ParentAnnouncementsPage,
  DocumentsPage,
} from "./pages/parent/pages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="academics" element={<AdminAcademicsPage />} />
            <Route path="exams" element={<Navigate to="/admin" replace />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="fees" element={<AdminFeesPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="academics" element={<StudentAcademicsPage />} />
            <Route path="exams" element={<StudentExamsPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="announcements" element={<StudentAnnouncementsPage />} />
          </Route>

          {/* Parent Routes */}
          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<ParentDashboard />} />
            <Route path="child" element={<ChildProfilePage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="attendance" element={<ParentAttendancePage />} />
            <Route path="fees" element={<ParentFeesPage />} />
            <Route path="announcements" element={<ParentAnnouncementsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
