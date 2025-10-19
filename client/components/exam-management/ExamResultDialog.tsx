import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Save } from 'lucide-react';
import type {
  ExamSession,
  ExamSubject,
  SubjectResults,
} from '../../../shared/types/exam-management.types';

interface Student {
  id: string;
  name: string;
  ad?: string;
  soyad?: string;
}

interface ExamResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ExamSession;
  subjects: ExamSubject[];
  students: Student[];
  onSave: (sessionId: string, studentId: string, results: SubjectResults[]) => Promise<void>;
}

export function ExamResultDialog({
  open,
  onOpenChange,
  session,
  subjects,
  students,
  onSave,
}: ExamResultDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [subjectResults, setSubjectResults] = useState<Map<string, SubjectResults>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredStudents = students.filter((student) => {
    const searchLower = studentSearch.toLowerCase();
    const studentName = student.name?.toLowerCase() || '';
    const studentFullName = `${student.ad || ''} ${student.soyad || ''}`.toLowerCase();
    const studentId = student.id.toLowerCase();
    
    return (
      studentName.includes(searchLower) ||
      studentFullName.includes(searchLower) ||
      studentId.includes(searchLower)
    );
  });

  const handleSubjectChange = (
    subjectId: string,
    field: 'correct_count' | 'wrong_count' | 'empty_count',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const currentResults = subjectResults.get(subjectId) || {
      subject_id: subjectId,
      correct_count: 0,
      wrong_count: 0,
      empty_count: 0,
    };

    const updatedResults = { ...currentResults, [field]: numValue };
    const newMap = new Map(subjectResults);
    newMap.set(subjectId, updatedResults);
    setSubjectResults(newMap);
  };

  const calculateNet = (subjectId: string): number => {
    const result = subjectResults.get(subjectId);
    if (!result) return 0;
    return Math.max(0, result.correct_count - result.wrong_count / 4);
  };

  const getTotalNet = (): number => {
    return subjects.reduce((total, subject) => total + calculateNet(subject.id), 0);
  };

  const handleSave = async () => {
    if (!selectedStudent) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      const results: SubjectResults[] = subjects.map((subject) => {
        const result = subjectResults.get(subject.id);
        return result || {
          subject_id: subject.id,
          correct_count: 0,
          wrong_count: 0,
          empty_count: 0,
        };
      });

      await onSave(session.id, selectedStudent, results);
      setSaveSuccess(true);
      setSubjectResults(new Map());
      setSelectedStudent('');
      
      setTimeout(() => {
        setSaveSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      console.error('Error saving exam results:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = selectedStudent && subjectResults.size > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bireysel Sonuç Girişi - {session.name}</DialogTitle>
          <DialogDescription>
            Öğrenci seçerek ders bazında sonuç girişi yapın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-select">Öğrenci Seçin *</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger id="student-select">
                <SelectValue placeholder="Numara veya isim ile ara..." />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <Input
                    placeholder="Numara veya isim ile ara..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                {filteredStudents.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Öğrenci bulunamadı
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.id} - {student.name || `${student.ad || ''} ${student.soyad || ''}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {saveSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Sonuçlar başarıyla kaydedildi!
              </AlertDescription>
            </Alert>
          )}

          {selectedStudent && subjects.length > 0 && (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Ders</th>
                      <th className="p-3 text-center font-medium w-24">Doğru</th>
                      <th className="p-3 text-center font-medium w-24">Yanlış</th>
                      <th className="p-3 text-center font-medium w-24">Boş</th>
                      <th className="p-3 text-center font-medium w-24">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, idx) => {
                      const result = subjectResults.get(subject.id);
                      return (
                        <tr
                          key={subject.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-muted/20'}
                        >
                          <td className="p-3 font-medium">
                            {subject.subject_name}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({subject.question_count} soru)
                            </span>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              max={subject.question_count}
                              value={result?.correct_count || ''}
                              onChange={(e) =>
                                handleSubjectChange(
                                  subject.id,
                                  'correct_count',
                                  e.target.value
                                )
                              }
                              className="text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              max={subject.question_count}
                              value={result?.wrong_count || ''}
                              onChange={(e) =>
                                handleSubjectChange(subject.id, 'wrong_count', e.target.value)
                              }
                              className="text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              max={subject.question_count}
                              value={result?.empty_count || ''}
                              onChange={(e) =>
                                handleSubjectChange(subject.id, 'empty_count', e.target.value)
                              }
                              className="text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-3 text-center font-bold text-primary">
                            {calculateNet(subject.id).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 bg-primary/5">
                      <td className="p-3 font-bold" colSpan={4}>
                        Toplam Net
                      </td>
                      <td className="p-3 text-center font-bold text-primary text-lg">
                        {getTotalNet().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSubjectResults(new Map());
                setSelectedStudent('');
              }}
            >
              Temizle
            </Button>
            <Button onClick={handleSave} disabled={!canSave || isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
