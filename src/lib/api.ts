const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
    throw new ApiError(error.message || 'Request failed', response.status);
  }
  return response.json();
};

const request = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  return handleResponse(response);
};

export const api = {
  // Classes
  getClasses: async () => {
    return request(`${API_BASE_URL}/classes`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getClass: async (id: string) => {
    return request(`${API_BASE_URL}/classes/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createClass: async (data: any) => {
    return request(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteClass: async (id: string) => {
    return request(`${API_BASE_URL}/classes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Attendance
  getAttendance: async (classId: string) => {
    return request(`${API_BASE_URL}/attendance/${encodeURIComponent(classId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  markAttendance: async (data: any) => {
    return request(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Assignments
  getAssignments: async (classId: string) => {
    return request(`${API_BASE_URL}/assignments/${encodeURIComponent(classId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createAssignment: async (data: any) => {
    return request(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Exams
  getExams: async (classId: string) => {
    return request(`${API_BASE_URL}/exams/${encodeURIComponent(classId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createExam: async (data: any) => {
    return request(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteExam: async (id: string) => {
    return request(`${API_BASE_URL}/exams/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getTeachers: async () => {
    return request(`${API_BASE_URL}/teachers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createTeacher: async (data: any) => {
    return request(`${API_BASE_URL}/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateTeacher: async (id: string, data: any) => {
    return request(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteTeacher: async (id: string) => {
    return request(`${API_BASE_URL}/teachers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Resources
  getResources: async () => {
    return request(`${API_BASE_URL}/resources`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  uploadResource: async (data: any) => {
    return request(`${API_BASE_URL}/resources`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteResource: async (id: string) => {
    return request(`${API_BASE_URL}/resources/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getInventory: async () => {
    return request(`${API_BASE_URL}/inventory`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createInventoryItem: async (data: any) => {
    return request(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteInventoryItem: async (id: string) => {
    return request(`${API_BASE_URL}/inventory/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Students
  getStudents: async () => {
    return request(`${API_BASE_URL}/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentsByClass: async (classId: string) => {
    return request(`${API_BASE_URL}/classes/${encodeURIComponent(classId)}/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudent: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createStudent: async (data: any) => {
    return request(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateStudent: async (id: string, data: any) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteStudent: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getStudentSubjects: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/subjects`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentStatistics: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/statistics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentAttendanceSummary: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/attendance/summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentAttendance: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/attendance`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentReport: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/report`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getStudentGradesTrend: async (id: string) => {
    return request(`${API_BASE_URL}/students/${encodeURIComponent(id)}/grades/trend`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getParentChildren: async (parentId: string) => {
    return request(`${API_BASE_URL}/parents/${encodeURIComponent(parentId)}/children`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  // Applications (admissions)
  getApplications: async () => {
    return request(`${API_BASE_URL}/applications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  submitApplication: async (data: any) => {
    return request(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateApplication: async (id: string, data: any) => {
    return request(`${API_BASE_URL}/applications/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Grades
  getGrades: async (studentId: string) => {
    return request(`${API_BASE_URL}/grades/${encodeURIComponent(studentId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createGrade: async (data: any) => {
    return request(`${API_BASE_URL}/grades`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Announcements
  getAnnouncements: async () => {
    return request(`${API_BASE_URL}/announcements`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createAnnouncement: async (data: any) => {
    return request(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Calendar Events
  getCalendarEvents: async () => {
    return request(`${API_BASE_URL}/calendar-events`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createCalendarEvent: async (data: any) => {
    return request(`${API_BASE_URL}/calendar-events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  deleteAnnouncement: async (id: string) => {
    return request(`${API_BASE_URL}/announcements/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  getDocuments: async (studentId: string) => {
    return request(`${API_BASE_URL}/documents?studentId=${encodeURIComponent(studentId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getMessages: async (userId: string) => {
    return request(`${API_BASE_URL}/messages?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  sendMessage: async (data: any) => {
    return request(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Fees
  getFees: async (studentId?: string) => {
    const url = studentId ? `${API_BASE_URL}/fees/${encodeURIComponent(studentId)}` : `${API_BASE_URL}/fees`;
    return request(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createFee: async (data: any) => {
    return request(`${API_BASE_URL}/fees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  updateFee: async (id: string, data: any) => {
    return request(`${API_BASE_URL}/fees/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  // Timetable
  getTimetable: async (classId: string) => {
    return request(`${API_BASE_URL}/timetable/${encodeURIComponent(classId)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  createTimetable: async (data: any) => {
    return request(`${API_BASE_URL}/timetable`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },
};
