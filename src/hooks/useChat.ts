import { useState, useEffect, useRef, useCallback } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  updateDoc,
  doc,
  where,
  limit,
  writeBatch,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  text: string;
  createdAt: any;
  isNew: boolean;
  status: MessageStatus;
  _optimistic?: boolean; // local-only flag for optimistic updates
}

export const useChat = (currentUserId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUserId),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreMsgs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Message[];

      // Merge: keep optimistic messages that haven't been confirmed yet,
      // but prefer the real Firestore version when it arrives
      setMessages(prev => {
        const firestoreIds = new Set(firestoreMsgs.map(m => m.id));
        const stillOptimistic = prev.filter(m => m._optimistic && !firestoreIds.has(m.id));
        return [...stillOptimistic, ...firestoreMsgs];
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // Mark messages as read when receiver opens the conversation
  const markMessagesRead = useCallback(async (conversationPartnerId: string) => {
    if (!currentUserId || !conversationPartnerId) return;
    try {
      const q = query(
        collection(db, "messages"),
        where("participants", "array-contains", currentUserId),
        where("receiverId", "==", currentUserId),
        where("senderId", "==", conversationPartnerId),
        where("status", "in", ["sent", "delivered"])
      );
      const snap = await getDocs(q);
      if (snap.empty) return;
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.update(d.ref, { status: "read", isNew: false }));
      await batch.commit();
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
    const optimisticMsg: Message = {
      id: optimisticId,
      ...data,
      participants: [data.senderId, data.receiverId],
      createdAt: { seconds: Math.floor(Date.now() / 1000), toDate: () => new Date() },
      isNew: true,
      status: 'sending',
      _optimistic: true,
    } as any;

    setMessages(prev => [optimisticMsg, ...prev]);

    try {
      // 2. Write to Firestore with status = 'sent'
      await addDoc(collection(db, "messages"), {
        ...data,
        participants: [data.senderId, data.receiverId],
        createdAt: serverTimestamp(),
        isNew: true,
        status: 'sent',
      });

      // Remove optimistic on next Firestore snapshot (handled in merge logic above)
    } catch (error) {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      console.error("Error sending message: ", error);
      throw error;
    }
  };

  return { messages, loading, sendMessage, markMessagesRead };
};
