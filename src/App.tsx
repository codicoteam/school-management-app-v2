import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import SelectRole from "./pages/SelectRole.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

// Admin
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import StudentsPage from "./pages/admin/StudentsPage.tsx";
import ExamsPage from "./pages/admin/ExamsPage.tsx";
import TeachersPage from "./pages/admin/TeachersPage.tsx";
import AdminAcademicsPage from "./pages/admin/AcademicsPage.tsx";
import AdminAttendancePage from "./pages/admin/AttendancePage.tsx";
import AdminFeesPage from "./pages/admin/FeesPage.tsx";
import InventoryPage from "./pages/admin/InventoryPage.tsx";
import AdminAnnouncementsPage from "./pages/admin/AnnouncementsPage.tsx";
import CertificatesPage from "./pages/admin/CertificatesPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";

// Student
import StudentLayout from "./pages/student/StudentLayout.tsx";
import StudentDashboard from "./pages/student/StudentDashboard.tsx";
import StudentProfilePage from "./pages/student/ProfilePage.tsx";
import StudentAcademicsPage from "./pages/student/AcademicsPage.tsx";
import StudentExamsPage from "./pages/student/ExamsPage.tsx";
import StudentAttendancePage from "./pages/student/AttendancePage.tsx";
import StudentFeesPage from "./pages/student/FeesPage.tsx";
import StudentAnnouncementsPage from "./pages/student/AnnouncementsPage.tsx";
import StudentMessagesPage from "./pages/student/MessagesPage.tsx";

// Parent
import ParentLayout from "./pages/parent/ParentLayout.tsx";
import ParentDashboard from "./pages/parent/ParentDashboard.tsx";
import ChildProfilePage from "./pages/parent/ChildProfilePage.tsx";
import ResultsPage from "./pages/parent/ResultsPage.tsx";
import ParentAttendancePage from "./pages/parent/AttendancePage.tsx";
import ParentFeesPage from "./pages/parent/FeesPage.tsx";
import ParentAnnouncementsPage from "./pages/parent/AnnouncementsPage.tsx";
import DocumentsPage from "./pages/parent/DocumentsPage.tsx";
import ParentMessagesPage from "./pages/parent/MessagesPage.tsx";

// Teacher
import TeacherLayout from "./pages/teacher/TeacherLayout.tsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.tsx";
import TeacherProfilePage from "./pages/teacher/ProfilePage.tsx";
import ClassesPage from "./pages/teacher/ClassesPage.tsx";
import TeacherAttendancePage from "./pages/teacher/AttendancePage.tsx";
import AssignmentsPage from "./pages/teacher/AssignmentsPage.tsx";
import TeacherExamsPage from "./pages/teacher/ExamsPage.tsx";
import TeacherMessagesPage from "./pages/teacher/MessagesPage.tsx";
import TeacherAnnouncementsPage from "./pages/teacher/AnnouncementsPage.tsx";
import ResourcesPage from "./pages/teacher/ResourcesPage.tsx";
import CalendarPage from "./pages/teacher/CalendarPage.tsx";
import ReportsPage from "./pages/teacher/ReportsPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="academics" element={<AdminAcademicsPage />} />
              <Route path="exams" element={<ExamsPage />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="fees" element={<AdminFeesPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Student */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="academics" element={<StudentAcademicsPage />} />
              <Route path="exams" element={<StudentExamsPage />} />
              <Route path="attendance" element={<StudentAttendancePage />} />
              <Route path="fees" element={<StudentFeesPage />} />
              <Route path="messages" element={<StudentMessagesPage />} />
              <Route path="announcements" element={<StudentAnnouncementsPage />} />
            </Route>

            {/* Parent */}
            <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentLayout /></ProtectedRoute>}>
              <Route index element={<ParentDashboard />} />
              <Route path="child" element={<ChildProfilePage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="attendance" element={<ParentAttendancePage />} />
              <Route path="fees" element={<ParentFeesPage />} />
              <Route path="messages" element={<ParentMessagesPage />} />
              <Route path="announcements" element={<ParentAnnouncementsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
            </Route>

            {/* Teacher */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherLayout /></ProtectedRoute>}>
              <Route index element={<TeacherDashboard />} />
              <Route path="profile" element={<TeacherProfilePage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="exams" element={<TeacherExamsPage />} />
              <Route path="messages" element={<TeacherMessagesPage />} />
              <Route path="announcements" element={<TeacherAnnouncementsPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
