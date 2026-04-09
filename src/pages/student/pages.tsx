import PlaceholderPage from "@/components/PlaceholderPage";
import { User, BookOpen, ClipboardList, Clock, DollarSign, Bell } from "lucide-react";

export const ProfilePage = () => (
  <PlaceholderPage title="My Profile" description="View your personal details, class, stream and teacher assignments." icon={User} />
);
export const AcademicsPage = () => (
  <PlaceholderPage title="Timetable & Subjects" description="View your timetable, subjects, syllabus and download learning materials." icon={BookOpen} />
);
export const ExamsPage = () => (
  <PlaceholderPage title="Exams & Results" description="View exam timetable, marks, report card and class position." icon={ClipboardList} />
);
export const AttendancePage = () => (
  <PlaceholderPage title="My Attendance" description="View your attendance record, percentage and late arrival history." icon={Clock} />
);
export const FeesPage = () => (
  <PlaceholderPage title="Fees Status" description="View fee balance, payment history and download receipts." icon={DollarSign} />
);
export const AnnouncementsPage = () => (
  <PlaceholderPage title="Announcements" description="View school announcements and notifications." icon={Bell} />
);
