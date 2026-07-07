require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const mapUserRow = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    subject: user.subject,
    grade: user.grade,
    classes: user.classes || null,
    status: user.status || null,
    qualification: user.qualification || null,
  });

  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // seed helper
  const seedInitialData = async () => {
    const teacherUser = await db('users').where({ email: 'teacher@example.com' }).first();
    if (!teacherUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db('users').insert({ id: uuidv4(), email: 'teacher@example.com', password: hashedPassword, name: 'John Doe', role: 'teacher', subject: 'Mathematics' });
    }

    const studentUser = await db('users').where({ email: 'student@example.com' }).first();
    if (!studentUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db('users').insert({ id: uuidv4(), email: 'student@example.com', password: hashedPassword, name: 'Jane Smith', role: 'student', grade: '10th Grade' });
    }

    const adminUser = await db('users').where({ email: 'admin@example.com' }).first();
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db('users').insert({ id: uuidv4(), email: 'admin@example.com', password: hashedPassword, name: 'Admin User', role: 'admin' });
    }

    const parentUser = await db('users').where({ email: 'parent@example.com' }).first();
    let parentUserId;
    if (!parentUser) {
      parentUserId = uuidv4();
      const hashedPassword = await bcrypt.hash('password123', 10);
      await db('users').insert({ id: parentUserId, email: 'parent@example.com', password: hashedPassword, name: 'Mrs. Ndlovu', role: 'parent' });
    } else {
      parentUserId = parentUser.id;
    }

    const studentRow = await db('students').where({ id: 'BPS-2451' }).first();
    if (!studentRow) {
      await db('students').insert({
        id: 'BPS-2451',
        name: 'Tawanda Ndlovu',
        class: 'Form 4A',
        stream: 'Sciences',
        gender: 'M',
        date_of_birth: '2009-03-12',
        blood_group: 'O+',
        address: '45 Borrowdale Rd, Harare',
        status: 'Active',
        email: 'tawanda.ndlovu@schoolmanagement.edu',
        phone: '+263 77 333 4455',
        guardian_name: 'Mrs. Ndlovu',
        guardian_email: 'parent@example.com',
        guardian_phone: '+263 77 555 8888',
        guardian_user_id: parentUserId,
        current_gpa: 3.4,
      });
    }

    const classRow = await db('classes').where({ name: 'Form 4A Sciences' }).first();
    let classId;
    if (!classRow) {
      const [createdClass] = await db('classes').insert({
        teacher_id: teacherUser.id,
        name: 'Form 4A Sciences',
        subject: 'Science',
        subject_code: 'SCI401',
        grade: 'Form 4A',
      }).returning('*');
      classId = createdClass.id;
    } else {
      classId = classRow.id;
    }

    const studentClass = await db('student_classes').where({ student_id: 'BPS-2451', class_id: classId }).first();
    if (!studentClass) {
      await db('student_classes').insert({ student_id: 'BPS-2451', class_id: classId });
    }

    const existingExam = await db('exams').where({ class_id: classId, name: 'Math Midterm' }).first();
    if (!existingExam) {
      await db('exams').insert({ class_id: classId, teacher_id: teacherUser.id, name: 'Math Midterm', date: '2025-05-15' });
    }

    const existingGrade = await db('grades').where({ student_id: 'BPS-2451', subject: 'Mathematics', exam_name: 'Term 1' }).first();
    if (!existingGrade) {
      await db('grades').insert({ student_id: 'BPS-2451', subject: 'Mathematics', exam_name: 'Term 1', score: 78, grade: 'B+' });
    }

    const attendanceExists = await db('attendance').where({ student_id: 'BPS-2451' }).first();
    if (!attendanceExists) {
      await db('attendance').insert([
        { class_id: classId, student_id: 'BPS-2451', teacher_id: teacherUser.id, date: '2025-04-20', status: 'present' },
        { class_id: classId, student_id: 'BPS-2451', teacher_id: teacherUser.id, date: '2025-04-19', status: 'absent' },
        { class_id: classId, student_id: 'BPS-2451', teacher_id: teacherUser.id, date: '2025-04-18', status: 'late' },
      ]);
    }

    const feeExists = await db('fees').where({ student_id: 'BPS-2451' }).first();
    if (!feeExists) {
      await db('fees').insert({ student_id: 'BPS-2451', amount: 760.0, item: 'Term 1 — Full', method: 'Bank Transfer', due_date: '2025-04-30', status: 'Pending' });
    }

    const announcementCount = await db('announcements').count('* as cnt').first();
    if (!announcementCount || Number(announcementCount.cnt || announcementCount.count || 0) === 0) {
      await db('announcements').insert({ title: 'Term 2 fees due by 30 April', message: 'Please clear all outstanding balances before the deadline.', created_by: adminUser.id });
    }

    const documentsCount = await db('documents').count('* as cnt').first();
    if (!documentsCount || Number(documentsCount.cnt || documentsCount.count || 0) === 0) {
      await db('documents').insert([
        { student_id: 'BPS-2451', name: 'Term 1 2025 Report Card', type: 'Report Card', size: '320 KB', url: '/docs/term1-2025-report-card.pdf' },
        { student_id: 'BPS-2451', name: 'Term 1 2025 Fee Receipt', type: 'Receipt', size: '120 KB', url: '/docs/term1-2025-fee-receipt.pdf' },
      ]);
    }

    const messageCount = await db('messages').count('* as cnt').first();
    if (!messageCount || Number(messageCount.cnt || messageCount.count || 0) === 0) {
      await db('messages').insert([
        { sender_id: 'teacher-1', sender_name: 'Mr. Mhlanga', receiver_id: 'p1', receiver_name: 'Mrs. Ndlovu', subject: 'Attendance follow-up', text: 'Please remember to sign the field trip form.', is_new: true },
        { sender_id: 'p1', sender_name: 'Mrs. Ndlovu', receiver_id: 'teacher-1', receiver_name: 'Mr. Mhlanga', subject: 'Re: Attendance follow-up', text: 'Thanks, I will sign it today.', is_new: false },
      ]);
    }
  };

  // minimal auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) return res.status(400).json({ message: 'Email, password and role are required' });

      const user = await db('users').where({ email, role }).first();
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: mapUserRow(user) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // simple students endpoints used by UI/tests
  app.get('/api/students/:id', authenticateToken, async (req, res) => {
    try {
      const student = await db('students').where({ id: req.params.id }).first();
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/results', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const grades = await db('grades').where({ student_id: studentId }).orderBy('created_at', 'desc').select('*');
      res.json(grades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/exams', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const sc = await db('student_classes').where({ student_id: studentId }).first();
      const classId = sc?.class_id;
      const exams = classId ? await db('exams').where({ class_id: classId }).orderBy('date', 'asc') : [];
      const upcoming = exams.filter(e => new Date(e.date) >= new Date());
      res.json({ exams, upcoming });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // --- Library endpoints ---
  app.get('/api/library', authenticateToken, async (req, res) => {
    try {
      const q = req.query.q || null;
      let query = db('library_items');
      if (q) {
        // simple search
        const rows = await query.select('*');
        const filtered = rows.filter(r => (r.title || '').toLowerCase().includes(q.toLowerCase()) || (r.author || '').toLowerCase().includes(q.toLowerCase()));
        return res.json(filtered);
      }
      const rows = await query.select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/library', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'teacher' && req.user.role !== 'admin') return res.status(403).json({ message: 'Only staff can add library items' });
      const payload = {
        title: req.body.title,
        author: req.body.author,
        subject: req.body.subject,
        isbn: req.body.isbn || null,
        description: req.body.description || null,
        digital_url: req.body.digitalUrl || null,
        is_physical: req.body.isPhysical !== false,
        copies: req.body.copies || 1,
      };
      const [created] = await db('library_items').insert(payload).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/library/:id/bookmark', authenticateToken, async (req, res) => {
    try {
      const itemId = req.params.id;
      const userId = req.user.id;
      const [created] = await db('bookmarks').insert({ user_id: userId, item_id: itemId }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/library/:id/bookmarks', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const rows = await db('bookmarks').where({ user_id: userId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/library/:id/borrow', authenticateToken, async (req, res) => {
    try {
      const studentId = req.user.role === 'student' ? req.user.id : req.body.studentId;
      const itemId = req.params.id;
      const due = req.body.dueDate || null;
      const [created] = await db('borrowings').insert({ student_id: studentId, item_id: itemId, due_date: due }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/borrowings/:studentId', authenticateToken, async (req, res) => {
    try {
      const sid = req.params.studentId;
      const rows = await db('borrowings').where({ student_id: sid }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/classes', authenticateToken, async (req, res) => {
    try {
      const classes = await db('classes').select('*');
      res.json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/classes/:id', authenticateToken, async (req, res) => {
    try {
      const cls = await db('classes').where({ id: req.params.id }).first();
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      res.json(cls);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get students in a specific class
  app.get('/api/classes/:id/students', authenticateToken, async (req, res) => {
    try {
      const classId = req.params.id;
      const studentIds = await db('student_classes').where({ class_id: classId }).select('student_id');
      const students = await db('students').whereIn('id', studentIds.map(s => s.student_id)).select('*');
      res.json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/classes', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const [created] = await db('classes').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });
      const deleted = await db('classes').where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: 'Class not found' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/attendance/:classId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('attendance').where({ class_id: req.params.classId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/attendance', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const payloads = Array.isArray(req.body) ? req.body : [req.body];
      const normalized = payloads.map((item) => ({
        class_id: item.class_id,
        student_id: item.student_id,
        teacher_id: req.user.id,
        date: item.date,
        status: item.status,
        created_at: item.created_at || new Date(),
      }));
      const insertQuery = db('attendance').insert(normalized);
      let createdResult;
      if (typeof insertQuery.returning === 'function') {
        createdResult = await insertQuery.returning('*');
      } else {
        createdResult = await insertQuery;
      }
      res.status(201).json(Array.isArray(createdResult) ? createdResult : [createdResult]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/assignments/:classId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('assignments').where({ class_id: req.params.classId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/assignments', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      
      const { class_id, title, subject, description, due_date } = req.body;
      if (!class_id || !title) {
        return res.status(400).json({ message: 'class_id and title are required' });
      }

      const [created] = await db('assignments').insert({
        class_id,
        teacher_id: req.user.id,
        title,
        subject: subject || null,
        description: description || null,
        due_date: due_date || null,
      }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/exams/:classId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('exams').where({ class_id: req.params.classId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/exams', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      
      const { class_id, name, subject, date, total_marks } = req.body;
      if (!class_id || !name || !date) {
        return res.status(400).json({ message: 'class_id, name, and date are required' });
      }

      const [created] = await db('exams').insert({
        class_id,
        teacher_id: req.user.id,
        name,
        subject: subject || null,
        date,
        total_marks: total_marks || null,
      }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/exams/:id', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });
      const deleted = await db('exams').where({ id: req.params.id }).del();
      if (!deleted) return res.status(404).json({ message: 'Exam not found' });
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/teachers', authenticateToken, async (req, res) => {
    try {
      const rows = await db('users').where({ role: 'teacher' }).select('*');
      res.json(rows.map(mapUserRow));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/teachers', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });
      const { name, email, subject, classes, status, qualification } = req.body;
      if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [created] = await db('users').insert({
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: 'teacher',
        subject: subject || null,
        grade: null,
        classes: classes || null,
        status: status || 'Active',
        qualification: qualification || null,
      }).returning('*');
      res.status(201).json(mapUserRow(created));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/teachers/:id', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });
      const updates = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        classes: req.body.classes,
        status: req.body.status,
        qualification: req.body.qualification,
      };
      const updated = await db('users').where({ id: req.params.id, role: 'teacher' }).update(updates).returning('*');
      res.json(updated[0] ? mapUserRow(updated[0]) : null);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });
      await db('users').where({ id: req.params.id, role: 'teacher' }).del();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/resources', authenticateToken, async (req, res) => {
    try {
      const rows = await db('resources').select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/resources', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const [created] = await db('resources').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/resources/:id', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      await db('resources').where({ id: req.params.id }).del();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/inventory', authenticateToken, async (req, res) => {
    try {
      const rows = await db('inventory_items').select('*').orderBy('name', 'asc');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/inventory', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const { name, category, qty, assigned, status } = req.body;
      if (!name || typeof qty !== 'number') {
        return res.status(400).json({ message: 'Name and qty are required' });
      }
      const available = qty - (assigned || 0);
      const normalizedStatus = status || (available <= 0 ? 'Out of Stock' : available <= 10 ? 'Low Stock' : 'In Stock');
      const [created] = await db('inventory_items').insert({
        name,
        category: category || null,
        qty,
        assigned: assigned || 0,
        status: normalizedStatus,
      }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/inventory/:id', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      await db('inventory_items').where({ id: req.params.id }).del();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students', authenticateToken, async (req, res) => {
    try {
      const rows = await db('students').select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/students', authenticateToken, async (req, res) => {
    try {
      const [created] = await db('students').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/students/:id', authenticateToken, async (req, res) => {
    try {
      const updated = await db('students').where({ id: req.params.id }).update(req.body).returning('*');
      res.json(updated[0] || null);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/students/:id', authenticateToken, async (req, res) => {
    try {
      await db('students').where({ id: req.params.id }).del();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/subjects', authenticateToken, async (req, res) => {
    try {
      const rows = await db('grades').where({ student_id: req.params.id }).distinct('subject');
      res.json(rows.map(r => r.subject));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/statistics', authenticateToken, async (req, res) => {
    try {
      const totalGrades = await db('grades').where({ student_id: req.params.id }).count('* as count').first();
      const average = await db('grades').where({ student_id: req.params.id }).avg('score as avg').first();
      res.json({ totalGrades: totalGrades?.count || 0, average: Math.round(parseFloat(average?.avg || 0) * 100) / 100 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/parents/:id/children', authenticateToken, async (req, res) => {
    try {
      const parentId = req.params.id;
      if (req.user.role !== 'parent' && req.user.role !== 'admin') return res.status(403).json({ message: 'Permission denied' });

      let rows = await db('students').where({ guardian_user_id: parentId }).select('*');
      if (rows.length === 0 && req.user.email) {
        rows = await db('students').where({ guardian_email: req.user.email }).select('*');
      }

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/applications', authenticateToken, async (req, res) => {
    try {
      const rows = await db('applications').select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/applications', authenticateToken, async (req, res) => {
    try {
      const [created] = await db('applications').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/applications/:id', authenticateToken, async (req, res) => {
    try {
      const updated = await db('applications').where({ id: req.params.id }).update(req.body).returning('*');
      res.json(updated[0] || null);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/grades/:studentId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('grades').where({ student_id: req.params.studentId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/grades', authenticateToken, async (req, res) => {
    try {
      const [created] = await db('grades').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/announcements', authenticateToken, async (req, res) => {
    try {
      const rows = await db('announcements').select('*').orderBy('created_at', 'desc');
      res.json(rows.map((row) => ({ ...row, body: row.message })));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/announcements', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const audience = req.body.audience || req.body.type || 'general';
      const typeMap = {
        All: 'general',
        Parents: 'parents',
        Students: 'students',
        Teachers: 'teachers',
      };
      const payload = {
        title: req.body.title,
        message: req.body.body || req.body.content || req.body.message || '',
        type: typeMap[audience] || audience,
        created_by: req.user.id,
      };
      const [created] = await db('announcements').insert(payload).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      await db('announcements').where({ id: req.params.id }).del();
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Calendar Events endpoints
  app.get('/api/calendar-events', authenticateToken, async (req, res) => {
    try {
      const rows = await db('calendar_events').select('*').orderBy('event_date', 'asc');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/calendar-events', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      
      const { title, description, event_date, event_time, event_type, class: className, location } = req.body;
      if (!title || !event_date) {
        return res.status(400).json({ message: 'title and event_date are required' });
      }

      const [created] = await db('calendar_events').insert({
        teacher_id: req.user.id,
        title,
        description: description || null,
        event_date,
        event_time: event_time || null,
        event_type: event_type || 'event',
        class: className || null,
        location: location || null,
      }).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/documents', authenticateToken, async (req, res) => {
    try {
      const studentId = req.query.studentId;
      if (!studentId) return res.status(400).json({ message: 'studentId query is required' });
      const student = await db('students').where({ id: studentId }).first();
      if (!student) return res.status(404).json({ message: 'Student not found' });
      if (req.user.role === 'parent' && student.guardian_user_id !== req.user.id && student.guardian_email !== req.user.email) {
        return res.status(403).json({ message: 'Permission denied' });
      }
      const rows = await db('documents').where({ student_id: studentId }).orderBy('created_at', 'desc');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
      const userId = req.query.userId || req.user.id;
      const rows = await db('messages')
        .where({ sender_id: userId })
        .orWhere({ receiver_id: userId })
        .orderBy('created_at', 'asc');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
      const payload = {
        sender_id: req.user.id,
        sender_name: req.user.name || '',
        receiver_id: req.body.receiverId,
        receiver_name: req.body.receiverName,
        subject: req.body.subject || '',
        text: req.body.text || '',
        is_new: true,
      };
      const insertQuery = db('messages').insert(payload);
      let created;
      if (insertQuery && typeof insertQuery.returning === 'function') {
        const result = await insertQuery.returning('*');
        created = Array.isArray(result) ? result[0] : result;
      } else {
        created = await insertQuery;
      }
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/fees', authenticateToken, async (req, res) => {
    try {
      const studentId = req.query.studentId;
      const query = db('fees').select('*').orderBy('created_at', 'desc');
      if (studentId) query.where({ student_id: studentId });
      const rows = await query;
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/fees/:studentId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('fees').where({ student_id: req.params.studentId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/fees', authenticateToken, async (req, res) => {
    try {
      const insertQuery = db('fees').insert(req.body);
      let createdResult;
      if (typeof insertQuery.returning === 'function') {
        createdResult = await insertQuery.returning('*');
      } else {
        createdResult = await insertQuery;
      }
      const created = Array.isArray(createdResult) ? createdResult[0] : createdResult;
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/fees/:id', authenticateToken, async (req, res) => {
    try {
      const updated = await db('fees').where({ id: req.params.id }).update(req.body).returning('*');
      res.json(updated[0] || null);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/timetable/:classId', authenticateToken, async (req, res) => {
    try {
      const rows = await db('timetable').where({ class_id: req.params.classId }).select('*');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/timetable', authenticateToken, async (req, res) => {
    try {
      const allowed = ['teacher', 'admin'];
      if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Permission denied' });
      const [created] = await db('timetable').insert(req.body).returning('*');
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // --- Attendance summary for UI ---
  app.get('/api/students/:id/attendance', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const rows = await db('attendance').where({ student_id: studentId }).select('*');
      const sorted = Array.isArray(rows)
        ? rows.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
        : rows;
      res.json(sorted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/attendance/summary', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const present = await db('attendance').where({ student_id: studentId, status: 'present' }).count('* as cnt').first();
      const absent = await db('attendance').where({ student_id: studentId, status: 'absent' }).count('* as cnt').first();
      const late = await db('attendance').where({ student_id: studentId, status: 'late' }).count('* as cnt').first();
      const total = (present?.cnt || 0) + (absent?.cnt || 0) + (late?.cnt || 0);
      const rate = total > 0 ? Math.round(((present?.cnt || 0) / total) * 100) : 0;
      res.json({ present: present?.cnt || 0, absent: absent?.cnt || 0, late: late?.cnt || 0, rate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/grades/trend', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const grades = await db('grades').where({ student_id: studentId }).select('*');
      const grouped = (Array.isArray(grades) ? grades : []).reduce((acc, row) => {
        const exam = row.exam_name || 'Unknown';
        if (!acc[exam]) acc[exam] = { sum: 0, count: 0 };
        acc[exam].sum += Number(row.score || 0);
        acc[exam].count += 1;
        return acc;
      }, {});
      const trend = Object.keys(grouped)
        .sort()
        .map(exam => ({ examName: exam, average: Math.round(grouped[exam].sum / grouped[exam].count) }));
      res.json(trend);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/students/:id/report', authenticateToken, async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await db('students').where({ id: studentId }).first();
      if (!student) return res.status(404).json({ message: 'Student not found' });
      const stats = await db('grades').where({ student_id: studentId }).avg('score as average').first();
      const grades = await db('grades').where({ student_id: studentId }).select('*');
      res.json({ student, averageScore: stats?.average || 0, grades });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // attach helpers for tests
  app._seedInitialData = seedInitialData;

  return app;
}

if (require.main === module) {
  // run with real db when executed directly
  const db = require('./db');
  const app = createApp(db);
  // seed initial data
  app._seedInitialData().catch(err => console.error('Seed failed', err));
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { createApp };
