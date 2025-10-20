import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Brain, Flame, Award, Clock, FileQuestion, TrendingUp } from 'lucide-react';
import { DashboardMetricsWidget } from './DashboardMetricsWidget';
import { GoalTrackingWidget } from './GoalTrackingWidget';
import { SubjectHeatmapWidget } from './SubjectHeatmapWidget';
import { BenchmarkComparisonWidget } from './BenchmarkComparisonWidget';
import { PredictiveAnalysisWidget } from './PredictiveAnalysisWidget';
import { TimeAnalysisWidget } from './TimeAnalysisWidget';
import { QuestionAnalysisWidget } from './QuestionAnalysisWidget';
import { PDFReportDownloadWidget } from './PDFReportDownloadWidget';
import { AlertsWidget } from './AlertsWidget';

async function fetchStudents() {
  const response = await fetch('/api/students');
  if (!response.ok) throw new Error('Öğrenciler yüklenemedi');
  const data = await response.json();
  return data.data || [];
}

async function fetchSessions() {
  const response = await fetch('/api/exam-management/sessions');
  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data || [];
}

interface AdvancedAnalyticsTabProps {
  examTypes: any[];
}

export function AdvancedAnalyticsTab({ examTypes }: AdvancedAnalyticsTabProps) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSession, setSelectedSession] = useState('');

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['exam-sessions'],
    queryFn: fetchSessions,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects', selectedExamType],
    queryFn: async () => {
      if (!selectedExamType) return [];
      const response = await fetch(`/api/exam-management/types/${selectedExamType}/subjects`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!selectedExamType,
  });

  const selectedStudentData = students.find((s: any) => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gelişmiş Analitik Araçları</CardTitle>
          <CardDescription>
            Gerçek zamanlı metrikler, tahminsel analitik, hedef takip ve detaylı performans analizleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Öğrenci Seç</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Öğrenci seçin" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student: any) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.fullName || student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sınav Türü</Label>
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sınav türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Deneme Sınavı (Soru Analizi İçin)</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Deneme seçin" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session: any) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DashboardMetricsWidget />

      <Tabs defaultValue="student" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="student">
            <TrendingUp className="h-4 w-4 mr-2" />
            Öğrenci Analizi
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <Flame className="h-4 w-4 mr-2" />
            Isı Haritası
          </TabsTrigger>
          <TabsTrigger value="prediction">
            <Brain className="h-4 w-4 mr-2" />
            Tahminsel AI
          </TabsTrigger>
          <TabsTrigger value="question">
            <FileQuestion className="h-4 w-4 mr-2" />
            Soru Analizi
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Award className="h-4 w-4 mr-2" />
            Uyarılar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-6">
          {selectedStudent && selectedExamType ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GoalTrackingWidget
                  studentId={selectedStudent}
                  examTypes={examTypes}
                  subjects={subjects}
                />
                <BenchmarkComparisonWidget
                  studentId={selectedStudent}
                  studentName={selectedStudentData?.fullName || selectedStudentData?.name}
                />
              </div>
              <TimeAnalysisWidget
                studentId={selectedStudent}
                examTypeId={selectedExamType}
                studentName={selectedStudentData?.fullName || selectedStudentData?.name}
              />
              <PDFReportDownloadWidget
                studentId={selectedStudent}
                examTypes={examTypes}
                studentName={selectedStudentData?.fullName || selectedStudentData?.name}
              />
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Öğrenci ve sınav türü seçerek analiz görüntüleyin</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          {selectedStudent && selectedExamType ? (
            <SubjectHeatmapWidget
              studentId={selectedStudent}
              examTypeId={selectedExamType}
              studentName={selectedStudentData?.fullName || selectedStudentData?.name}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Öğrenci ve sınav türü seçerek ısı haritası görüntüleyin</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          {selectedStudent && selectedExamType ? (
            <PredictiveAnalysisWidget
              studentId={selectedStudent}
              examTypeId={selectedExamType}
              studentName={selectedStudentData?.fullName || selectedStudentData?.name}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Öğrenci ve sınav türü seçerek tahminsel analiz görüntüleyin</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="question" className="space-y-6">
          {selectedSession ? (
            <QuestionAnalysisWidget
              sessionId={selectedSession}
              sessionName={sessions.find((s: any) => s.id === selectedSession)?.name}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>Deneme sınavı seçerek soru analizi görüntüleyin</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsWidget showAll={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
