import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import type { ExamType } from '../../../shared/types/exam-management.types';

interface QuickExamCreateProps {
  examTypes: ExamType[];
  onCreateExam: (data: {
    exam_type_id: string;
    name: string;
    exam_date: string;
    description?: string;
  }) => Promise<void>;
  defaultExamTypeId?: string;
  isLoading?: boolean;
}

export function QuickExamCreate({
  examTypes,
  onCreateExam,
  defaultExamTypeId,
  isLoading = false,
}: QuickExamCreateProps) {
  const [examTypeId, setExamTypeId] = useState<string>(
    defaultExamTypeId || examTypes[0]?.id || ''
  );
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTypeId || !name || !examDate) return;

    await onCreateExam({
      exam_type_id: examTypeId,
      name,
      exam_date: examDate,
      description: description || undefined,
    });

    setName('');
    setDescription('');
    setExamDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Hızlı Deneme Oluştur
        </CardTitle>
        <CardDescription>
          Deneme sınavını oluşturun ve hemen sonuç girişine başlayın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam-type">Sınav Türü *</Label>
              <Select value={examTypeId} onValueChange={setExamTypeId}>
                <SelectTrigger id="exam-type">
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

            <div className="space-y-2">
              <Label htmlFor="exam-name">Deneme Adı *</Label>
              <Input
                id="exam-name"
                placeholder="örn: 1. Deneme"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam-date">Sınav Tarihi *</Label>
              <Input
                id="exam-date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam-description">Açıklama</Label>
              <Input
                id="exam-description"
                placeholder="Opsiyonel"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!examTypeId || !name || !examDate || isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Deneme Oluştur
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
