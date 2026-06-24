import { useState, useEffect, useCallback } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Contact {
  id: string;
  name: string;
  type: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  role?: string;
  phone?: string;
  email?: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener — fetches all registered Firebase users
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: Contact[] = snapshot.docs.map(doc => {
        const data = doc.data();
        let type: Contact['type'] = 'Student';
        if (data.role === 'admin') type = 'Admin';
        else if (data.role === 'teacher') type = 'Teacher';
        else if (data.role === 'parent') type = 'Parent';
        else if (data.role === 'student') type = 'Student';

        return {
          id: doc.id,
          name: data.name || data.email || 'Unknown User',
          type,
          role: data.role,
          email: data.email,
          phone: data.phone
        };
      });

      setContacts(users);
      setLoading(false);
    }, (error) => {
      console.error("useContacts: Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getContactsByType = useCallback((type: Contact['type']) => {
    return contacts.filter(c => c.type === type);
  }, [contacts]);

  const getContactById = useCallback((id: string) => {
    return contacts.find(c => c.id === id);
  }, [contacts]);

  return { contacts, loading, getContactsByType, getContactById };
};
