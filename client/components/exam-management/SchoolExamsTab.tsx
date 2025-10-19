import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { SchoolExamsManagement } from './SchoolExamsManagement';
import type { SchoolExamResult } from '../../../shared/types/exam-management.types';

interface Student {
  id: string;
  name: string;
}

interface SchoolExamsTabProps {
  students: Student[];
  schoolExams: SchoolExamResult[];
  onSave: (data: any) => Promise<void>;
  onDelete: (examId: string) => Promise<void>;
}

export function SchoolExamsTab({
  students,
  schoolExams,
  onSave,
  onDelete,
}: SchoolExamsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Okul Sınavları Yönetimi
          </CardTitle>
          <CardDescription>
            Dönem sonu, yazılı ve diğer okul sınav notlarını yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolExamsManagement
            students={students}
            schoolExams={schoolExams}
            onSave={onSave}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
