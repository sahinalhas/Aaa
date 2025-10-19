import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  FileSpreadsheet,
  BarChart3,
  Table as TableIcon,
  Zap,
} from 'lucide-react';
import { QuickExamCreate } from './QuickExamCreate';
import { ExamResultDialog } from './ExamResultDialog';
import { ExcelImportDialog } from './ExcelImportDialog';
import { BulkResultsEntry } from './BulkResultsEntry';
import type {
  ExamType,
  ExamSession,
  ExamSubject,
  SubjectResults,
} from '../../../shared/types/exam-management.types';

interface Student {
  id: string;
  name: string;
}

interface PracticeExamsTabProps {
  examTypes: ExamType[];
  sessions: ExamSession[];
  subjects: ExamSubject[];
  students: Student[];
  onCreateExam: (data: {
    exam_type_id: string;
    name: string;
    exam_date: string;
    description?: string;
  }) => Promise<void>;
  onViewStatistics: (session: ExamSession) => void;
  onImportExcel: (sessionId: string, file: File) => Promise<{ success: boolean; message: string }>;
  onDownloadTemplate: (examTypeId: string) => void;
  onSaveResults: (sessionId: string, studentId: string, results: SubjectResults[]) => Promise<void>;
  onResultSessionChange: (sessionId: string) => void;
  isCreating?: boolean;
}

export function PracticeExamsTab({
  examTypes,
  sessions,
  subjects,
  students,
  onCreateExam,
  onViewStatistics,
  onImportExcel,
  onDownloadTemplate,
  onSaveResults,
  onResultSessionChange,
  isCreating = false,
}: PracticeExamsTabProps) {
  const [filterExamType, setFilterExamType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultDialogSession, setResultDialogSession] = useState<ExamSession | null>(null);
  const [excelDialogSession, setExcelDialogSession] = useState<ExamSession | null>(null);
  const [bulkEntrySession, setBulkEntrySession] = useState<ExamSession | null>(null);

  const filteredSessions = sessions.filter((session) => {
    const matchesType = filterExamType === 'all' || session.exam_type_id === filterExamType;
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getExamTypeName = (examTypeId: string) => {
    return examTypes.find((t) => t.id === examTypeId)?.name || examTypeId;
  };

  const handleIndividualEntryClick = (session: ExamSession) => {
    onResultSessionChange(session.id);
    setResultDialogSession(session);
  };

  const handleBulkTableEntryClick = (session: ExamSession) => {
    onResultSessionChange(session.id);
    setBulkEntrySession(session);
  };

  const handleExcelEntryClick = (session: ExamSession) => {
    onResultSessionChange(session.id);
    setExcelDialogSession(session);
  };

  const handleStatisticsClick = (session: ExamSession) => {
    onViewStatistics(session);
  };

  return (
    <div className="space-y-6">
      <QuickExamCreate
        examTypes={examTypes}
        onCreateExam={onCreateExam}
        defaultExamTypeId={filterExamType === 'all' ? undefined : filterExamType}
        isLoading={isCreating}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Deneme Sınavları Listesi
            </CardTitle>
            <Badge variant="secondary">{filteredSessions.length} Deneme</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Deneme ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınav Türleri</SelectItem>
                  {examTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery || filterExamType !== 'all'
                  ? 'Filtrelere uygun deneme bulunamadı.'
                  : 'Henüz hiç deneme oluşturulmamış. Yukarıdaki formdan hızlıca deneme oluşturabilirsiniz.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow border-2">
                  <CardHeader className="pb-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg leading-none">{session.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getExamTypeName(session.exam_type_id)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.exam_date).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      {session.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {session.description}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBulkTableEntryClick(session)}
                          variant="default"
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          title="Hızlı Toplu Giriş (Tablo)"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Hızlı Giriş
                        </Button>
                        <Button
                          onClick={() => handleStatisticsClick(session)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          title="İstatistikleri Görüntüle"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          İstatistik
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleIndividualEntryClick(session)}
                          variant="outline"
                          size="sm"
                          className="flex-col h-auto py-2 gap-1"
                          title="Bireysel Sonuç Girişi"
                        >
                          <User className="h-3.5 w-3.5" />
                          <span className="text-xs">Bireysel</span>
                        </Button>
                        <Button
                          onClick={() => handleExcelEntryClick(session)}
                          variant="outline"
                          size="sm"
                          className="flex-col h-auto py-2 gap-1"
                          title="Excel İle Toplu Giriş"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          <span className="text-xs">Excel</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {resultDialogSession && (
        <ExamResultDialog
          open={!!resultDialogSession}
          onOpenChange={(open) => !open && setResultDialogSession(null)}
          session={resultDialogSession}
          subjects={subjects}
          students={students}
          onSave={onSaveResults}
        />
      )}

      {bulkEntrySession && (
        <BulkResultsEntry
          open={!!bulkEntrySession}
          onOpenChange={(open) => !open && setBulkEntrySession(null)}
          session={bulkEntrySession}
          subjects={subjects}
          students={students}
          onSave={onSaveResults}
        />
      )}

      {excelDialogSession && (
        <ExcelImportDialog
          open={!!excelDialogSession}
          onOpenChange={(open) => !open && setExcelDialogSession(null)}
          session={excelDialogSession}
          onImport={onImportExcel}
          onDownloadTemplate={onDownloadTemplate}
        />
      )}
    </div>
  );
}
