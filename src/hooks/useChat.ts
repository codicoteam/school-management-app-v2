import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
}

export const useChat = (currentUserId: string | undefined, otherUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    if (db.app.options.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase is not configured. Please update src/lib/firebase.ts with your credentials.");
      return;
    }

    // Query messages where current user is either sender or receiver
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUserId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const sendMessage = async (data: {
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    subject: string;
    text: string;
  }) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...data,
        participants: [data.senderId, data.receiverId],
        createdAt: serverTimestamp(),
        isNew: true
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      throw error;
    }
  };

  return { messages, loading, sendMessage };
};
