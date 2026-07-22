import { request } from "./apiClient";

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  classId: string;
  status: "Present" | "Absent" | "Late";
  date?: string;
  [key: string]: any;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  rate: number;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  "classAvg%": number;
}

export interface WeeklyTrendItem {
  day: string;
  present: number;
  total: number;
  percentage: number;
}

export const getClassAttendance = (classId: string) =>
  request<AttendanceRecord[]>(`/attendance/${classId}`);

export const createAttendance = (records: AttendanceRecord[]) =>
  request<AttendanceRecord[]>("/attendance", {
    method: "POST",
    body: JSON.stringify(records),
  });

export const getStudentAttendance = (studentId: string) =>
  request<AttendanceRecord[]>(`/students/${studentId}/attendance`);

export const getStudentAttendanceSummary = (studentId: string) =>
  request<AttendanceSummary>(`/students/${studentId}/attendance/summary`);

export const getAdminAttendanceStats = () =>
  request<AttendanceStats>("/admin/attendance/stats");

export const getAdminAttendanceWeeklyTrend = () =>
  request<WeeklyTrendItem[]>("/admin/attendance/weekly-trend");
