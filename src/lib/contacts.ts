
export interface Contact {
  id: string;
  name: string;
  type: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  role?: string;
  phone?: string;
  email?: string;
}

export const contacts: Contact[] = [
  { id: "admin-1", name: "School Administrator", type: "Admin", role: "Super Admin" },
  { id: "teacher-1", name: "Mr. Mhlanga", type: "Teacher", role: "Math Lead", phone: "+263771111111" },
  { id: "teacher-2", name: "Mrs. Moyo", type: "Teacher", role: "Science Head", phone: "+263772222222" },
  { id: "parent-1", name: "Priya Verma", type: "Parent", role: "Guardian", phone: "+263774444444" },
  { id: "parent-2", name: "Neha Singh", type: "Parent", role: "Guardian", phone: "+263775555555" },
  { id: "student-1", name: "Arjun Sharma", type: "Student", role: "Form 4A", phone: "+263776666666" },
  { id: "student-2", name: "Rahul Kumar", type: "Student", role: "Form 4A", phone: "+263777777777" },
];

export const getContactsByType = (type: Contact['type']) => {
  return contacts.filter(c => c.type === type);
};

export const getContactById = (id: string) => {
  return contacts.find(c => c.id === id);
};
