import { request, setToken, getToken } from "./apiClient";
import type { UserRole } from "@/contexts/AuthContext";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string, role: UserRole): Promise<AuthUser> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
  setToken(data.token);
  return data.user;
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<AuthUser> {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    if (getToken()) {
      await request("/auth/logout", { method: "POST" });
    }
  } finally {
    setToken(null);
  }
}

export async function refreshToken(): Promise<string | null> {
  try {
    const data = await request<{ token: string }>("/auth/refresh-token", { method: "POST" });
    setToken(data.token);
    return data.token;
  } catch {
    setToken(null);
    return null;
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getMe(): Promise<AuthUser | null> {
  if (!getToken()) return null;
  const data = await request<{ user?: AuthUser } & Partial<AuthUser>>("/auth/me");
  return (data.user ?? (data as AuthUser)) || null;
}
