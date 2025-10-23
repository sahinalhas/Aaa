export interface Student {
  id: string;
  ad: string;
  soyad: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  sinif?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  avatar?: string;
  parentContact?: string;
  notes?: string;
  cinsiyet?: 'K' | 'E';
  risk?: 'Düşük' | 'Orta' | 'Yüksek';
}

export interface AcademicRecord {
  id?: number;
  studentId: string;
  semester: string;
  gpa?: number;
  year: number;
  exams?: any[];
  notes?: string;
}

export interface Progress {
  id: string;
  studentId: string;
  topicId: string;
  completed: number;
  remaining: number;
  lastStudied?: string;
  notes?: string;
}
