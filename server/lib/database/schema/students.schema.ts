import type Database from 'better-sqlite3';

export function createStudentsTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      ad TEXT NOT NULL,
      soyad TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthDate TEXT,
      address TEXT,
      sinif TEXT,
      enrollmentDate TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      avatar TEXT,
      parentContact TEXT,
      notes TEXT,
      cinsiyet TEXT CHECK (cinsiyet IN ('K', 'E')) DEFAULT 'K',
      risk TEXT CHECK (risk IN ('Düşük', 'Orta', 'Yüksek')) DEFAULT 'Düşük',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS student_documents (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      dataUrl TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE
    );
  `);
}
