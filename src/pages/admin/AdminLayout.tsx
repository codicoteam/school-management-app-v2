import { Outlet } from "react-router-dom";
import DashboardLayout, { NavGroup } from "@/components/DashboardLayout";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Clock, DollarSign, Package, Megaphone, FileText, Settings,
} from "lucide-react";

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Students", href: "/admin/students", icon: GraduationCap },
      { label: "Teachers", href: "/admin/teachers", icon: Users },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Classes & Subjects", href: "/admin/academics", icon: BookOpen },
      { label: "Attendance", href: "/admin/attendance", icon: Clock },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Fees & Billing", href: "/admin/fees", icon: DollarSign },
      { label: "Inventory", href: "/admin/inventory", icon: Package },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { label: "Certificates", href: "/admin/certificates", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const AdminLayout = () => (
  <DashboardLayout role="admin" roleLabel="Admin" navGroups={navGroups}>
    <Outlet />
  </DashboardLayout>
);

export default AdminLayout;
