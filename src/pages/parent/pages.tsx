import PlaceholderPage from "@/components/PlaceholderPage";
import { User, ClipboardList, Clock, DollarSign, Bell, FileText } from "lucide-react";

export const ChildProfilePage = () => (
  <PlaceholderPage title="Child Profile" description="View your child's profile, class information and enrolled subjects." icon={User} />
);
export const ResultsPage = () => (
  <PlaceholderPage title="Results & Performance" description="View marks, report card, class position and performance trends." icon={ClipboardList} />
);
export const AttendancePage = () => (
  <PlaceholderPage title="Attendance Monitoring" description="View attendance history, alerts and attendance percentage." icon={Clock} />
);
export const FeesPage = () => (
  <PlaceholderPage title="Fees & Payments" description="View fee structure, balance, payment history and make payments." icon={DollarSign} />
);
export const AnnouncementsPage = () => (
  <PlaceholderPage title="Announcements" description="Receive school announcements, exam timetables and discipline alerts." icon={Bell} />
);
export const DocumentsPage = () => (
  <PlaceholderPage title="Reports & Documents" description="Download report cards, school letters and print student results." icon={FileText} />
);
