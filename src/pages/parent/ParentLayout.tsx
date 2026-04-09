import { Outlet } from "react-router-dom";
import DashboardLayout, { NavGroup } from "@/components/DashboardLayout";
import {
  LayoutDashboard, User, ClipboardList, Clock, DollarSign, Bell, FileText,
} from "lucide-react";

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
      { label: "Child Profile", href: "/parent/child", icon: User },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Results & Performance", href: "/parent/results", icon: ClipboardList },
      { label: "Attendance", href: "/parent/attendance", icon: Clock },
    ],
  },
  {
    title: "Finance & Comms",
    items: [
      { label: "Fees & Payments", href: "/parent/fees", icon: DollarSign },
      { label: "Announcements", href: "/parent/announcements", icon: Bell },
      { label: "Reports & Documents", href: "/parent/documents", icon: FileText },
    ],
  },
];

const ParentLayout = () => (
  <DashboardLayout role="parent" roleLabel="Parent" navGroups={navGroups}>
    <Outlet />
  </DashboardLayout>
);

export default ParentLayout;
