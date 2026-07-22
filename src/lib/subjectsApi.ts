import { request } from "./apiClient";

export interface SubjectRecord {
  id: string;
  name: string;
  description?: string | null;
  teachersCount?: number;
  classesCount?: number;
}

export const getSubjects = () => request<SubjectRecord[]>("/subjects");

export const createSubject = (data: Partial<SubjectRecord>) =>
  request<SubjectRecord>("/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });
