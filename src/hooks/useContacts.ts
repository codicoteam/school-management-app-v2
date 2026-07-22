import { useState, useEffect, useCallback } from "react";
import { subscribe } from "@/lib/localDb";
import type { MockUser } from "@/lib/mockAuth";

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
    // Real-time listener — reflects all locally registered users
    const unsubscribe = subscribe<MockUser>("users", (users) => {
      const mapped: Contact[] = users.map((u) => {
        let type: Contact['type'] = 'Student';
        if (u.role === 'admin') type = 'Admin';
        else if (u.role === 'teacher') type = 'Teacher';
        else if (u.role === 'parent') type = 'Parent';
        else if (u.role === 'student') type = 'Student';

        return {
          id: u.uid,
          name: u.name || u.email || 'Unknown User',
          type,
          role: u.role,
          email: u.email,
        };
      });

      setContacts(mapped);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getContactsByType = useCallback((type: Contact['type']) => {
    return contacts.filter(c => c.type === type);
  }, [contacts]);

  const getContactById = useCallback((id: string) => {
    return contacts.find(c => c.id === id);
  }, [contacts]);

  return { contacts, loading, getContactsByType, getContactById };
};
