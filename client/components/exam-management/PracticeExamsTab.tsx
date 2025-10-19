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
  Zap,
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuickExamCreate } from './QuickExamCreate';
import { ExamResultDialog } from './ExamResultDialog';
import { ExcelImportDialog } from './ExcelImportDialog';
import { BulkResultsEntry } from './BulkResultsEntry';
import { DeleteExamDialog } from './DeleteExamDialog';
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
  onEditSession: (session: ExamSession) => void;
  onDeleteSession: (sessionId: string) => Promise<void>;
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
  onEditSession,
  onDeleteSession,
  isCreating = false,
}: PracticeExamsTabProps) {
  const [filterExamType, setFilterExamType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultDialogSession, setResultDialogSession] = useState<ExamSession | null>(null);
  const [excelDialogSession, setExcelDialogSession] = useState<ExamSession | null>(null);
  const [bulkEntrySession, setBulkEntrySession] = useState<ExamSession | null>(null);
  const [deleteDialogSession, setDeleteDialogSession] = useState<ExamSession | null>(null);

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

  const handleEditClick = (session: ExamSession) => {
    onEditSession(session);
  };

  const handleDeleteClick = (session: ExamSession) => {
    setDeleteDialogSession(session);
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogSession) {
      await onDeleteSession(deleteDialogSession.id);
      setDeleteDialogSession(null);
    }
  };

  return (
    <div className="space-y-5">
      <QuickExamCreate
        examTypes={examTypes}
        onCreateExam={onCreateExam}
        defaultExamTypeId={filterExamType === 'all' ? undefined : filterExamType}
        isLoading={isCreating}
      />

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Deneme Sınavları
            </CardTitle>
            <Badge variant="secondary" className="font-medium">
              {filteredSessions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3 bg-muted/20 border-b">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Deneme ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background"
                />
              </div>
              <div className="w-full sm:w-[180px]">
                <Select value={filterExamType} onValueChange={setFilterExamType}>
                  <SelectTrigger className="h-9 bg-background">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {examTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-8">
              <Alert>
                <AlertDescription className="text-center">
                  {searchQuery || filterExamType !== 'all'
                    ? 'Filtrelere uygun deneme bulunamadı.'
                    : 'Henüz deneme oluşturulmamış.'}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-3 text-left font-medium text-sm">Deneme</th>
                    <th className="p-3 text-left font-medium text-sm">Tür</th>
                    <th className="p-3 text-left font-medium text-sm">Tarih</th>
                    <th className="p-3 text-left font-medium text-sm hidden lg:table-cell">Açıklama</th>
                    <th className="p-3 text-center font-medium text-sm">Sonuç Girişi</th>
                    <th className="p-3 text-center font-medium text-sm w-[80px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, index) => (
                    <tr
                      key={session.id}
                      className={`border-b transition-colors hover:bg-muted/20 ${
                        index % 2 === 0 ? '' : 'bg-muted/5'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-medium text-sm">{session.name}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs font-normal">
                          {getExamTypeName(session.exam_type_id)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(session.exam_date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {session.description || '—'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            onClick={() => handleBulkTableEntryClick(session)}
                            size="sm"
                            className="h-8 px-3 bg-primary/90 hover:bg-primary"
                          >
                            <Zap className="h-3.5 w-3.5 md:mr-1.5" />
                            <span className="hidden md:inline text-xs">Hızlı</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleIndividualEntryClick(session)}
                              >
                                <User className="h-4 w-4 mr-2" />
                                Bireysel
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleExcelEntryClick(session)}
                              >
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Excel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleStatisticsClick(session)}
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                İstatistik
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            onClick={() => handleEditClick(session)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(session)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      <DeleteExamDialog
        open={!!deleteDialogSession}
        onOpenChange={(open) => !open && setDeleteDialogSession(null)}
        session={deleteDialogSession}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
