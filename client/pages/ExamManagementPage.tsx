import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
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
  useBatchUpsertResults,
  useSessionStatistics,
  useImportExcelResults,
  downloadExcelTemplate,
  downloadExcelResults,
  useSchoolExamsByStudent,
  useCreateSchoolExam,
  useDeleteSchoolExam,
} from '@/hooks/useExamManagement';
import { ExamSessionDialog } from '@/components/exam-management/ExamSessionDialog';
import { ExamSessionsList } from '@/components/exam-management/ExamSessionsList';
import { ExamResultsEntry } from '@/components/exam-management/ExamResultsEntry';
import { ExcelImportExport } from '@/components/exam-management/ExcelImportExport';
import { ExamStatistics } from '@/components/exam-management/ExamStatistics';
import { SchoolExamsManagement } from '@/components/exam-management/SchoolExamsManagement';
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
  const [selectedExamType, setSelectedExamType] = useState<string>('tyt');
  const [activeTab, setActiveTab] = useState<string>('sessions');
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ExamSession | null>(null);
  const [statsSessionId, setStatsSessionId] = useState<string>('');

  const { data: examTypes, isLoading: typesLoading, error: typesError } = useExamTypes();
  const { data: sessions = [], refetch: refetchSessions } = useExamSessions(selectedExamType);
  const { data: subjects = [] } = useExamSubjects(selectedExamType);
  const { data: students = [] } = useStudents();
  const { data: schoolExams = [] } = useSchoolExamsByStudent(undefined);

  const createSession = useCreateExamSession();
  const updateSession = useUpdateExamSession();
  const deleteSession = useDeleteExamSession();
  const upsertResult = useUpsertExamResult();
  const batchUpsertResults = useBatchUpsertResults();
  const importExcel = useImportExcelResults();
  const createSchoolExam = useCreateSchoolExam();
  const deleteSchoolExam = useDeleteSchoolExam();

  const { data: statistics, isLoading: statsLoading } = useSessionStatistics(
    statsSessionId || undefined
  );

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
        await createSession.mutateAsync({
          exam_type_id: selectedExamType,
          ...data,
        });
        toast.success('Deneme sınavı oluşturuldu');
      }
      setEditingSession(null);
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
      toast.error('Bir hata oluştu');
    }
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    setSessionDialogOpen(true);
  };

  const handleViewResults = (session: ExamSession) => {
    setActiveTab('stats');
    setStatsSessionId(session.id);
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

  const handleExportExcel = async (sessionId: string) => {
    downloadExcelResults(sessionId);
    toast.success('İndirme başlatıldı');
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

  const currentExamType = examTypes?.find((t) => t.id === selectedExamType);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Ölçme Değerlendirme
        </h1>
        <p className="text-muted-foreground mt-2">
          Deneme sınavları, okul notları ve değerlendirme sonuçlarını yönetin
        </p>
      </div>

      <Tabs value={selectedExamType} onValueChange={setSelectedExamType}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          {examTypes?.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {examTypes?.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="sessions">Deneme Sınavları</TabsTrigger>
                    <TabsTrigger value="entry">Sonuç Girişi</TabsTrigger>
                    <TabsTrigger value="excel">Toplu İşlemler</TabsTrigger>
                    <TabsTrigger value="stats">İstatistikler</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="sessions" className="mt-0">
                    <ExamSessionsList
                      sessions={sessions}
                      examTypeName={type.name}
                      onEdit={handleEditSession}
                      onDelete={handleDeleteSession}
                      onCreate={handleCreateSession}
                      onViewResults={handleViewResults}
                    />
                  </TabsContent>

                  <TabsContent value="entry" className="mt-0">
                    <ExamResultsEntry
                      sessions={sessions}
                      subjects={subjects}
                      students={students}
                      onSave={handleSaveResults}
                    />
                  </TabsContent>

                  <TabsContent value="excel" className="mt-0">
                    <ExcelImportExport
                      sessions={sessions}
                      examTypeId={type.id}
                      examTypeName={type.name}
                      onImport={handleImportExcel}
                      onExport={handleExportExcel}
                      onDownloadTemplate={handleDownloadTemplate}
                    />
                  </TabsContent>

                  <TabsContent value="stats" className="mt-0">
                    <ExamStatistics
                      sessions={sessions}
                      selectedSession={statsSessionId}
                      onSessionChange={setStatsSessionId}
                      statistics={statistics || null}
                      isLoading={statsLoading}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <SchoolExamsManagement
        students={students}
        schoolExams={schoolExams}
        onSave={handleSaveSchoolExam}
        onDelete={handleDeleteSchoolExam}
      />

      <ExamSessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        examTypeId={selectedExamType}
        examTypeName={currentExamType?.name || ''}
        session={editingSession || undefined}
        onSave={handleSaveSession}
      />
    </div>
  );
}
