import { Outlet } from "react-router-dom";
import DashboardLayout, { NavGroup } from "@/components/DashboardLayout";
import {
  LayoutDashboard, User, BookOpen, ClipboardList,
  FileText, MessageSquare, Calendar, BarChart3,
  Upload, GraduationCap,
} from "lucide-react";

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
      { label: "Profile", href: "/teacher/profile", icon: User },
    ],
  },
  {
    title: "Teaching",
    items: [
      { label: "Classes & Subjects", href: "/teacher/classes", icon: BookOpen },
      { label: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
      { label: "Assignments", href: "/teacher/assignments", icon: FileText },
      { label: "Exams & Grading", href: "/teacher/exams", icon: GraduationCap },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Messages", href: "/teacher/messages", icon: MessageSquare },
      { label: "Announcements", href: "/teacher/announcements", icon: MessageSquare },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Materials", href: "/teacher/resources", icon: Upload },
      { label: "Calendar", href: "/teacher/calendar", icon: Calendar },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "Analytics", href: "/teacher/reports", icon: BarChart3 },
    ],
  },
];

const TeacherLayout = () => (
  <DashboardLayout role="teacher" roleLabel="Teacher" navGroups={navGroups}>
    <Outlet />
  </DashboardLayout>
  );

export default TeacherLayout;