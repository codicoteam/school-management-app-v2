const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: ':memory:' },
  useNullAsDefault: true,
});
const { createApp } = require('./server/server.js');

(async () => {
  try {
    const ensureTable = async (tableName, definition) => {
      const exists = await knex.schema.hasTable(tableName);
      if (!exists) {
        await knex.schema.createTable(tableName, definition);
      }
    };

    await ensureTable('users', (t) => {
      t.string('id').primary();
      t.string('email').unique();
      t.string('password');
      t.string('name');
      t.string('role');
      t.string('subject');
      t.string('grade');
      t.text('classes');
      t.string('status');
      t.string('qualification');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('students', (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('class');
      t.string('stream');
      t.string('gender');
      t.string('date_of_birth');
      t.string('blood_group');
      t.string('address');
      t.string('status');
      t.string('email');
      t.string('phone');
      t.string('guardian_name');
      t.string('guardian_email');
      t.string('guardian_phone');
      t.string('guardian_user_id');
      t.float('current_gpa');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('student_classes', (t) => {
      t.string('student_id');
      t.string('class_id');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('classes', (t) => {
      t.string('id').primary();
      t.string('teacher_id');
      t.string('name');
      t.string('subject');
      t.string('subject_code');
      t.string('grade');
      t.string('room');
      t.integer('max_students');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('exams', (t) => {
      t.string('id').primary();
      t.string('class_id');
      t.string('teacher_id');
      t.string('name');
      t.string('subject');
      t.string('date');
      t.integer('total_marks');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('grades', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.string('subject');
      t.string('exam_name');
      t.integer('score');
      t.string('grade');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('attendance', (t) => {
      t.string('id').primary();
      t.string('class_id');
      t.string('student_id');
      t.string('teacher_id');
      t.string('date');
      t.string('status');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('fees', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.float('amount');
      t.string('item');
      t.string('method');
      t.string('due_date');
      t.date('paid_date');
      t.string('status');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('announcements', (t) => {
      t.string('id').primary();
      t.string('title');
      t.string('message');
      t.string('created_by');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('documents', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.string('name');
      t.string('type');
      t.string('size');
      t.string('url');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('messages', (t) => {
      t.string('id').primary();
      t.string('sender_id');
      t.string('sender_name');
      t.string('receiver_id');
      t.string('receiver_name');
      t.string('subject');
      t.string('text');
      t.boolean('is_new');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('school_profile', (t) => {
      t.string('id').primary();
      t.string('school_name');
      t.string('address');
      t.string('contact_phone');
      t.string('public_email');
      t.string('motto_slogan');
      t.string('system_currency');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('system_settings', (t) => {
      t.string('id').primary();
      t.string('setting_key');
      t.string('setting_value');
      t.string('setting_type');
      t.string('description');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('generated_documents', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.string('document_type');
      t.string('file_name');
      t.string('url');
      t.string('status');
      t.string('generated_by');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('audit_logs', (t) => {
      t.string('id').primary();
      t.string('admin_id');
      t.string('admin_name');
      t.string('action');
      t.string('entity_type');
      t.string('entity_id');
      t.string('description');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('subjects', (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('description');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('assignments', (t) => {
      t.string('id').primary();
      t.string('class_id');
      t.string('teacher_id');
      t.string('title');
      t.string('subject');
      t.string('description');
      t.string('due_date');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('applications', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.string('applicant_name');
      t.string('status');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('timetable', (t) => {
      t.string('id').primary();
      t.string('class_id');
      t.string('date');
      t.string('time');
      t.string('subject');
      t.string('teacher_id');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('library_items', (t) => {
      t.string('id').primary();
      t.string('title');
      t.string('author');
      t.string('subject');
      t.string('isbn');
      t.string('description');
      t.string('digital_url');
      t.boolean('is_physical');
      t.integer('copies');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('bookmarks', (t) => {
      t.string('id').primary();
      t.string('user_id');
      t.string('item_id');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('borrowings', (t) => {
      t.string('id').primary();
      t.string('student_id');
      t.string('item_id');
      t.string('due_date');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    await ensureTable('inventory_items', (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('category');
      t.integer('quantity');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });

    const app = createApp(knex);
    await app._seedInitialData();

    const PORT = 3002;
    app.listen(PORT, () => console.log(`In-memory test server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start test server', err);
    process.exit(1);
  }
})();
