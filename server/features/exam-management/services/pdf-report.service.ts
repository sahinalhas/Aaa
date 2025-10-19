import * as examSessionsRepo from '../repository/exam-sessions.repository.js';
import * as examResultsRepo from '../repository/exam-results.repository.js';
import * as examTypesRepo from '../repository/exam-types.repository.js';
import { getDatabase } from '../../../lib/database/connection.js';
import type { ExamSession } from '../../../../shared/types/exam-management.types.js';

export interface ReportData {
  session?: ExamSession;
  students?: Array<{ id: string; name: string }>;
  statistics?: any;
  recommendations?: any;
}

export function generateSessionReport(sessionId: string): ReportData | null {
  try {
    const session = examSessionsRepo.getExamSessionById(sessionId);
    if (!session) {
      return null;
    }

    const results = examResultsRepo.getExamResultsBySession(sessionId);
    const db = getDatabase();
    
    const students = db.prepare(`
      SELECT DISTINCT s.id, s.name
      FROM students s
      INNER JOIN exam_session_results esr ON s.id = esr.student_id
      WHERE esr.session_id = ?
    `).all(sessionId) as Array<{ id: string; name: string }>;

    const subjects = examTypesRepo.getSubjectsByExamType(session.exam_type_id);
    
    const statistics = {
      total_students: new Set(results.map(r => r.student_id)).size,
      total_results: results.length,
      avg_net: results.length > 0 
        ? results.reduce((sum, r) => sum + r.net_score, 0) / results.length 
        : 0,
      subject_breakdown: subjects.map(subject => {
        const subjectResults = results.filter(r => r.subject_id === subject.id);
        return {
          subject_name: subject.subject_name,
          avg_net: subjectResults.length > 0
            ? subjectResults.reduce((sum, r) => sum + r.net_score, 0) / subjectResults.length
            : 0,
          count: subjectResults.length
        };
      })
    };

    return {
      session,
      students,
      statistics
    };
  } catch (error) {
    console.error('Error generating session report:', error);
    return null;
  }
}

export function generateStudentReport(studentId: string, examTypeId?: string): ReportData | null {
  try {
    const db = getDatabase();
    const student = db.prepare('SELECT id, name FROM students WHERE id = ?').get(studentId) as { id: string; name: string } | undefined;
    
    if (!student) {
      return null;
    }

    const results = examResultsRepo.getExamResultsByStudent(studentId);
    const filteredResults = examTypeId 
      ? results.filter(r => r.exam_type_id === examTypeId)
      : results;

    const sessions = [...new Set(filteredResults.map(r => r.session_id))];
    const sessionData = sessions.map(sessionId => {
      const session = examSessionsRepo.getExamSessionById(sessionId);
      const sessionResults = filteredResults.filter(r => r.session_id === sessionId);
      return {
        session,
        total_net: sessionResults.reduce((sum, r) => sum + r.net_score, 0),
        results: sessionResults
      };
    });

    return {
      students: [student],
      statistics: {
        total_exams: sessions.length,
        avg_net: filteredResults.length > 0
          ? filteredResults.reduce((sum, r) => sum + r.net_score, 0) / filteredResults.length
          : 0,
        session_data: sessionData
      }
    };
  } catch (error) {
    console.error('Error generating student report:', error);
    return null;
  }
}

export function exportReportAsJSON(reportData: ReportData): string {
  return JSON.stringify(reportData, null, 2);
}
