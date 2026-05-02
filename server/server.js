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
    subject: 'Mathematics'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'student',
    name: 'Jane Smith',
    grade: '10th Grade'
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});