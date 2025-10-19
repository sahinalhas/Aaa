import { Router } from 'express';
import { simpleRateLimit } from '../../middleware/validation.js';
import * as routes from './routes/exam-management.routes.js';

const router = Router();

router.get('/types', routes.getExamTypes);
router.get('/types/:typeId/subjects', routes.getSubjectsByType);

router.get('/sessions', routes.getAllExamSessions);
router.get('/sessions/:id', routes.getExamSessionById);
router.post('/sessions', simpleRateLimit(30, 60 * 60 * 1000), routes.createExamSession);
router.put('/sessions/:id', simpleRateLimit(30, 60 * 60 * 1000), routes.updateExamSession);
router.delete('/sessions/:id', simpleRateLimit(20, 60 * 60 * 1000), routes.deleteExamSession);

router.get('/results/session/:sessionId', routes.getResultsBySession);
router.get('/results/student/:studentId', routes.getResultsByStudent);
router.post('/results', simpleRateLimit(100, 60 * 60 * 1000), routes.createExamResult);
router.post('/results/upsert', simpleRateLimit(100, 60 * 60 * 1000), routes.upsertExamResult);
router.post('/results/batch', simpleRateLimit(20, 60 * 60 * 1000), routes.batchUpsertResults);
router.put('/results/:id', simpleRateLimit(100, 60 * 60 * 1000), routes.updateExamResult);
router.delete('/results/:id', simpleRateLimit(50, 60 * 60 * 1000), routes.deleteExamResult);

router.get('/statistics/session/:sessionId', routes.getSessionStatistics);
router.get('/statistics/student/:studentId', routes.getStudentStatistics);

router.get('/excel/template/:examTypeId', routes.downloadExcelTemplate);
router.post('/excel/import', simpleRateLimit(10, 60 * 60 * 1000), ...routes.importExcelResults);
router.get('/excel/export/:sessionId', routes.exportExcelResults);

router.get('/school-exams/student/:studentId', routes.getSchoolExamsByStudent);
router.post('/school-exams', simpleRateLimit(100, 60 * 60 * 1000), routes.createSchoolExam);
router.put('/school-exams/:id', simpleRateLimit(100, 60 * 60 * 1000), routes.updateSchoolExam);
router.delete('/school-exams/:id', simpleRateLimit(50, 60 * 60 * 1000), routes.deleteSchoolExam);

export default router;
