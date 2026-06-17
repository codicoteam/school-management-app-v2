const API_BASE_URL = 'http://localhost:3001/api';

// Mock data
const mockClasses = [
  { id: '1', name: 'Mathematics 101', subject: 'Mathematics', grade: '10th Grade', students: ['2'] },
  { id: '2', name: 'Physics 101', subject: 'Physics', grade: '11th Grade', students: ['3'] },
];

const mockResources = [
  {
    id: '1',
    name: 'Mathematics Syllabus.pdf',
    type: 'pdf' as const,
    subject: 'Mathematics',
    class: 'Form 4A',
    size: '1.2 MB',
    uploadedDate: '2026-04-10',
    downloads: 15,
  },
  {
    id: '2',
    name: 'Physics Lab Guide.pdf',
    type: 'pdf' as const,
    subject: 'Physics',
    class: 'Form 5A',
    size: '2.5 MB',
    uploadedDate: '2026-04-11',
    downloads: 8,
  }
];

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(error.message, response.status);
  }
  return response.json();
};

// Simulation of async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Classes
  getClasses: async () => {
    await delay(300);
    return mockClasses;
  },

  getClass: async (id: string) => {
    await delay(200);
    const cls = mockClasses.find(c => c.id === id);
    if (!cls) throw new ApiError('Class not found', 404);
    return cls;
  },

  createClass: async (data: any) => {
    await delay(500);
    const newClass = { id: Math.random().toString(36).substr(2, 9), ...data };
    mockClasses.push(newClass);
    return newClass;
  },

  // Attendance
  getAttendance: async (classId: string) => {
    await delay(300);
    return [];
  },

  markAttendance: async (data: any) => {
    await delay(500);
    return { success: true };
  },

  // Assignments
  getAssignments: async (classId: string) => {
    await delay(300);
    return [];
  },

  createAssignment: async (data: any) => {
    await delay(500);
    return { id: Math.random().toString(36).substr(2, 9), ...data };
  },

  // Exams
  getExams: async (classId: string) => {
    await delay(300);
    return [];
  },

  createExam: async (data: any) => {
    await delay(500);
    return { id: Math.random().toString(36).substr(2, 9), ...data };
  },

  // Resources
  getResources: async () => {
    await delay(400);
    const storedResources = localStorage.getItem('mock_resources');
    return storedResources ? JSON.parse(storedResources) : mockResources;
  },

  uploadResource: async (data: any) => {
    await delay(800);
    const current = await api.getResources();
    const newResource = { id: Math.random().toString(36).substr(2, 9), ...data };
    const updated = [...current, newResource];
    localStorage.setItem('mock_resources', JSON.stringify(updated));
    return newResource;
  },

  deleteResource: async (id: string) => {
    await delay(400);
    const current = await api.getResources();
    const updated = current.filter((r: any) => r.id !== id);
    localStorage.setItem('mock_resources', JSON.stringify(updated));
    return { success: true };
  },
};