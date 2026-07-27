const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { createApp } = require('../server');

// create a fake in-memory db using simple arrays and functions
function createMockDb() {
  const users = [];
  const students = [];
  const grades = [];
  const student_classes = [];
  const exams = [];
  const attendance = [];
  const library_items = [];
  const bookmarks = [];
  const borrowings = [];
  const announcements = [];
  const fees = [];
  const documents = [];
  const messages = [];
  const classes = [];
  const inventory_items = [];
  const school_profile = [];
  const system_settings = [];
  const generated_documents = [];
  const audit_logs = [];
  const subjects = [];
  const assignments = [];
  const timetable = [];
  const applications = [];

  function table(name) {
    const rows = { users, students, grades, student_classes, exams, attendance, library_items, bookmarks, borrowings, announcements, fees, documents, messages, classes, inventory_items, school_profile, system_settings, generated_documents, audit_logs, subjects, assignments, timetable, applications }[name];

    function makeQb(filtered) {
      let _filtered = filtered || rows;
      let avgCalled = false;
      let countCalled = false;
      let _limit = null;
      return {
        where: function (conds) {
          if (typeof conds === 'function') {
            conds.call(this);
            return this;
          }
          if (!conds || typeof conds !== 'object') {
            return this;
          }
          if (conds.raw === true) {
            return this;
          }
          const res = _filtered.filter(r => Object.keys(conds).every(k => r[k] === conds[k]));
          _filtered = res;
          return this;
        },
        andWhere: function (fieldOrCond, value) {
          if (typeof fieldOrCond === 'function') {
            fieldOrCond.call(this);
            return this;
          }
          if (typeof fieldOrCond === 'string' && value !== undefined) {
            _filtered = _filtered.filter(r => r[fieldOrCond] === value);
            return this;
          }
          return this.where(fieldOrCond);
        },
        whereIn: function (field, values) {
          const valuesSet = new Set(values || []);
          _filtered = _filtered.filter(r => valuesSet.has(r[field]));
          return this;
        },
        orWhere: function (conds) {
          if (!conds || typeof conds !== 'object') {
            return this;
          }
          const orRows = rows.filter(r => Object.keys(conds).every(k => r[k] === conds[k]));
          const union = _filtered.concat(orRows.filter(r => !_filtered.includes(r)));
          _filtered = union;
          return this;
        },
        first: async () => {
          if (countCalled) {
            return { count: _filtered.length };
          }
          return _filtered[0] || undefined;
        },
        count: function () {
          countCalled = true;
          return this;
        },
        sum: function (expr) {
          const match = typeof expr === 'string' ? expr.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/) : null;
          const alias = match ? match[2] : 'sum';
          const field = match ? match[1] : 'value';
          return {
            first: async () => ({ [alias]: _filtered.reduce((sum, row) => sum + Number(row[field] || 0), 0) })
          };
        },
        select: function () { return this; },
        distinct: function () { return this; },
        orderBy: function () { return this; },
        limit: function (n) {
          _limit = n;
          return this;
        },
        insert: function (payload) {
          const entries = Array.isArray(payload) ? payload : [payload];
          const insertedRows = entries.map(p => {
            const row = { ...p };
            if (!row.id) row.id = `${name}-${rows.length + 1}`;
            rows.push(row);
            return row;
          });
          const insertedIds = insertedRows.map(p => p.id);
          const promiseResult = Promise.resolve(insertedIds);
          return {
            returning: async function () {
              return insertedRows;
            },
            then: promiseResult.then.bind(promiseResult),
          };
        },
        update: function (payload) {
          _filtered.forEach(row => Object.assign(row, payload));
          return {
            returning: async () => _filtered,
            then: (resolve) => Promise.resolve(_filtered.length).then(resolve),
          };
        },
        del: async () => 0,
        join: function () { return this; },
        avg: function () { avgCalled = true; return this; },
        groupBy: function () { return this; },
        countDistinct: function () { return this; },
        then: function (resolve) {
          const applyLimit = (items) => (_limit !== null ? items.slice(0, _limit) : items);
          if (avgCalled) {
            const map = {};
            _filtered.forEach(r => {
              const key = r.exam_name || 'all';
              map[key] = map[key] || { sum: 0, n: 0 };
              map[key].sum += Number(r.score || 0);
              map[key].n += 1;
            });
            const out = Object.keys(map).map(k => ({ exam_name: k, avg_score: map[k].sum / map[k].n }));
            return Promise.resolve(applyLimit(out)).then(resolve);
          }
          if (countCalled) {
            return Promise.resolve({ count: applyLimit(_filtered).length }).then(resolve);
          }
          return Promise.resolve(applyLimit(_filtered)).then(resolve);
        }
      };
    }

    const api = makeQb();
    api.insert = function (payload) {
      const entries = Array.isArray(payload) ? payload : [payload];
      const insertedRows = entries.map(p => {
        const row = { ...p };
        if (!row.id) row.id = `${name}-${rows.length + 1}`;
        rows.push(row);
        return row;
      });
      const insertedIds = insertedRows.map(p => p.id);
      const promiseResult = Promise.resolve(insertedIds);
      return {
        returning: async function () {
          return insertedRows;
        },
        then: promiseResult.then.bind(promiseResult),
      };
    };
    api.select = function () { return this; };
    return api;
  }

  table.raw = function () {
    return { raw: true };
  };

  return table;
}

describe('API routes', () => {
  let app, mockDb;

  before(async () => {
    mockDb = createMockDb();
    app = createApp(mockDb);
    // seed some mock data
    await mockDb('students').insert({ id: 'BPS-2451', name: 'Tatenda', class: 'Form 4A', guardian_email: 'parent@example.com', guardian_user_id: 'p1' });
    await mockDb('users').insert({ id: 'u1', email: 'student@example.com', password: '$2a$10$ABCDEFG', name: 'Jane', role: 'student' });
    await mockDb('users').insert({ id: 'p1', email: 'parent@example.com', password: '$2a$10$ABCDEFG', name: 'Mrs. Ndlovu', role: 'parent' });
    await mockDb('grades').insert({ id: 'g1', student_id: 'BPS-2451', subject: 'Mathematics', exam_name: 'Term 1', score: 78, grade: 'A', created_at: new Date() });
    await mockDb('student_classes').insert({ id: 'sc1', student_id: 'BPS-2451', class_id: 'class1' });
    await mockDb('exams').insert({ id: 'e1', class_id: 'class1', name: 'Math Midterm', date: new Date() });
    await mockDb('attendance').insert({ id: 'a1', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-20', status: 'present' });
    await mockDb('attendance').insert({ id: 'a2', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-19', status: 'absent' });
    await mockDb('attendance').insert({ id: 'a3', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-18', status: 'late' });
    await mockDb('fees').insert({ id: 'f1', student_id: 'BPS-2451', amount: 760.0, item: 'Term 1 — Full', method: 'Bank Transfer', due_date: '2025-04-30', status: 'Paid' });
    await mockDb('library_items').insert({ id: 'li1', title: 'Quantum Physics for Beginners', author: 'Jason Stephenson', subject: 'Science', digital_url: 'http://example.com/quantum' });
    await mockDb('documents').insert({ id: 'd1', student_id: 'BPS-2451', name: 'Term 1 2025 Report Card', type: 'Report Card', size: '320 KB', url: '/docs/term1-2025-report-card.pdf', created_at: new Date() });
    await mockDb('messages').insert({ id: 'm1', sender_id: 'teacher-1', sender_name: 'Mr. Mhlanga', receiver_id: 'p1', receiver_name: 'Mrs. Ndlovu', subject: 'Attendance follow-up', text: 'Please sign the permission slip.', is_new: true, created_at: new Date() });
    await mockDb('classes').insert({ id: 'class1', name: 'Form 4A', subject: 'Mathematics', teacher_id: 'teacher-1' });
    await mockDb('inventory_items').insert({ id: 'inv1', name: 'Chalk', category: 'Stationery', qty: 5, status: 'Low Stock' });
    await mockDb('school_profile').insert({ id: 'sp1', school_name: 'Bright Star Academy', address: 'Harare', contact_phone: '+263 772000000', public_email: 'info@brightstar.edu', motto_slogan: 'Excellence', system_currency: 'USD' });
    await mockDb('system_settings').insert({ id: 'ss1', setting_key: 'school_name', setting_value: 'Bright Star Academy', setting_type: 'string', description: 'School display name' });
    await mockDb('generated_documents').insert({ id: 'gd1', student_id: 'BPS-2451', document_type: 'Report Card', file_name: 'report_card.pdf', url: '/documents/BPS-2451/report_card.pdf', status: 'generated', generated_by: 'u1', created_at: new Date() });
    await mockDb('audit_logs').insert({ id: 'al1', admin_id: 'u1', admin_name: 'Jane', action: 'LOGIN', entity_type: 'user', entity_id: 'u1', description: 'Admin login', created_at: new Date() });
    await mockDb('subjects').insert({ id: 'subj1', name: 'Mathematics', description: 'Core mathematics' });
    await mockDb('subjects').insert({ id: 'subj2', name: 'Science', description: 'Physical sciences' });
    await mockDb('applications').insert({ id: 'app1', student_id: 'BPS-2451', full_name: 'Tatenda', status: 'pending', created_at: new Date() });
    await mockDb('users').insert({ id: 'teacher-1', email: 'teacher@example.com', password: '$2a$10$ABCDEFG', name: 'Mr. Mhlanga', role: 'teacher', subject: 'Mathematics' });
    await mockDb('users').insert({ id: 'admin-1', email: 'admin@example.com', password: '$2a$10$ABCDEFG', name: 'Admin User', role: 'admin' });
  });

  it('returns student data with valid auth', async () => {
    // create a fake token by signing with the same secret
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', 'BPS-2451');
  });

  it('creates a student when guardian email is provided and guardian_user_id is invalid', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'admin-1', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'student-create-regression-1',
        name: 'Regression Student',
        class: 'Form 1B',
        guardian_email: 'parent@example.com',
        guardian_user_id: 'p1'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id', 'student-create-regression-1');
    expect(res.body).to.have.property('guardian_email', 'parent@example.com');
  });

  it('returns student results', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/results').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('subject', 'Mathematics');
  });

  it('returns exams and upcoming', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/exams').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('exams');
    expect(res.body).to.have.property('upcoming');
  });

  it('returns grades trend', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/grades/trend').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('returns report', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/report').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('student');
    expect(res.body).to.have.property('grades');
  });

  it('returns attendance history for student', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/attendance').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(3);
  });

  it('returns parent children list', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/parents/p1/children').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('id', 'BPS-2451');
  });

  it('returns fee history for a student', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/fees/BPS-2451').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('student_id', 'BPS-2451');
    expect(res.body[0]).to.have.property('item');
    expect(res.body[0]).to.have.property('method');
  });

  it('returns student documents for a parent', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/documents').query({ studentId: 'BPS-2451' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('name', 'Term 1 2025 Report Card');
  });

  it('returns messages for a parent', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/messages').query({ userId: 'p1' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('receiver_id', 'p1');
  });

  it('creates a new message', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent', name: 'Mrs. Ndlovu' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).post('/api/messages').send({
      receiverId: 'teacher-1',
      receiverName: 'Mr. Mhlanga',
      subject: 'Follow up',
      text: 'Can I get an update on homework?',
    }).set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('sender_name', 'Mrs. Ndlovu');
    expect(res.body).to.have.property('receiver_id', 'teacher-1');
  });

  it('creates a new fee payment record', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'p1', email: 'parent@example.com', role: 'parent' }, process.env.JWT_SECRET || 'your-secret-key');

    const payment = {
      student_id: 'BPS-2451',
      amount: 120.0,
      item: 'Term 2 — Partial',
      method: 'EcoCash',
      due_date: '2025-05-15',
      paid_date: '2025-05-15',
      status: 'Paid',
    };

    const res = await request(app).post('/api/fees').send(payment).set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ student_id: 'BPS-2451', amount: 120.0, item: 'Term 2 — Partial', method: 'EcoCash', status: 'Paid' });
  });

  it('returns library list and search', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/library').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');

    const res2 = await request(app).get('/api/library').query({ q: 'quantum' }).set('Authorization', `Bearer ${token}`);
    expect(res2.status).to.equal(200);
    expect(res2.body.length).to.be.greaterThan(0);
  });

  it('allows demo access to teacher, class, and subject endpoints without a token', async () => {
    const dashboard = await request(app).get('/api/teachers/dashboard');
    expect(dashboard.status).to.equal(200);
    expect(dashboard.body).to.have.property('total_students');

    const stats = await request(app).get('/api/teachers/stats');
    expect(stats.status).to.equal(200);
    expect(stats.body).to.have.property('totalTeachers');

    const classes = await request(app).get('/api/classes');
    expect(classes.status).to.equal(200);
    expect(classes.body).to.be.an('array');

    const subjects = await request(app).get('/api/subjects');
    expect(subjects.status).to.equal(200);
    expect(subjects.body).to.be.an('array');
  });

  it('allows demo access to admissions, report-card, and grade endpoints without a token', async () => {
    const applications = await request(app).get('/api/applications');
    expect(applications.status).to.equal(200);
    expect(applications.body).to.be.an('array');

    const reportCards = await request(app).get('/api/report-cards');
    expect(reportCards.status).to.equal(200);
    expect(reportCards.body).to.be.an('array');

    const grades = await request(app).get('/api/grades/BPS-2451');
    expect(grades.status).to.equal(200);
    expect(grades.body).to.be.an('array');
  });

  it('serves teacher dashboard, stats, classes, and subjects endpoints', async () => {
    const jwt = require('jsonwebtoken');
    const teacherToken = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');
    const adminToken = jwt.sign({ id: 'admin-1', email: 'admin@example.com', role: 'admin', name: 'Admin User' }, process.env.JWT_SECRET || 'your-secret-key');

    const dashboard = await request(app).get('/api/teachers/dashboard').set('Authorization', `Bearer ${teacherToken}`);
    expect(dashboard.status).to.equal(200);
    expect(dashboard.body).to.have.property('total_students');

    const stats = await request(app).get('/api/teachers/stats').set('Authorization', `Bearer ${adminToken}`);
    expect(stats.status).to.equal(200);
    expect(stats.body).to.have.property('totalTeachers');

    const classes = await request(app).get('/api/classes').set('Authorization', `Bearer ${adminToken}`);
    expect(classes.status).to.equal(200);
    expect(classes.body).to.be.an('array');

    const subjects = await request(app).get('/api/subjects').set('Authorization', `Bearer ${adminToken}`);
    expect(subjects.status).to.equal(200);
    expect(subjects.body).to.be.an('array');
  });

  it('serves the admin dashboard, fees, and attendance endpoints for an admin', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'admin-1', email: 'admin@example.com', role: 'admin', name: 'Admin User' }, process.env.JWT_SECRET || 'your-secret-key');

    const dashboard = await request(app).get('/api/admin/dashboard/stats').set('Authorization', `Bearer ${token}`);
    expect(dashboard.status).to.equal(200);
    expect(dashboard.body).to.have.property('totalStudents');

    const enrollment = await request(app).get('/api/admin/dashboard/enrollment').set('Authorization', `Bearer ${token}`);
    expect(enrollment.status).to.equal(200);
    expect(enrollment.body).to.be.an('array');

    const fees = await request(app).get('/api/admin/fees/stats').set('Authorization', `Bearer ${token}`);
    expect(fees.status).to.equal(200);
    expect(fees.body).to.have.property('collected');

    const recentFees = await request(app).get('/api/admin/fees/recent').set('Authorization', `Bearer ${token}`);
    expect(recentFees.status).to.equal(200);
    expect(recentFees.body).to.be.an('array');

    const attendance = await request(app).get('/api/admin/attendance/stats').set('Authorization', `Bearer ${token}`);
    expect(attendance.status).to.equal(200);
    expect(attendance.body).to.have.property('present');

    const weeklyTrend = await request(app).get('/api/admin/attendance/weekly-trend').set('Authorization', `Bearer ${token}`);
    expect(weeklyTrend.status).to.equal(200);
    expect(weeklyTrend.body).to.be.an('array');
  });

  it('serves admissions, grades, and report-card endpoints for a student', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student', name: 'Jane' }, process.env.JWT_SECRET || 'your-secret-key');

    const applications = await request(app).get('/api/applications').set('Authorization', `Bearer ${token}`);
    expect(applications.status).to.equal(200);
    expect(applications.body).to.be.an('array');

    const grades = await request(app).get('/api/grades/BPS-2451').set('Authorization', `Bearer ${token}`);
    expect(grades.status).to.equal(200);
    expect(grades.body).to.be.an('array');

    const reportCards = await request(app).get('/api/report-cards').query({ studentId: 'BPS-2451' }).set('Authorization', `Bearer ${token}`);
    expect(reportCards.status).to.equal(200);
    expect(reportCards.body).to.be.an('array');
  });

  it('serves admin user, school profile, settings, document, and audit endpoints', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'admin-1', email: 'admin@example.com', role: 'admin', name: 'Admin User' }, process.env.JWT_SECRET || 'your-secret-key');

    const users = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
    expect(users.status).to.equal(200);
    expect(users.body).to.be.an('array');

    const profile = await request(app).get('/api/admin/school-profile').set('Authorization', `Bearer ${token}`);
    expect(profile.status).to.equal(200);
    expect(profile.body).to.have.property('school_name');

    const updatedProfile = await request(app).put('/api/admin/school-profile').send({ schoolName: 'Bright Star Academy', address: 'Harare', contactPhone: '+263 772000000', publicEmail: 'info@brightstar.edu', mottoSlogan: 'Excellence', systemCurrency: 'USD' }).set('Authorization', `Bearer ${token}`);
    expect(updatedProfile.status).to.equal(200);
    expect(updatedProfile.body).to.have.property('school_name', 'Bright Star Academy');

    const settings = await request(app).get('/api/admin/settings').set('Authorization', `Bearer ${token}`);
    expect(settings.status).to.equal(200);
    expect(settings.body).to.be.an('object');

    const newSetting = await request(app).post('/api/admin/settings').send({ settingKey: 'maintenance_mode', settingValue: 'false', settingType: 'boolean', description: 'Maintenance flag' }).set('Authorization', `Bearer ${token}`);
    expect(newSetting.status).to.equal(200);
    expect(newSetting.body).to.have.property('setting_key', 'maintenance_mode');

    const document = await request(app).post('/api/admin/generate-document').send({ studentId: 'BPS-2451', documentType: 'Clearance Letter', fileName: 'clearance.pdf' }).set('Authorization', `Bearer ${token}`);
    expect(document.status).to.equal(201);
    expect(document.body).to.have.property('document_type', 'Clearance Letter');

    const recentDocuments = await request(app).get('/api/admin/documents/recent').set('Authorization', `Bearer ${token}`);
    expect(recentDocuments.status).to.equal(200);
    expect(recentDocuments.body).to.be.an('array');

    const auditLogs = await request(app).get('/api/admin/audit-logs').set('Authorization', `Bearer ${token}`);
    expect(auditLogs.status).to.equal(200);
    expect(auditLogs.body).to.be.an('array');
  });
});
