import { useState, useEffect, useCallback } from "react";
import { subscribe, addItem, updateItem, getAll } from "@/lib/localDb";

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  text: string;
  participants: string[];
  createdAt: any;
  isNew: boolean;
  status: MessageStatus;
  _optimistic?: boolean; // local-only flag for optimistic updates
}

interface StoredMessage extends Omit<Message, "createdAt"> {
  createdAt: { seconds: number };
}

const MESSAGES_COLLECTION = "messages";

// Firestore Timestamp-compatible shape, so downstream pages that call
// `.seconds` / `.toDate()` on message timestamps keep working unchanged.
function withTimestamp(m: StoredMessage): Message {
  const seconds = m.createdAt?.seconds ?? Math.floor(Date.now() / 1000);
  return {
    ...m,
    createdAt: { seconds, toDate: () => new Date(seconds * 1000) },
  };
}

export const useChat = (currentUserId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribe<StoredMessage>(MESSAGES_COLLECTION, (all) => {
      const mine = all
        .filter((m) => m.participants?.includes(currentUserId))
        .map(withTimestamp)
        .sort((a, b) => (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0))
        .slice(0, 100);

      // Merge: keep optimistic messages that haven't been confirmed yet,
      // but prefer the real stored version when it arrives
      setMessages(prev => {
        const storedIds = new Set(mine.map(m => m.id));
        const stillOptimistic = prev.filter(m => m._optimistic && !storedIds.has(m.id));
        return [...stillOptimistic, ...mine];
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUserId]);

  // Mark messages as read when receiver opens the conversation
  const markMessagesRead = useCallback(async (conversationPartnerId: string) => {
    if (!currentUserId || !conversationPartnerId) return;
    try {
      const all = getAll<StoredMessage>(MESSAGES_COLLECTION);
      all
        .filter(m =>
          m.participants?.includes(currentUserId) &&
          m.receiverId === currentUserId &&
          m.senderId === conversationPartnerId &&
          (m.status === "sent" || m.status === "delivered")
        )
        .forEach(m => updateItem<StoredMessage>(MESSAGES_COLLECTION, m.id, { status: "read", isNew: false }));
    } catch (e) {
      // Silently fail — non-critical
    }
  }, [currentUserId]);

  const sendMessage = async (data: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    subject: string;
    text: string;
  }) => {
    // 1. Add optimistic message immediately (shows instantly like WhatsApp)
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticSeconds = Math.floor(Date.now() / 1000);
    const optimisticMsg: Message = {
      id: optimisticId,
      ...data,
      participants: [data.senderId, data.receiverId],
      createdAt: { seconds: optimisticSeconds, toDate: () => new Date(optimisticSeconds * 1000) },
      isNew: true,
      status: 'sending',
      _optimistic: true,
    };

    setMessages(prev => [optimisticMsg, ...prev]);

    try {
      // 2. Write to the local store with status = 'sent'
      addItem<Omit<StoredMessage, "id">>(MESSAGES_COLLECTION, {
        ...data,
        participants: [data.senderId, data.receiverId],
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
        isNew: true,
        status: 'sent',
      });

      // Remove optimistic on next store update (handled in merge logic above)
    } catch (error) {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      console.error("Error sending message: ", error);
      throw error;
    }
  };

  return { messages, loading, sendMessage, markMessagesRead };
};
