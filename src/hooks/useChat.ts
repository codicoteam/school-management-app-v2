import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  text: string;
  createdAt: string;
  isNew: boolean;
}

export const useChat = (currentUserId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const rows = await api.getMessages(currentUserId);
        setMessages(rows || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentUserId]);

  const sendMessage = async (data: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    subject: string;
    text: string;
  }) => {
    await api.sendMessage(data);
    if (currentUserId) {
      const rows = await api.getMessages(currentUserId);
      setMessages(rows || []);
    }
  };

  return { messages, loading, sendMessage };
};
