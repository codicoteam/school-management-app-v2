import { request, getToken, setToken } from "./apiClient";
import type { AuthUser } from "./authService";
import type { UserRole } from "@/contexts/AuthContext";

// ── Users ──
export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  createdAt?: string;
}

export const getUsers = () => request<AdminUserRecord[]>("/admin/users");

// ── School Profile ──
export interface SchoolProfile {
  schoolName: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
}

export const getSchoolProfile = () => request<SchoolProfile>("/admin/school-profile");

export const updateSchoolProfile = (data: SchoolProfile) =>
  request<SchoolProfile>("/admin/school-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ── System Settings ──
export interface SystemSetting {
  key: string;
  value: unknown;
}

function normalizeSettings(data: SystemSetting[] | Record<string, unknown>): Record<string, unknown> {
  if (Array.isArray(data)) {
    return data.reduce<Record<string, unknown>>((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  }
  return data;
}

export async function getSettings(): Promise<Record<string, unknown>> {
  const data = await request<SystemSetting[] | Record<string, unknown>>("/admin/settings");
  return normalizeSettings(data);
}

export const upsertSetting = (key: string, value: unknown) =>
  request<SystemSetting>("/admin/settings", {
    method: "POST",
    body: JSON.stringify({ key, value }),
  });

// ── Documents ──
export interface GeneratedDocument {
  id: string;
  type: string;
  studentName?: string;
  studentId?: string;
  createdAt: string;
  status?: string;
  url?: string;
}

export const generateDocument = (payload: { type: string; studentName?: string; studentId?: string }) =>
  request<GeneratedDocument>("/admin/generate-document", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getRecentDocuments = () => request<GeneratedDocument[]>("/admin/documents/recent");

// ── Audit Logs ──
export interface AuditLogEntry {
  id: string;
  who: string;
  what: string;
  timestamp: string;
}

export const getAuditLogs = () => request<AuditLogEntry[]>("/admin/audit-logs");

// ── Dashboard ──
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
}

export const getDashboardStats = () => request<DashboardStats>("/admin/dashboard/stats");
export const getDashboardEnrollment = () => request<any[]>("/admin/dashboard/enrollment");
export const getDashboardFees = () => request<any[]>("/admin/dashboard/fees");

// ── User creation ──
// There's no dedicated "admin create user" endpoint, so this reuses
// /auth/register. That endpoint logs the caller in as the new user, which
// would hijack the admin's own session — so we never let the new token
// touch localStorage; the admin's existing session is left untouched.
export async function createUserAccount(payload: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<AuthUser> {
  const adminToken = getToken();
  const data = await request<{ token: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // Make sure the admin's token wasn't clobbered by anything else in-flight.
  setToken(adminToken);
  return data.user;
}
