import { request } from "./apiClient";

export interface AnnouncementRecord {
  id: string;
  title: string;
  message: string;
  created_by?: string;
  created_at?: string;
  [key: string]: any;
}

export const getAnnouncements = () => request<AnnouncementRecord[]>("/announcements");

export const createAnnouncement = (data: { title: string; message: string }) =>
  request<AnnouncementRecord>("/announcements", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteAnnouncement = (id: string) =>
  request<void>(`/announcements/${id}`, { method: "DELETE" });
