import { request } from "./apiClient";

export interface TeacherRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  subject?: string | null;
  grade?: string | null;
  classes?: string[] | null;
  status?: string | null;
  qualification?: string | null;
}

export const getTeachers = () => request<TeacherRecord[]>("/teachers");
export const getTeacher = (id: string) => request<TeacherRecord>(`/teachers/${id}`);

export const createTeacher = (data: Partial<TeacherRecord>) =>
  request<TeacherRecord>("/teachers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTeacher = (id: string, data: Partial<TeacherRecord>) =>
  request<TeacherRecord>(`/teachers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTeacher = (id: string) =>
  request<void>(`/teachers/${id}`, { method: "DELETE" });
