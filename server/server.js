const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (replace with database later)
let users = [
  {
    id: '1',
    email: 'teacher@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'teacher',
    name: 'John Doe',
    subject: 'Mathematics',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'student@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'student',
    name: 'Jane Smith',
    grade: '10th Grade',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString()
  }
];

let classes = [
  {
    id: '1',
    teacherId: '1',
    name: 'Mathematics 101',
    subject: 'Mathematics',
    grade: '10th Grade',
    students: ['2']
  }
];

let attendance = [];
let assignments = [];
let exams = [];
let resources = [];

// Admin data stores
let schoolProfile = {
  schoolName: 'School Management',
  motto: 'Knowledge · Discipline · Excellence',
  address: '123 Borrowdale Rd, Harare, Zimbabwe',
  phone: '+263 242 333 100',
  email: 'info@schoolmanagement.edu',
  currency: 'USD'
};

let systemSettings = {
  twoFactor: true,
  dailyBackups: true,
  emailNotifications: true,
  smsAlerts: false
};

let auditLogs = [];
let generatedDocuments = [];
let payments = []; // { studentId, amount, expectedAmount, month, paidAt }

const addAuditLog = (who, what) => {
  auditLogs.push({
    id: uuidv4(),
    who,
    what,
    timestamp: new Date().toISOString()
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to restrict a route to admins
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = users.find(u => u.email === email && u.role === role);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, subject, grade } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role,
      name,
      createdAt: new Date().toISOString(),
      ...(role === 'teacher' && { subject }),
      ...(role === 'student' && { grade })
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // JWTs are stateless here, so there's no server-side session to destroy —
  // this just gives the client a well-defined endpoint to call.
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/refresh-token', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ── Admin routes ──

app.get('/api/admin/school-profile', authenticateToken, requireAdmin, (req, res) => {
  res.json(schoolProfile);
});

app.put('/api/admin/school-profile', authenticateToken, requireAdmin, (req, res) => {
  schoolProfile = { ...schoolProfile, ...req.body };
  addAuditLog(req.user.email, 'Updated school profile settings');
  res.json(schoolProfile);
});

app.get('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  res.json(systemSettings);
});

app.post('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  const { key, value } = req.body;
  if (!key) {
    return res.status(400).json({ message: 'key is required' });
  }
  systemSettings[key] = value;
  addAuditLog(req.user.email, `Updated setting "${key}" to ${value}`);
  res.json({ key, value });
});

app.post('/api/admin/generate-document', authenticateToken, requireAdmin, (req, res) => {
  const { type, studentName, studentId } = req.body;
  if (!type) {
    return res.status(400).json({ message: 'Document type is required' });
  }

  const document = {
    id: uuidv4(),
    type,
    studentName,
    studentId,
    status: 'Generated',
    createdAt: new Date().toISOString()
  };

  generatedDocuments.push(document);
  addAuditLog(req.user.email, `Generated ${type}${studentName ? ` for ${studentName}` : ''}`);
  res.status(201).json(document);
});

app.get('/api/admin/documents/recent', authenticateToken, requireAdmin, (req, res) => {
  const recent = [...generatedDocuments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
  res.json(recent);
});

app.get('/api/admin/audit-logs', authenticateToken, requireAdmin, (req, res) => {
  const recent = [...auditLogs]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
  res.json(recent);
});

app.get('/api/admin/dashboard/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalClasses = classes.length;
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  res.json({ totalStudents, totalTeachers, totalClasses, totalRevenue });
});

app.get('/api/admin/dashboard/enrollment', authenticateToken, requireAdmin, (req, res) => {
  const students = users.filter(u => u.role === 'student');
  const counts = {};

  students.forEach(s => {
    const d = new Date(s.createdAt || Date.now());
    const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    counts[key] = (counts[key] || 0) + 1;
  });

  const trend = Object.entries(counts).map(([month, count]) => ({ month, students: count }));
  res.json(trend);
});

app.get('/api/admin/dashboard/fees', authenticateToken, requireAdmin, (req, res) => {
  const counts = {};

  payments.forEach(p => {
    const key = p.month || new Date(p.paidAt || Date.now()).toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (!counts[key]) counts[key] = { collected: 0, expected: 0 };
    counts[key].collected += p.amount || 0;
    counts[key].expected += p.expectedAmount || p.amount || 0;
  });

  const trend = Object.entries(counts).map(([month, v]) => ({ month, ...v }));
  res.json(trend);
});

// Protected routes
app.get('/api/classes', authenticateToken, (req, res) => {
  if (req.user.role === 'teacher') {
    const teacherClasses = classes.filter(c => c.teacherId === req.user.id);
    res.json(teacherClasses);
  } else {
    res.json(classes);
  }
});

app.get('/api/classes/:id', authenticateToken, (req, res) => {
  const classItem = classes.find(c => c.id === req.params.id);
  if (!classItem) {
    return res.status(404).json({ message: 'Class not found' });
  }
  res.json(classItem);
});

app.post('/api/classes', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create classes' });
  }

  const newClass = {
    id: uuidv4(),
    teacherId: req.user.id,
    ...req.body
  };

  classes.push(newClass);
  res.status(201).json(newClass);
});

// Attendance routes
app.get('/api/attendance/:classId', authenticateToken, (req, res) => {
  const classAttendance = attendance.filter(a => a.classId === req.params.classId);
  res.json(classAttendance);
});

app.post('/api/attendance', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can mark attendance' });
  }

  const newAttendance = {
    id: uuidv4(),
    ...req.body,
    teacherId: req.user.id,
    date: new Date().toISOString()
  };

  attendance.push(newAttendance);
  res.status(201).json(newAttendance);
});

// Assignments routes
app.get('/api/assignments/:classId', authenticateToken, (req, res) => {
  const classAssignments = assignments.filter(a => a.classId === req.params.classId);
  res.json(classAssignments);
});

app.post('/api/assignments', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create assignments' });
  }

  const newAssignment = {
    id: uuidv4(),
    ...req.body,
    teacherId: req.user.id,
    createdAt: new Date().toISOString()
  };

  assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

// Exams routes
app.get('/api/exams/:classId', authenticateToken, (req, res) => {
  const classExams = exams.filter(e => e.classId === req.params.classId);
  res.json(classExams);
});

app.post('/api/exams', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create exams' });
  }

  const newExam = {
    id: uuidv4(),
    ...req.body,
    teacherId: req.user.id,
    createdAt: new Date().toISOString()
  };

  exams.push(newExam);
  res.status(201).json(newExam);
});

// Resources routes
app.get('/api/resources', authenticateToken, (req, res) => {
  // Filter resources based on user role and permissions
  if (req.user.role === 'teacher') {
    // Teachers can see all resources
    res.json(resources);
  } else {
    // Students can see resources for their classes
    // For simplicity, we'll show all resources (in a real app, you'd filter by class)
    res.json(resources);
  }
});

app.post('/api/resources', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can upload resources' });
  }

  const newResource = {
    id: uuidv4(),
    ...req.body,
    uploadedBy: req.user.id,
    uploadedAt: new Date().toISOString(),
    downloads: 0
  };

  resources.push(newResource);
  res.status(201).json(newResource);
});

app.delete('/api/resources/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can delete resources' });
  }

  const resourceIndex = resources.findIndex(r => r.id === req.params.id);
  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources.splice(resourceIndex, 1);
  res.status(200).json({ message: 'Resource deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});