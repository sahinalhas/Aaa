import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Download, Eye, Columns, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CounselingSession, CounselingTopic } from '../types';
import { calculateSessionDuration } from '../utils/sessionHelpers';

type SortField = 'date' | 'time' | 'duration' | 'student' | 'type';
type SortDirection = 'asc' | 'desc';

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface EnhancedSessionsTableProps {
  sessions: CounselingSession[];
  topics: CounselingTopic[];
  onExport: () => void;
  onSelectSession: (session: CounselingSession) => void;
}

export default function EnhancedSessionsTable({ 
  sessions,
  topics,
  onExport,
  onSelectSession 
}: EnhancedSessionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [columns, setColumns] = useState<Column[]>([
    { key: 'date', label: 'Tarih', visible: true },
    { key: 'time', label: 'Saat', visible: true },
    { key: 'student', label: 'Öğrenci/Grup', visible: true },
    { key: 'type', label: 'Tip', visible: true },
    { key: 'topic1', label: 'RPD Hizmet Türü', visible: true },
    { key: 'topic2', label: '1. Aşama', visible: true },
    { key: 'topic3', label: '2. Aşama', visible: true },
    { key: 'topic', label: 'Konu', visible: true },
    { key: 'mode', label: 'Mod', visible: true },
    { key: 'duration', label: 'Süre', visible: true },
    { key: 'status', label: 'Durum', visible: true },
    { key: 'notes', label: 'Notlar', visible: false },
  ]);

  const toggleColumn = (key: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const topicsMap = useMemo(() => {
    const map = new Map<string, CounselingTopic>();
    topics.forEach(topic => {
      map.set(topic.title, topic);
    });
    return map;
  }, [topics]);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
          break;
        case 'time':
          comparison = a.entryTime.localeCompare(b.entryTime);
          break;
        case 'duration': {
          const durationA = a.exitTime ? calculateSessionDuration(a.entryTime, a.exitTime) || 0 : 0;
          const durationB = b.exitTime ? calculateSessionDuration(b.entryTime, b.exitTime) || 0 : 0;
          comparison = durationA - durationB;
          break;
        }
        case 'student': {
          const nameA = a.sessionType === 'individual' ? a.student?.name || '' : a.groupName || '';
          const nameB = b.sessionType === 'individual' ? b.student?.name || '' : b.groupName || '';
          comparison = nameA.localeCompare(nameB, 'tr');
          break;
        }
        case 'type':
          comparison = a.sessionType.localeCompare(b.sessionType);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sessions, sortField, sortDirection]);

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      {sortField === field && (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      )}
      {sortField !== field && <ArrowUpDown className="h-3 w-3 opacity-40" />}
    </button>
  );

  const getTopicHierarchy = (topicTitle: string) => {
    if (!topicTitle) {
      return ['Konu belirtilmedi'];
    }
    const topic = topicsMap.get(topicTitle);
    if (!topic || !topic.fullPath) {
      return [topicTitle];
    }
    return topic.fullPath.split('>').map(s => s.trim());
  };

  const visibleColumnCount = columns.filter(c => c.visible).length;

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Henüz kayıt bulunmuyor</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Görüşme Kayıtları</CardTitle>
            <CardDescription>{sessions.length} görüşme bulundu</CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Columns className="h-4 w-4" />
                  Kolonlar
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {visibleColumnCount}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Görünür Kolonlar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={col.visible}
                    onCheckedChange={() => toggleColumn(col.key)}
                    disabled={visibleColumnCount === 1 && col.visible}
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Excel İndir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-sm font-medium text-muted-foreground">
                {columns.find(c => c.key === 'date')?.visible && (
                  <th className="text-left px-4 py-3">
                    <SortButton field="date" label="Tarih" />
                  </th>
                )}
                {columns.find(c => c.key === 'time')?.visible && (
                  <th className="text-left px-4 py-3">
                    <SortButton field="time" label="Saat" />
                  </th>
                )}
                {columns.find(c => c.key === 'student')?.visible && (
                  <th className="text-left px-4 py-3">
                    <SortButton field="student" label="Öğrenci/Grup" />
                  </th>
                )}
                {columns.find(c => c.key === 'type')?.visible && (
                  <th className="text-left px-4 py-3">
                    <SortButton field="type" label="Tip" />
                  </th>
                )}
                {columns.find(c => c.key === 'topic1')?.visible && (
                  <th className="text-left px-4 py-3">RPD Hizmet Türü</th>
                )}
                {columns.find(c => c.key === 'topic2')?.visible && (
                  <th className="text-left px-4 py-3">1. Aşama</th>
                )}
                {columns.find(c => c.key === 'topic3')?.visible && (
                  <th className="text-left px-4 py-3">2. Aşama</th>
                )}
                {columns.find(c => c.key === 'topic')?.visible && (
                  <th className="text-left px-4 py-3">Konu</th>
                )}
                {columns.find(c => c.key === 'mode')?.visible && (
                  <th className="text-left px-4 py-3">Mod</th>
                )}
                {columns.find(c => c.key === 'duration')?.visible && (
                  <th className="text-left px-4 py-3">
                    <SortButton field="duration" label="Süre" />
                  </th>
                )}
                {columns.find(c => c.key === 'status')?.visible && (
                  <th className="text-left px-4 py-3">Durum</th>
                )}
                {columns.find(c => c.key === 'notes')?.visible && (
                  <th className="text-left px-4 py-3">Notlar</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedSessions.map((session, index) => {
                const duration = session.exitTime
                  ? calculateSessionDuration(session.entryTime, session.exitTime)
                  : null;
                const studentName = session.sessionType === 'individual'
                  ? session.student?.name
                  : session.groupName || 'Grup Görüşmesi';

                return (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onSelectSession(session)}
                  >
                    {columns.find(c => c.key === 'date')?.visible && (
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(session.sessionDate), 'dd MMM yyyy', { locale: tr })}
                      </td>
                    )}
                    {columns.find(c => c.key === 'time')?.visible && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span>{session.entryTime}</span>
                          {session.exitTime && (
                            <span className="text-xs text-muted-foreground">
                              {session.exitTime}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    {columns.find(c => c.key === 'student')?.visible && (
                      <td className="px-4 py-3 text-sm font-medium max-w-xs truncate">
                        {studentName}
                      </td>
                    )}
                    {columns.find(c => c.key === 'type')?.visible && (
                      <td className="px-4 py-3">
                        <Badge
                          variant={session.sessionType === 'individual' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {session.sessionType === 'individual' ? 'Bireysel' : 'Grup'}
                        </Badge>
                      </td>
                    )}
                    {columns.find(c => c.key === 'topic1')?.visible && (
                      <td className="px-4 py-3">
                        {getTopicHierarchy(session.topic)[0] && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 border-gray-300 text-xs"
                          >
                            {getTopicHierarchy(session.topic)[0]}
                          </Badge>
                        )}
                      </td>
                    )}
                    {columns.find(c => c.key === 'topic2')?.visible && (
                      <td className="px-4 py-3">
                        {getTopicHierarchy(session.topic)[1] && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-300 text-xs"
                          >
                            {getTopicHierarchy(session.topic)[1]}
                          </Badge>
                        )}
                      </td>
                    )}
                    {columns.find(c => c.key === 'topic3')?.visible && (
                      <td className="px-4 py-3">
                        {getTopicHierarchy(session.topic)[2] && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-300 text-xs font-semibold"
                          >
                            {getTopicHierarchy(session.topic)[2]}
                          </Badge>
                        )}
                      </td>
                    )}
                    {columns.find(c => c.key === 'topic')?.visible && (
                      <td className="px-4 py-3 text-sm max-w-xs">
                        <span className="line-clamp-2">
                          {session.topic || 'Konu belirtilmedi'}
                        </span>
                      </td>
                    )}
                    {columns.find(c => c.key === 'mode')?.visible && (
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {session.sessionMode}
                      </td>
                    )}
                    {columns.find(c => c.key === 'duration')?.visible && (
                      <td className="px-4 py-3 text-sm">
                        {duration ? `${duration} dk` : '-'}
                      </td>
                    )}
                    {columns.find(c => c.key === 'status')?.visible && (
                      <td className="px-4 py-3">
                        {session.completed ? (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Tamamlandı
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Devam Ediyor
                          </Badge>
                        )}
                      </td>
                    )}
                    {columns.find(c => c.key === 'notes')?.visible && (
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-xs text-muted-foreground truncate">
                          {session.detailedNotes || session.sessionDetails || '-'}
                        </p>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
