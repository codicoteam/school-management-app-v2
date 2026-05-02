const API_BASE_URL = 'http://localhost:3001/api';

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

export const api = {
  // Classes
  getClasses: () => {
    return fetch(`${API_BASE_URL}/classes`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getClass: (id: string) => {
    return fetch(`${API_BASE_URL}/classes/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  createClass: (data: any) => {
    return fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // Attendance
  getAttendance: (classId: string) => {
    return fetch(`${API_BASE_URL}/attendance/${classId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  markAttendance: (data: any) => {
    return fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // Assignments
  getAssignments: (classId: string) => {
    return fetch(`${API_BASE_URL}/assignments/${classId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  createAssignment: (data: any) => {
    return fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  // Exams
  getExams: (classId: string) => {
    return fetch(`${API_BASE_URL}/exams/${classId}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  createExam: (data: any) => {
    return fetch(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
};