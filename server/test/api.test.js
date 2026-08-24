const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const { createApp } = require('../server');

// create a fake in-memory db using simple arrays and functions
function createMockDb() {
  const users = [];
  const students = [];
  const grades = [];
  const student_classes = [];
  const exams = [];
  const exam_grades = [];
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
  const resources = [];
  const school_profile = [];
  const system_settings = [];
  const generated_documents = [];
  const audit_logs = [];
  const subjects = [];
  const assignments = [];
  const timetable = [];
  const applications = [];
  const payment_transactions = [];

  function table(name) {
    const rows = { users, students, grades, student_classes, exams, exam_grades, attendance, library_items, bookmarks, borrowings, announcements, fees, documents, messages, classes, inventory_items, resources, school_profile, system_settings, generated_documents, audit_logs, subjects, assignments, timetable, applications, payment_transactions }[name] || [];

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
        whereRaw: function (raw, bindings) {
          if (typeof raw !== 'string' || !Array.isArray(bindings) || bindings.length === 0) {
            return this;
          }
          const match = raw.match(/([a-zA-Z_][a-zA-Z0-9_]*)::text\s*=\s*\?/);
          if (match) {
            const field = match[1];
            const value = bindings[0];
            _filtered = _filtered.filter(r => String(r[field]) === String(value));
          }
          return this;
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
        del: async () => {
          const deletedCount = _filtered.length;
          if (deletedCount > 0) {
            for (const row of _filtered) {
              const index = rows.indexOf(row);
              if (index !== -1) {
                rows.splice(index, 1);
              }
            }
          }
          return deletedCount;
        },
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
    await mockDb('students').insert({ id: 'BPS-2451', name: 'Tatenda', class: 'Form 4A', email: 'student@example.com', guardian_email: 'parent@example.com', guardian_user_id: 'p1' });
    await mockDb('users').insert({ id: 'u1', email: 'student@example.com', password: await bcrypt.hash('password', 10), name: 'Jane', role: 'student' });
    await mockDb('users').insert({ id: 'p1', email: 'parent@example.com', password: await bcrypt.hash('password', 10), name: 'Mrs. Ndlovu', role: 'parent' });
    await mockDb('grades').insert({ id: 'g1', student_id: 'BPS-2451', subject: 'Mathematics', exam_name: 'Term 1', score: 78, grade: 'A', created_at: new Date() });
    await mockDb('student_classes').insert({ id: 'sc1', student_id: 'BPS-2451', class_id: 'class1' });
    await mockDb('exams').insert({ id: 'e1', class_id: 'class1', name: 'Math Midterm', date: new Date() });
    await mockDb('attendance').insert({ id: 'a1', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-20', status: 'present' });
    await mockDb('attendance').insert({ id: 'a2', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-19', status: 'absent' });
    await mockDb('attendance').insert({ id: 'a3', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-18', status: 'late' });
    await mockDb('fees').insert({ id: 'f1', student_id: 'BPS-2451', amount: 760.0, item: 'Term 1 — Full', method: 'Bank Transfer', due_date: '2025-04-30', status: 'Paid' });
    await mockDb('library_items').insert({ id: 'li1', title: 'Quantum Physics for Beginners', author: 'Jason Stephenson', subject: 'Science', digital_url: 'http://example.com/quantum' });
    await mockDb('bookmarks').insert({ id: 'bm1', user_id: 'u1', item_id: 'li1' });
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
    await mockDb('resources').insert({ id: 'res1', title: 'Algebra notes', url: '/uploads/algebra.pdf', uploaded_by: 'teacher-1', material_type: 'document', filename: 'algebra.pdf' });
    await mockDb('timetable').insert({ id: 'tt1', class_id: 'class1', date: '2025-05-01', period: '1', subject: 'Mathematics', teacher_id: 'teacher-1' });
    await mockDb('users').insert({ id: 'teacher-1', email: 'teacher@example.com', password: await bcrypt.hash('password', 10), name: 'Mr. Mhlanga', role: 'teacher', subject: 'Mathematics' });
    await mockDb('users').insert({ id: 'admin-1', email: 'admin@example.com', password: await bcrypt.hash('password', 10), name: 'Admin User', role: 'admin' });
  });

  it('returns student data with valid auth', async () => {
    // create a fake token by signing with the same secret
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', 'BPS-2451');
  });

  it('creates a student profile when a student registers', async () => {
    const registration = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'new-student@example.com',
        password: 'password123',
        name: 'New Student',
        role: 'student'
      });

    expect(registration.status).to.equal(201);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'new-student@example.com', password: 'password123', role: 'student' });

    expect(login.status).to.equal(200);

    const profile = await request(app)
      .get('/api/students/profile')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(profile.status).to.equal(200);
    expect(profile.body.student).to.include({
      id: login.body.user.id,
      name: 'New Student',
      email: 'new-student@example.com'
    });

    const students = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(students.status).to.equal(200);
    expect(students.body).to.deep.include(profile.body.student);
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

  it('creates a student when no id is provided', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'admin-1', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Auto ID Student',
        class: 'Form 2A',
        guardian_email: 'parent@example.com',
        guardian_user_id: 'p1'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id').that.is.a('string');
    expect(res.body.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
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

  it('creates exam entries for a class', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/exams')
      .set('Authorization', `Bearer ${token}`)
      .send({ class_id: 'class1', name: 'Midterm Exam', subject: 'Science', date: '2025-05-20', total_marks: 100 });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('class_id', 'class1');
    expect(res.body).to.have.property('teacher_id', 'teacher-1');
    expect(res.body).to.have.property('name', 'Midterm Exam');
  });

  it('returns all exams with class metadata', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .get('/api/exams')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('class_name', 'Form 4A');
    expect(res.body[0]).to.have.property('subject', 'Mathematics');
  });

  it('returns student profile with enrolled classes', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/BPS-2451/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('student');
    expect(res.body).to.have.property('classes');
    expect(res.body.student).to.have.property('id', 'BPS-2451');
    expect(res.body.classes).to.be.an('array');
    expect(res.body.classes[0]).to.have.property('id', 'class1');
  });

  it('returns logged in student profile without id', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'BPS-2451', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('student');
    expect(res.body.student).to.have.property('id', 'BPS-2451');
    expect(res.body).to.have.property('classes');
    expect(res.body.classes).to.be.an('array');
  });

  it('returns logged in student profile by email when user id differs', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/students/profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('student');
    expect(res.body.student).to.have.property('id', 'BPS-2451');
    expect(res.body).to.have.property('classes');
    expect(res.body.classes).to.be.an('array');
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

  it('creates attendance records for a teacher', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const payload = {
      class_id: 'class1',
      student_id: 'BPS-2451',
      date: '2025-05-01',
      status: 'present',
    };

    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.include({ class_id: 'class1', student_id: 'BPS-2451', date: '2025-05-01', status: 'present', teacher_id: 'teacher-1' });
  });

  it('serves resources, inventory, and timetable endpoints for a teacher', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const resourcesRes = await request(app).get('/api/resources').set('Authorization', `Bearer ${token}`);
    expect(resourcesRes.status).to.equal(200);
    expect(resourcesRes.body).to.be.an('array');
    expect(resourcesRes.body[0]).to.have.property('title', 'Algebra notes');

    const createResourceRes = await request(app)
      .post('/api/resources')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Geometry worksheet', url: '/uploads/geometry.pdf', material_type: 'worksheet', filename: 'geometry.pdf' });
    expect(createResourceRes.status).to.equal(201);
    expect(createResourceRes.body).to.have.property('title', 'Geometry worksheet');
    expect(createResourceRes.body).to.have.property('uploaded_by', 'teacher-1');

    const inventoryRes = await request(app).get('/api/inventory').set('Authorization', `Bearer ${token}`);
    expect(inventoryRes.status).to.equal(200);
    expect(inventoryRes.body).to.be.an('array');
    expect(inventoryRes.body[0]).to.have.property('name', 'Chalk');

    const createInventoryRes = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Markers', category: 'Stationery', qty: 12, assigned: 2, status: 'In Stock' });
    expect(createInventoryRes.status).to.equal(201);
    expect(createInventoryRes.body).to.have.property('name', 'Markers');

    const deleteInventoryRes = await request(app).delete('/api/inventory/inv1').set('Authorization', `Bearer ${token}`);
    expect(deleteInventoryRes.status).to.equal(204);

    const uploadResourceRes = await request(app)
      .post('/api/resources/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Uploaded worksheet')
      .field('material_type', 'worksheet')
      .attach('file', Buffer.from('test content'), 'worksheet.pdf');
    expect(uploadResourceRes.status).to.equal(201);
    expect(uploadResourceRes.body).to.have.property('title', 'Uploaded worksheet');
    expect(uploadResourceRes.body).to.have.property('uploaded_by', 'teacher-1');
    expect(uploadResourceRes.body).to.have.property('filename', 'worksheet.pdf');
    expect(uploadResourceRes.body.url).to.match(/^\/uploads\//);

    const timetableRes = await request(app).get('/api/timetable/class1').set('Authorization', `Bearer ${token}`);
    expect(timetableRes.status).to.equal(200);
    expect(timetableRes.body).to.be.an('array');
    expect(timetableRes.body[0]).to.have.property('class_id', 'class1');

    const createTimetableRes = await request(app)
      .post('/api/timetable')
      .set('Authorization', `Bearer ${token}`)
      .send({ class_id: 'class1', date: '2025-05-02', period: '2', subject: 'Science', teacher_id: 'teacher-1' });
    expect(createTimetableRes.status).to.equal(201);
    expect(createTimetableRes.body).to.have.property('subject', 'Science');
  });

  it('updates and deletes timetable entries for a teacher', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const updateRes = await request(app)
      .put('/api/timetable/tt1')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'Advanced Mathematics', period: '3' });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property('subject', 'Advanced Mathematics');

    const deleteRes = await request(app)
      .delete('/api/timetable/tt1')
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).to.equal(204);
  });

  it('updates inventory items for a teacher', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    // Ensure the inventory item exists even if a prior test removed it.
    await mockDb('inventory_items').insert({ id: 'inv1', name: 'Chalk', category: 'Stationery', qty: 5, status: 'Low Stock' });

    const updateRes = await request(app)
      .put('/api/inventory/inv1')
      .set('Authorization', `Bearer ${token}`)
      .send({ qty: 12, assigned: 1, status: 'In Stock' });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property('qty', 12);
    expect(updateRes.body).to.have.property('assigned', 1);
  });

  it('creates exam marks for an exam', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/exam-marks/e1')
      .set('Authorization', `Bearer ${token}`)
      .send({ student_id: 'BPS-2451', marks_obtained: 88, grade: 'A' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('exam_id', 'e1');
    expect(res.body).to.have.property('student_id', 'BPS-2451');
    expect(res.body).to.have.property('exam_name', 'Math Midterm');
    expect(res.body).to.have.property('student_name', 'Tatenda');
    expect(res.body).to.have.property('record_type', 'exam_mark');
  });

  it('supports auth login alias endpoints', async () => {
    const jwt = require('jsonwebtoken');
    const loginPayload = { email: 'teacher@example.com', password: 'password', role: 'teacher' };

    const res = await request(app)
      .post('/api/login')
      .send(loginPayload);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body.user).to.have.property('role', 'teacher');
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

  it('creates a library item from a JSON payload', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Physics Essentials',
        author: 'Ada Lovelace',
        subject: 'Science',
        description: 'A practical guide',
        digitalUrl: 'http://example.com/physics',
        isPhysical: false,
        copies: 2,
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Physics Essentials');
    expect(res.body).to.have.property('author', 'Ada Lovelace');
    expect(res.body).to.have.property('is_physical', false);
    expect(res.body).to.have.property('digital_url', 'http://example.com/physics');
  });

  it('creates a library item from a form payload', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher', name: 'Mr. Mhlanga' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library')
      .set('Authorization', `Bearer ${token}`)
      .type('form')
      .send({
        title: 'Physics Essentials',
        author: 'Ada Lovelace',
        subject: 'Science',
        description: 'A practical guide',
        isPhysical: 'false',
        copies: '2',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Physics Essentials');
    expect(res.body).to.have.property('author', 'Ada Lovelace');
    expect(res.body).to.have.property('is_physical', false);
  });

  it('borrows a library item and returns item details', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library/li1/borrow')
      .set('Authorization', `Bearer ${token}`)
      .send({ student_id: 'BPS-2451', due_date: '2025-05-20' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('borrowing');
    expect(res.body.borrowing).to.have.property('student_name', 'Tatenda');
    expect(res.body).to.have.property('item');
    expect(res.body.item).to.have.property('id', 'li1');
    expect(res.body.item).to.have.property('title', 'Quantum Physics for Beginners');
  });

  it('resolves a legacy student ID for a student account UUID', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library/li1/borrow')
      .set('Authorization', `Bearer ${token}`)
      .send({ student_id: 'BPS-2451', due_date: '2025-05-20' });

    expect(res.status).to.equal(201);
    expect(res.body.borrowing).to.have.property('student_id', 'BPS-2451');
  });

  it('includes the borrower name when borrowings are fetched', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher' }, process.env.JWT_SECRET || 'your-secret-key');

    await mockDb('borrowings').insert({ id: 'borrowing-1', student_id: 'BPS-2451', item_id: 'li1', status: 'borrowed' });
    const res = await request(app)
      .get('/api/borrowings/BPS-2451')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body[0]).to.have.property('student_name', 'Tatenda');
  });

  it('accepts a library item ID copied with JSON quotes', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'teacher-1', email: 'teacher@example.com', role: 'teacher' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library/"li1"/borrow')
      .set('Authorization', `Bearer ${token}`)
      .send({ student_id: 'BPS-2451', due_date: '2025-05-20' });

    expect(res.status).to.equal(201);
    expect(res.body.item).to.have.property('id', 'li1');
  });

  it('rejects borrowing with invalid date format', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app)
      .post('/api/library/li1/borrow')
      .set('Authorization', `Bearer ${token}`)
      .send({ student_id: 'BPS-2451', due_date: 'invalid-date' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message').that.includes('Invalid due_date format');
  });

  it('returns bookmark entries with item details', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 'u1', email: 'student@example.com', role: 'student' }, process.env.JWT_SECRET || 'your-secret-key');

    const res = await request(app).get('/api/library/li1/bookmarks').set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('item');
    expect(res.body[0].item).to.have.property('id', 'li1');
    expect(res.body[0].item).to.have.property('title', 'Quantum Physics for Beginners');
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

  it('allows demo access to admin, teacher, student, admissions, report-card, and grade endpoints without a token', async () => {
    const adminUsers = await request(app).get('/api/admin/users');
    expect(adminUsers.status).to.equal(200);
    expect(adminUsers.body).to.be.an('array');

    const adminFees = await request(app).get('/api/admin/fees/stats');
    expect(adminFees.status).to.equal(200);
    expect(adminFees.body).to.have.property('collected');

    const adminAttendance = await request(app).get('/api/admin/attendance/stats');
    expect(adminAttendance.status).to.equal(200);
    expect(adminAttendance.body).to.have.property('present');

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

    const students = await request(app).get('/api/students');
    expect(students.status).to.equal(200);
    expect(students.body).to.be.an('array');

    const applications = await request(app).get('/api/applications');
    expect(applications.status).to.equal(200);
    expect(applications.body).to.be.an('array');

    const reportCards = await request(app).get('/api/report-cards');
    expect(reportCards.status).to.equal(200);
    expect(reportCards.body).to.be.an('array');

    const grades = await request(app).get('/api/grades/BPS-2451');
    expect(grades.status).to.equal(200);
    expect(grades.body).to.be.an('array');
    expect(grades.body[0]).to.have.property('record_type', 'academic_grade');
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
