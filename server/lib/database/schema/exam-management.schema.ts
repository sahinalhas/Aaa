import type Database from 'better-sqlite3';

/**
 * Exam Management Schema
 * Ölçme Değerlendirme sistemi için veritabanı tabloları
 */
export function createExamManagementTables(db: Database.Database): void {
  // Sınav Türleri (TYT, AYT, LGS, YDT)
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Sınav Dersleri (Her sınav türü için)
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_subjects (
      id TEXT PRIMARY KEY,
      exam_type_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      question_count INTEGER NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_type_id) REFERENCES exam_types (id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_exam_subjects_type ON exam_subjects(exam_type_id);
    CREATE INDEX IF NOT EXISTS idx_exam_subjects_order ON exam_subjects(exam_type_id, order_index);
  `);

  // Deneme Sınavları (1. Deneme, 2. Deneme vb.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_sessions (
      id TEXT PRIMARY KEY,
      exam_type_id TEXT NOT NULL,
      name TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      description TEXT,
      created_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_type_id) REFERENCES exam_types (id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_exam_sessions_type ON exam_sessions(exam_type_id);
    CREATE INDEX IF NOT EXISTS idx_exam_sessions_date ON exam_sessions(exam_date);
  `);

  // Sınav Sonuçları (Öğrenci bazında, ders bazında D/Y/B)
  // Not: 'exam_session_results' adını kullanıyoruz çünkü 'exam_results' zaten academic.schema.ts'de var
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_session_results (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      correct_count INTEGER DEFAULT 0,
      wrong_count INTEGER DEFAULT 0,
      empty_count INTEGER DEFAULT 0,
      net_score REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE,
      UNIQUE(session_id, student_id, subject_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_exam_session_results_session ON exam_session_results(session_id);
    CREATE INDEX IF NOT EXISTS idx_exam_session_results_student ON exam_session_results(student_id);
    CREATE INDEX IF NOT EXISTS idx_exam_session_results_subject ON exam_session_results(subject_id);
  `);

  // Okul Sınavları (Dönem sonu, yazılılar vb.)
  db.exec(`
    CREATE TABLE IF NOT EXISTS school_exam_results (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      exam_type TEXT NOT NULL,
      score REAL NOT NULL,
      max_score REAL NOT NULL DEFAULT 100,
      exam_date TEXT NOT NULL,
      semester TEXT,
      year INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_school_exam_results_student ON school_exam_results(student_id);
    CREATE INDEX IF NOT EXISTS idx_school_exam_results_date ON school_exam_results(exam_date);
    CREATE INDEX IF NOT EXISTS idx_school_exam_results_semester ON school_exam_results(semester, year);
  `);
}

/**
 * Seed data for exam types and subjects
 * Sınav türleri ve dersler için başlangıç verisi
 */
export function seedExamData(db: Database.Database): void {
  const checkData = db.prepare('SELECT COUNT(*) as count FROM exam_types').get() as { count: number };
  
  // Eğer veri varsa seed etme
  if (checkData.count > 0) {
    return;
  }

  // TYT (Temel Yeterlilik Testi)
  db.prepare(`
    INSERT INTO exam_types (id, name, description, is_active)
    VALUES (?, ?, ?, ?)
  `).run('tyt', 'TYT', 'Temel Yeterlilik Testi', 1);

  const tytSubjects = [
    { id: 'tyt_turk', name: 'Türkçe', count: 40, order: 1 },
    { id: 'tyt_mat', name: 'Matematik', count: 40, order: 2 },
    { id: 'tyt_sos', name: 'Sosyal Bilimler', count: 20, order: 3 },
    { id: 'tyt_fen', name: 'Fen Bilimleri', count: 20, order: 4 }
  ];

  for (const subject of tytSubjects) {
    db.prepare(`
      INSERT INTO exam_subjects (id, exam_type_id, subject_name, question_count, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(subject.id, 'tyt', subject.name, subject.count, subject.order);
  }

  // AYT (Alan Yeterlilik Testi)
  db.prepare(`
    INSERT INTO exam_types (id, name, description, is_active)
    VALUES (?, ?, ?, ?)
  `).run('ayt', 'AYT', 'Alan Yeterlilik Testi', 1);

  const aytSubjects = [
    { id: 'ayt_mat', name: 'Matematik', count: 40, order: 1 },
    { id: 'ayt_fiz', name: 'Fizik', count: 14, order: 2 },
    { id: 'ayt_kim', name: 'Kimya', count: 13, order: 3 },
    { id: 'ayt_bio', name: 'Biyoloji', count: 13, order: 4 },
    { id: 'ayt_edb', name: 'Edebiyat', count: 24, order: 5 },
    { id: 'ayt_tar1', name: 'Tarih-1', count: 10, order: 6 },
    { id: 'ayt_cog', name: 'Coğrafya-1', count: 6, order: 7 },
    { id: 'ayt_tar2', name: 'Tarih-2', count: 11, order: 8 },
    { id: 'ayt_cog2', name: 'Coğrafya-2', count: 11, order: 9 },
    { id: 'ayt_fel', name: 'Felsefe', count: 12, order: 10 },
    { id: 'ayt_din', name: 'Din Kültürü', count: 6, order: 11 }
  ];

  for (const subject of aytSubjects) {
    db.prepare(`
      INSERT INTO exam_subjects (id, exam_type_id, subject_name, question_count, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(subject.id, 'ayt', subject.name, subject.count, subject.order);
  }

  // LGS (Liselere Geçiş Sınavı)
  db.prepare(`
    INSERT INTO exam_types (id, name, description, is_active)
    VALUES (?, ?, ?, ?)
  `).run('lgs', 'LGS', 'Liselere Geçiş Sınavı', 1);

  const lgsSubjects = [
    { id: 'lgs_turk', name: 'Türkçe', count: 20, order: 1 },
    { id: 'lgs_ink', name: 'T.C. İnkılap Tarihi ve Atatürkçülük', count: 10, order: 2 },
    { id: 'lgs_din', name: 'Din Kültürü ve Ahlak Bilgisi', count: 10, order: 3 },
    { id: 'lgs_ing', name: 'Yabancı Dil (İngilizce)', count: 10, order: 4 },
    { id: 'lgs_mat', name: 'Matematik', count: 20, order: 5 },
    { id: 'lgs_fen', name: 'Fen Bilimleri', count: 20, order: 6 }
  ];

  for (const subject of lgsSubjects) {
    db.prepare(`
      INSERT INTO exam_subjects (id, exam_type_id, subject_name, question_count, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(subject.id, 'lgs', subject.name, subject.count, subject.order);
  }

  // YDT (Yabancı Dil Testi)
  db.prepare(`
    INSERT INTO exam_types (id, name, description, is_active)
    VALUES (?, ?, ?, ?)
  `).run('ydt', 'YDT', 'Yabancı Dil Testi', 1);

  const ydtSubjects = [
    { id: 'ydt_ing', name: 'İngilizce', count: 80, order: 1 }
  ];

  for (const subject of ydtSubjects) {
    db.prepare(`
      INSERT INTO exam_subjects (id, exam_type_id, subject_name, question_count, order_index)
      VALUES (?, ?, ?, ?, ?)
    `).run(subject.id, 'ydt', subject.name, subject.count, subject.order);
  }

  console.log('✅ Exam types and subjects seeded successfully');
}
