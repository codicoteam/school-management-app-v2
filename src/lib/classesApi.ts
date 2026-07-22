import { request } from "./apiClient";

export interface ClassRecord {
  id: string;
  teacher_id?: string | null;
  name: string;
  subject?: string | null;
  subject_code?: string | null;
  grade?: string | null;
}

export interface ClassStudent {
  id: string;
  name: string;
  email?: string;
  [key: string]: any;
}

export const getClasses = () => request<ClassRecord[]>("/classes");
export const getClassRecord = (id: string) => request<ClassRecord>(`/classes/${id}`);

export const createClass = (data: Partial<ClassRecord>) =>
  request<ClassRecord>("/classes", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteClass = (id: string) =>
  request<void>(`/classes/${id}`, { method: "DELETE" });

export const getClassStudents = (id: string) =>
  request<ClassStudent[]>(`/classes/${id}/students`);
