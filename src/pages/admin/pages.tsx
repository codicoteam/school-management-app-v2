import PlaceholderPage from "@/components/PlaceholderPage";
import {
  GraduationCap, Users, BookOpen, ClipboardList, Clock,
  DollarSign, Package, Megaphone, FileText, Settings,
} from "lucide-react";

export const StudentsPage = () => (
  <PlaceholderPage title="Student Management" description="Register, update, assign, promote, transfer, and manage student records." icon={GraduationCap} />
);
export const TeachersPage = () => (
  <PlaceholderPage title="Teacher Management" description="Add teachers, assign to classes/subjects, manage attendance and performance." icon={Users} />
);
export const AcademicsPage = () => (
  <PlaceholderPage title="Academic Management" description="Create timetables, assign subjects, manage schedules and learning materials." icon={BookOpen} />
);
export const AttendancePage = () => (
  <PlaceholderPage title="Attendance Management" description="Mark daily attendance, view absentees, generate reports and track late arrivals." icon={Clock} />
);
export const FeesPage = () => (
  <PlaceholderPage title="Fees & Billing" description="Create fee structures, record payments, generate receipts and finance reports." icon={DollarSign} />
);
export const InventoryPage = () => (
  <PlaceholderPage title="Inventory & Assets" description="Manage school assets, track inventory issued to departments." icon={Package} />
);
export const AnnouncementsPage = () => (
  <PlaceholderPage title="Communication" description="Send announcements, class messages, fee reminders and notifications." icon={Megaphone} />
);
export const CertificatesPage = () => (
  <PlaceholderPage title="Certificates & Documents" description="Generate report cards, clearance letters, transfer letters and admission letters." icon={FileText} />
);
export const SettingsPage = () => (
  <PlaceholderPage title="System Administration" description="Manage accounts, permissions, backups and audit logs." icon={Settings} />
);
