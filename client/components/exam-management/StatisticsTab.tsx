import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, TrendingUp, Filter } from 'lucide-react';
import { ExamStatistics } from './ExamStatistics';
import type {
  ExamType,
  ExamSession,
  ExamStatistics as ExamStatisticsType,
} from '../../../shared/types/exam-management.types';

interface StatisticsTabProps {
  examTypes: ExamType[];
  sessions: ExamSession[];
  statistics: ExamStatisticsType | null;
  isLoading: boolean;
  onSessionChange: (sessionId: string) => void;
  selectedSessionId?: string;
}

export function StatisticsTab({
  examTypes,
  sessions,
  statistics,
  isLoading,
  onSessionChange,
  selectedSessionId,
}: StatisticsTabProps) {
  const [filterExamType, setFilterExamType] = useState<string>('all');

  const filteredSessions = sessions.filter((session) => {
    if (filterExamType === 'all') return true;
    return session.exam_type_id === filterExamType;
  });

  const getExamTypeName = (examTypeId: string) => {
    return examTypes.find((t) => t.id === examTypeId)?.name || examTypeId;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            İstatistikler ve Analizler
          </CardTitle>
          <CardDescription>
            Deneme sınavı sonuçlarını analiz edin ve performans trendlerini görüntüleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stats-exam-type">Sınav Türü Filtresi</Label>
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger id="stats-exam-type">
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

            <div className="space-y-2">
              <Label htmlFor="stats-session">Deneme Seçin</Label>
              <Select value={selectedSessionId} onValueChange={onSessionChange}>
                <SelectTrigger id="stats-session">
                  <SelectValue placeholder="Deneme sınavı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSessions.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {filterExamType === 'all'
                        ? 'Henüz deneme oluşturulmamış'
                        : 'Bu sınav türünde deneme bulunamadı'}
                    </div>
                  ) : (
                    filteredSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name} ({getExamTypeName(session.exam_type_id)}) -{' '}
                        {new Date(session.exam_date).toLocaleDateString('tr-TR')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!selectedSessionId ? (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                İstatistikleri görüntülemek için yukarıdan bir deneme sınavı seçin.
              </AlertDescription>
            </Alert>
          ) : (
            <ExamStatistics
              sessions={sessions}
              selectedSession={selectedSessionId}
              onSessionChange={onSessionChange}
              statistics={statistics}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Genel Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Toplam Deneme</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sınav Türü</p>
                <p className="text-2xl font-bold">{examTypes.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Son Deneme</p>
                <p className="text-sm font-medium">
                  {sessions.length > 0
                    ? new Date(sessions[0].exam_date).toLocaleDateString('tr-TR')
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
