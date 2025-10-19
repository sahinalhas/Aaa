import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Upload,
  Search,
  Filter,
  Calendar,
  Users,
} from 'lucide-react';
import { QuickExamCreate } from './QuickExamCreate';
import { QuickResultEntry } from './QuickResultEntry';
import { ExamSessionDialog } from './ExamSessionDialog';
import { ExamResultsEntry } from './ExamResultsEntry';
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
  onEditExam: (session: ExamSession) => void;
  onDeleteExam: (sessionId: string) => Promise<void>;
  onViewStatistics: (session: ExamSession) => void;
  onImportExcel: (sessionId: string, file: File) => Promise<{ success: boolean; message: string }>;
  onDownloadTemplate: (examTypeId: string) => void;
  onSaveResults: (sessionId: string, studentId: string, results: SubjectResults[]) => Promise<void>;
  isCreating?: boolean;
}

export function PracticeExamsTab({
  examTypes,
  sessions,
  subjects,
  students,
  onCreateExam,
  onEditExam,
  onDeleteExam,
  onViewStatistics,
  onImportExcel,
  onDownloadTemplate,
  onSaveResults,
  isCreating = false,
}: PracticeExamsTabProps) {
  const [filterExamType, setFilterExamType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionForResult, setSelectedSessionForResult] = useState<string>('');
  const [showResultEntry, setShowResultEntry] = useState(false);

  const filteredSessions = sessions.filter((session) => {
    const matchesType = filterExamType === 'all' || session.exam_type_id === filterExamType;
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getExamTypeName = (examTypeId: string) => {
    return examTypes.find((t) => t.id === examTypeId)?.name || examTypeId;
  };

  const handleResultEntryClick = (sessionId: string) => {
    setSelectedSessionForResult(sessionId);
    setShowResultEntry(true);
  };

  return (
    <div className="space-y-6">
      <QuickExamCreate
        examTypes={examTypes}
        onCreateExam={onCreateExam}
        defaultExamTypeId={filterExamType === 'all' ? undefined : filterExamType}
        isLoading={isCreating}
      />

      <QuickResultEntry
        sessions={sessions}
        onSelectSession={setSelectedSessionForResult}
        onImportExcel={onImportExcel}
        onDownloadTemplate={onDownloadTemplate}
        selectedSessionId={selectedSessionForResult}
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
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg leading-none">{session.name}</h3>
                        <Badge variant="outline" className="mt-2">
                          {getExamTypeName(session.exam_type_id)}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditExam(session)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewStatistics(session)}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            İstatistikler
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteExam(session.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.exam_date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      {session.description && (
                        <p className="text-xs line-clamp-2">{session.description}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleResultEntryClick(session.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Sonuç Gir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showResultEntry && selectedSessionForResult && (
        <Card>
          <CardHeader>
            <CardTitle>Bireysel Sonuç Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <ExamResultsEntry
              sessions={sessions}
              subjects={subjects.filter(
                (s) =>
                  s.exam_type_id ===
                  sessions.find((session) => session.id === selectedSessionForResult)?.exam_type_id
              )}
              students={students}
              onSave={onSaveResults}
              preSelectedSessionId={selectedSessionForResult}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
