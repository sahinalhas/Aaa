/**
 * Exam Management Types
 * Ölçme Değerlendirme sistemi için type tanımları
 */

// ============================================================================
// Exam Type (Sınav Türü)
// ============================================================================

export interface ExamType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export type ExamTypeId = 'tyt' | 'ayt' | 'lgs' | 'ydt';

// ============================================================================
// Exam Subject (Sınav Dersi)
// ============================================================================

export interface ExamSubject {
  id: string;
  exam_type_id: string;
  subject_name: string;
  question_count: number;
  order_index: number;
  created_at: string;
}

// ============================================================================
// Exam Session (Deneme Sınavı)
// ============================================================================

export interface ExamSession {
  id: string;
  exam_type_id: string;
  name: string;
  exam_date: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExamSessionInput {
  exam_type_id: string;
  name: string;
  exam_date: string;
  description?: string;
  created_by?: string;
}

export interface UpdateExamSessionInput {
  name?: string;
  exam_date?: string;
  description?: string;
}

// ============================================================================
// Exam Result (Sınav Sonucu)
// ============================================================================

export interface ExamResult {
  id: string;
  session_id: string;
  student_id: string;
  subject_id: string;
  correct_count: number;
  wrong_count: number;
  empty_count: number;
  net_score: number;
  created_at: string;
  updated_at: string;
}

export interface ExamResultWithDetails extends ExamResult {
  student_name?: string;
  subject_name?: string;
  session_name?: string;
  exam_type_id?: string;
  exam_date?: string;
}

export interface CreateExamResultInput {
  session_id: string;
  student_id: string;
  subject_id: string;
  correct_count: number;
  wrong_count: number;
  empty_count: number;
}

export interface UpdateExamResultInput {
  correct_count?: number;
  wrong_count?: number;
  empty_count?: number;
}

// ============================================================================
// Batch Result Entry (Toplu Sonuç Girişi)
// ============================================================================

export interface BatchExamResultInput {
  session_id: string;
  results: StudentExamResults[];
}

export interface StudentExamResults {
  student_id: string;
  subjects: SubjectResults[];
}

export interface SubjectResults {
  subject_id: string;
  correct_count: number;
  wrong_count: number;
  empty_count: number;
}

// ============================================================================
// School Exam Result (Okul Sınav Sonucu)
// ============================================================================

export interface SchoolExamResult {
  id: string;
  student_id: string;
  subject_name: string;
  exam_type: string;
  score: number;
  max_score: number;
  exam_date: string;
  semester?: string;
  year?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolExamResultInput {
  student_id: string;
  subject_name: string;
  exam_type: string;
  score: number;
  max_score?: number;
  exam_date: string;
  semester?: string;
  year?: number;
  notes?: string;
}

export interface UpdateSchoolExamResultInput {
  subject_name?: string;
  exam_type?: string;
  score?: number;
  max_score?: number;
  exam_date?: string;
  semester?: string;
  year?: number;
  notes?: string;
}

// ============================================================================
// Statistics and Analytics
// ============================================================================

export interface ExamStatistics {
  session_id: string;
  session_name: string;
  exam_type_id: string;
  exam_date: string;
  total_students: number;
  subject_stats: SubjectStatistics[];
  overall_stats: {
    avg_total_net: number;
    highest_total_net: number;
    lowest_total_net: number;
  };
}

export interface SubjectStatistics {
  subject_id: string;
  subject_name: string;
  question_count: number;
  avg_correct: number;
  avg_wrong: number;
  avg_empty: number;
  avg_net: number;
  highest_net: number;
  lowest_net: number;
  std_deviation: number;
}

export interface StudentExamStatistics {
  student_id: string;
  student_name: string;
  exam_type_id: string;
  total_exams: number;
  avg_net_score: number;
  best_net_score: number;
  worst_net_score: number;
  improvement_rate: number;
  subject_performance: SubjectPerformance[];
  recent_exams: RecentExamSummary[];
}

export interface SubjectPerformance {
  subject_id: string;
  subject_name: string;
  avg_net: number;
  trend: 'improving' | 'stable' | 'declining';
  strength_level: 'weak' | 'moderate' | 'strong';
}

export interface RecentExamSummary {
  session_id: string;
  session_name: string;
  exam_date: string;
  total_net: number;
  rank?: number;
}

// ============================================================================
// Excel Import/Export
// ============================================================================

export interface ExcelImportResult {
  success: boolean;
  imported_count: number;
  failed_count: number;
  errors: ExcelImportError[];
  results: ExamResult[];
}

export interface ExcelImportError {
  row: number;
  student_id?: string;
  student_name?: string;
  error: string;
}

export interface ExcelTemplateConfig {
  exam_type_id: string;
  session_id?: string;
  include_student_info: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ExamManagementApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface ExamResultsFilter {
  session_id?: string;
  student_id?: string;
  exam_type_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface SchoolExamResultsFilter {
  student_id?: string;
  subject_name?: string;
  exam_type?: string;
  semester?: string;
  year?: number;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}
