import { Outlet } from "react-router-dom";
import DashboardLayout, { NavGroup } from "@/components/DashboardLayout";
import {
  LayoutDashboard, User, BookOpen, ClipboardList, Clock,
  DollarSign, Bell, MessageSquare, Book
} from "lucide-react";


const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/student", icon: LayoutDashboard },
      { label: "My Profile", href: "/student/profile", icon: User },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Timetable & Subjects", href: "/student/academics", icon: BookOpen },
      { label: "Exams & Results", href: "/student/exams", icon: ClipboardList },
      { label: "Attendance", href: "/student/attendance", icon: Clock },
      { label: "Library", href: "/student/library", icon: Book },
    ],
  },
  {
    title: "Other",
    items: [
      { label: "Fees Status", href: "/student/fees", icon: DollarSign },
      { label: "Messages", href: "/student/messages", icon: MessageSquare },
      { label: "Announcements", href: "/student/announcements", icon: Bell },
    ],
  },
];

const StudentLayout = () => (
  <DashboardLayout role="student" roleLabel="Student" navGroups={navGroups}>
    <Outlet />
  </DashboardLayout>
);

export default StudentLayout;
