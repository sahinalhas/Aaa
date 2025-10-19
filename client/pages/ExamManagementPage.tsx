import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, FileText, GraduationCap, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import {
  useExamTypes,
  useExamSubjects,
  useExamSessions,
  useCreateExamSession,
  useUpdateExamSession,
  useDeleteExamSession,
  useUpsertExamResult,
  useSessionStatistics,
  useImportExcelResults,
  downloadExcelTemplate,
  useSchoolExamsByStudent,
  useCreateSchoolExam,
  useDeleteSchoolExam,
} from '@/hooks/useExamManagement';
import { ExamSessionDialog } from '@/components/exam-management/ExamSessionDialog';
import { PracticeExamsTab } from '@/components/exam-management/PracticeExamsTab';
import { SchoolExamsTab } from '@/components/exam-management/SchoolExamsTab';
import { StatisticsTab } from '@/components/exam-management/StatisticsTab';
import type {
  ExamSession,
  SubjectResults,
} from '../../shared/types/exam-management.types';

interface Student {
  id: string;
  name: string;
}

function useStudents() {
  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Öğrenciler yüklenemedi');
      const data = await response.json();
      return data.data || [];
    },
  });
}

export default function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState<string>('practice-exams');
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExamSession | null>(null);
  const [statsSessionId, setStatsSessionId] = useState<string>('');
  const [resultEntrySessionId, setResultEntrySessionId] = useState<string>('');

  const { data: examTypes, isLoading: typesLoading, error: typesError } = useExamTypes();
  const { data: allSessions = [], refetch: refetchSessions } = useExamSessions();
  const { data: students = [] } = useStudents();
  const { data: schoolExams = [] } = useSchoolExamsByStudent(undefined);

  const createSession = useCreateExamSession();
  const updateSession = useUpdateExamSession();
  const deleteSession = useDeleteExamSession();
  const upsertResult = useUpsertExamResult();
  const importExcel = useImportExcelResults();
  const createSchoolExam = useCreateSchoolExam();
  const deleteSchoolExam = useDeleteSchoolExam();

  const { data: statistics, isLoading: statsLoading } = useSessionStatistics(
    statsSessionId || undefined
  );

  const resultEntrySession = allSessions.find((s) => s.id === resultEntrySessionId);
  const subjectsForResultEntry = useExamSubjects(
    resultEntrySession?.exam_type_id
  );

  const handleCreateExam = async (data: {
    exam_type_id: string;
    name: string;
    exam_date: string;
    description?: string;
  }) => {
    try {
      await createSession.mutateAsync(data);
      toast.success('Deneme sınavı oluşturuldu');
      refetchSessions();
    } catch (error) {
      toast.error('Deneme sınavı oluşturulamadı');
      throw error;
    }
  };

  const handleSaveSession = async (data: {
    name: string;
    exam_date: string;
    description?: string;
  }) => {
    try {
      if (editingSession) {
        await updateSession.mutateAsync({
          id: editingSession.id,
          input: data,
        });
        toast.success('Deneme sınavı güncellendi');
      } else {
        toast.error('Geçersiz işlem');
      }
      setEditingSession(null);
      setSessionDialogOpen(false);
      refetchSessions();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEditSession = (session: ExamSession) => {
    setEditingSession(session);
    setSessionDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession.mutateAsync(sessionId);
      toast.success('Deneme sınavı silindi');
      refetchSessions();
    } catch (error) {
      toast.error('Deneme sınavı silinemedi');
    }
  };

  const handleViewStatistics = (session: ExamSession) => {
    setStatsSessionId(session.id);
    setActiveTab('statistics');
  };

  const handleSaveResults = async (
    sessionId: string,
    studentId: string,
    results: SubjectResults[]
  ) => {
    try {
      const promises = results.map((result) =>
        upsertResult.mutateAsync({
          session_id: sessionId,
          student_id: studentId,
          ...result,
        })
      );
      await Promise.all(promises);
      toast.success('Sonuçlar kaydedildi');
    } catch (error) {
      toast.error('Sonuçlar kaydedilemedi');
      throw error;
    }
  };

  const handleImportExcel = async (sessionId: string, file: File) => {
    try {
      const result = await importExcel.mutateAsync({ sessionId, file });
      toast.success(result.message || 'Dosya başarıyla yüklendi');
      return { success: true, message: result.message || 'İçe aktarma başarılı' };
    } catch (error: any) {
      toast.error(error.message || 'Dosya yüklenemedi');
      return {
        success: false,
        message: error.message || 'Bir hata oluştu',
      };
    }
  };

  const handleDownloadTemplate = async (examTypeId: string) => {
    downloadExcelTemplate(examTypeId, true);
    toast.success('Şablon indiriliyor');
  };

  const handleSaveSchoolExam = async (data: any) => {
    try {
      await createSchoolExam.mutateAsync(data);
      toast.success('Okul sınavı kaydedildi');
    } catch (error) {
      toast.error('Okul sınavı kaydedilemedi');
      throw error;
    }
  };

  const handleDeleteSchoolExam = async (examId: string) => {
    try {
      await deleteSchoolExam.mutateAsync(examId);
      toast.success('Okul sınavı silindi');
    } catch (error) {
      toast.error('Okul sınavı silinemedi');
    }
  };

  if (typesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (typesError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Sınav türleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Ölçme Değerlendirme
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Deneme sınavları, okul notları ve değerlendirme sonuçlarını yönetin
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3 h-11">
          <TabsTrigger value="practice-exams" className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Deneme Sınavları
          </TabsTrigger>
          <TabsTrigger value="school-exams" className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4" />
            Okul Sınavları
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            İstatistikler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice-exams" className="mt-6">
          <PracticeExamsTab
            examTypes={examTypes || []}
            sessions={allSessions}
            subjects={subjectsForResultEntry.data || []}
            students={students}
            onCreateExam={handleCreateExam}
            onViewStatistics={handleViewStatistics}
            onImportExcel={handleImportExcel}
            onDownloadTemplate={handleDownloadTemplate}
            onSaveResults={handleSaveResults}
            onResultSessionChange={setResultEntrySessionId}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            isCreating={createSession.isPending}
          />
        </TabsContent>

        <TabsContent value="school-exams" className="mt-6">
          <SchoolExamsTab
            students={students}
            schoolExams={schoolExams}
            onSave={handleSaveSchoolExam}
            onDelete={handleDeleteSchoolExam}
          />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <StatisticsTab
            examTypes={examTypes || []}
            sessions={allSessions}
            statistics={statistics || null}
            isLoading={statsLoading}
            onSessionChange={setStatsSessionId}
            selectedSessionId={statsSessionId}
          />
        </TabsContent>
      </Tabs>

      <ExamSessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        examTypeId={editingSession?.exam_type_id || ''}
        examTypeName={
          examTypes?.find((t) => t.id === editingSession?.exam_type_id)?.name || ''
        }
        session={editingSession || undefined}
        onSave={handleSaveSession}
      />
    </div>
  );
}
