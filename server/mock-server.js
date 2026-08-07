const { createApp } = require('./server');

// Lightweight mock DB similar to tests for manual local dev
function createMockDb() {
  const users = [];
  const students = [];
  const grades = [];
  const student_classes = [];
  const exams = [];
  const attendance = [];
  const fees = [];
  const classes = [];
  const inventory_items = [];
  const school_profile = [];
  const system_settings = [];
  const generated_documents = [];
  const audit_logs = [];
  const messages = [];
  const documents = [];
  const subjects = [];
  const assignments = [];
  const timetable = [];
  const bookmarks = [];
  const borrowings = [];
  const announcements = [];
  const library_items = [];
  const applications = [];

  function table(name) {
    const rows = { users, students, grades, student_classes, exams, attendance, fees, classes, inventory_items, school_profile, system_settings, generated_documents, audit_logs, messages, documents, subjects, assignments, timetable, bookmarks, borrowings, announcements, library_items, applications }[name];
    function makeQb(filtered) {
      let _filtered = filtered || rows;
      let avgCalled = false;
      let countCalled = false;
      let _limit = null;
      const self = {
        where: function (conds) {
          if (typeof conds === 'function') {
            conds.call(this);
            return self;
          }
          if (!conds || typeof conds !== 'object') {
            return self;
          }
          if (conds.raw === true) {
            return self;
          }
          const res = _filtered.filter(r => Object.keys(conds).every(k => r[k] === conds[k]));
          _filtered = res;
          return self;
        },
        andWhere: function (fieldOrCond, value) {
          if (typeof fieldOrCond === 'function') {
            fieldOrCond.call(this);
            return self;
          }
          if (typeof fieldOrCond === 'string' && value !== undefined) {
            _filtered = _filtered.filter(r => r[fieldOrCond] === value);
            return self;
          }
          return self.where(fieldOrCond);
        },
        whereIn: function (field, values) {
          const valuesSet = new Set(values || []);
          _filtered = _filtered.filter(r => valuesSet.has(r[field]));
          return self;
        },
        orWhere: function (conds) {
          if (!conds || typeof conds !== 'object') {
            return self;
          }
          const orRows = rows.filter(r => Object.keys(conds).every(k => r[k] === conds[k]));
          const union = _filtered.concat(orRows.filter(r => !_filtered.includes(r)));
          _filtered = union;
          return self;
        },
        first: async () => {
          if (countCalled) {
            return { count: _filtered.length };
          }
          return _filtered[0] || undefined;
        },
        count: function () {
          countCalled = true;
          return self;
        },
        sum: function (expr) {
          const match = typeof expr === 'string' ? expr.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/) : null;
          const alias = match ? match[2] : 'sum';
          const field = match ? match[1] : 'value';
          return {
            first: async () => ({ [alias]: _filtered.reduce((sum, row) => sum + Number(row[field] || 0), 0) })
          };
        },
        select: function () { return self; },
        distinct: function () { return self; },
        orderBy: function () { return self; },
        limit: function (n) { _limit = n; return self; },
        insert: function (payload) {
          const entries = Array.isArray(payload) ? payload : [payload];
          const insertedRows = entries.map(p => {
            const row = { ...p };
            if (!row.id) row.id = `${name}-${rows.length + 1}`;
            rows.push(row);
            return row;
          });
          const promiseResult = Promise.resolve(insertedRows);
          return {
            returning: async () => insertedRows,
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
        join: function () { return self; },
        avg: function () { avgCalled = true; return self; },
        groupBy: function () { return self; },
        countDistinct: function () { return self; },
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
      return self;
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
      const promiseResult = Promise.resolve(insertedRows);
      return {
        returning: async () => insertedRows,
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

const mockDb = createMockDb();
// seed
mockDb('students').insert({ id: 'BPS-2451', name: 'Tatenda', class: 'Form 4A', guardian_email: 'parent@example.com', guardian_user_id: 'p1' });
mockDb('users').insert({ id: 'u1', email: 'student@example.com', password: 'x', name: 'Jane', role: 'student' });
mockDb('users').insert({ id: 'p1', email: 'parent@example.com', password: 'x', name: 'Mrs. Ndlovu', role: 'parent' });
mockDb('users').insert({ id: 'teacher-1', email: 'teacher@example.com', password: 'x', name: 'Mr. Mhlanga', role: 'teacher', subject: 'Mathematics' });
mockDb('users').insert({ id: 'admin-1', email: 'admin@example.com', password: 'x', name: 'Admin User', role: 'admin' });
mockDb('grades').insert({ id: 'g1', student_id: 'BPS-2451', subject: 'Mathematics', exam_name: 'Term 1', score: 78, grade: 'A', created_at: new Date() });
mockDb('student_classes').insert({ id: 'sc1', student_id: 'BPS-2451', class_id: 'class1' });
mockDb('exams').insert({ id: 'e1', class_id: 'class1', name: 'Math Midterm', date: new Date() });
mockDb('exam_grades').insert({ id: 'eg1', exam_id: 'e1', student_id: 'BPS-2451', marks_obtained: 88, grade: 'A' });
mockDb('attendance').insert({ id: 'a1', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-20', status: 'present' });
mockDb('attendance').insert({ id: 'a2', class_id: 'class1', student_id: 'BPS-2451', teacher_id: 'u1', date: '2025-04-19', status: 'absent' });
mockDb('fees').insert({ id: 'f1', student_id: 'BPS-2451', amount: 760.0, item: 'Term 1 — Full', method: 'Bank Transfer', due_date: '2025-04-30', status: 'paid' });
mockDb('classes').insert({ id: 'class1', name: 'Form 4A', subject: 'Mathematics', teacher_id: 'teacher-1' });
mockDb('inventory_items').insert({ id: 'inv1', name: 'Chalk', category: 'Stationery', qty: 5, status: 'Low Stock' });
mockDb('school_profile').insert({ id: 'sp1', school_name: 'Bright Star Academy', address: 'Harare', contact_phone: '+263 772000000', public_email: 'info@brightstar.edu', motto_slogan: 'Excellence', system_currency: 'USD' });
mockDb('system_settings').insert({ id: 'ss1', setting_key: 'school_name', setting_value: 'Bright Star Academy', setting_type: 'string', description: 'School display name' });
mockDb('generated_documents').insert({ id: 'gd1', student_id: 'BPS-2451', document_type: 'Report Card', file_name: 'report_card.pdf', url: '/documents/BPS-2451/report_card.pdf', status: 'generated', generated_by: 'u1', created_at: new Date() });
mockDb('audit_logs').insert({ id: 'al1', admin_id: 'u1', admin_name: 'Jane', action: 'LOGIN', entity_type: 'user', entity_id: 'u1', description: 'Admin login', created_at: new Date() });
mockDb('messages').insert({ id: 'm1', sender_id: 'teacher-1', sender_name: 'Mr. Mhlanga', receiver_id: 'p1', receiver_name: 'Mrs. Ndlovu', subject: 'Attendance follow-up', text: 'Please sign the permission slip.', is_new: true, created_at: new Date() });
mockDb('documents').insert({ id: 'd1', student_id: 'BPS-2451', name: 'Term 1 2025 Report Card', type: 'Report Card', size: '320 KB', url: '/docs/term1-2025-report-card.pdf', created_at: new Date() });
mockDb('subjects').insert({ id: 'subj1', name: 'Mathematics', description: 'Core mathematics' });
mockDb('subjects').insert({ id: 'subj2', name: 'Science', description: 'Physical sciences' });
  await mockDb('applications').insert({ id: 'app1', student_id: 'BPS-2451', full_name: 'Tatenda', status: 'pending', created_at: new Date() });

const app = createApp(mockDb);

const PORT = process.env.MOCK_PORT || 4001;
app.listen(PORT, () => console.log(`Mock server running on port ${PORT}`));

module.exports = app;
