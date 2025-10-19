import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, User, Loader2, CheckCircle2 } from 'lucide-react';
import type { ExamSession } from '../../../shared/types/exam-management.types';

interface QuickResultEntryProps {
  sessions: ExamSession[];
  onSelectSession: (sessionId: string) => void;
  onImportExcel: (sessionId: string, file: File) => Promise<{ success: boolean; message: string }>;
  onDownloadTemplate: (examTypeId: string) => void;
  selectedSessionId?: string;
}

export function QuickResultEntry({
  sessions,
  onSelectSession,
  onImportExcel,
  onDownloadTemplate,
  selectedSessionId,
}: QuickResultEntryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!selectedSessionId) {
        setUploadResult({
          success: false,
          message: 'Lütfen önce bir deneme seçin',
        });
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      const excelFile = files.find(
        (file) =>
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls')
      );

      if (excelFile) {
        await handleFileUpload(excelFile);
      } else {
        setUploadResult({
          success: false,
          message: 'Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin',
        });
      }
    },
    [selectedSessionId]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedSessionId) {
      setUploadResult({
        success: false,
        message: 'Lütfen önce bir deneme seçin',
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await onImportExcel(selectedSessionId, file);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Dosya yüklenirken bir hata oluştu',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Hızlı Sonuç Girişi
        </CardTitle>
        <CardDescription>
          Bireysel giriş yapın veya Excel dosyası ile toplu yükleme yapın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="session-select">Deneme Seçin *</Label>
          <Select value={selectedSessionId} onValueChange={onSelectSession}>
            <SelectTrigger id="session-select">
              <SelectValue placeholder="Deneme sınavı seçin" />
            </SelectTrigger>
            <SelectContent>
              {sessions.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  Henüz deneme oluşturulmamış
                </div>
              ) : (
                sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name} - {new Date(session.exam_date).toLocaleDateString('tr-TR')}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedSessionId && (
          <Tabs defaultValue="excel" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="excel">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Toplu Giriş (Excel)
              </TabsTrigger>
              <TabsTrigger value="individual">
                <User className="h-4 w-4 mr-2" />
                Bireysel Giriş
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excel" className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                  ${!selectedSessionId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <input
                  type="file"
                  id="excel-upload"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={!selectedSessionId || isUploading}
                />
                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {isUploading ? (
                    <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isUploading
                        ? 'Yükleniyor...'
                        : 'Excel dosyasını sürükleyip bırakın veya tıklayın'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Desteklenen formatlar: .xlsx, .xls
                    </p>
                  </div>
                </label>
              </div>

              {uploadResult && (
                <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
                  <AlertDescription className="flex items-center gap-2">
                    {uploadResult.success && <CheckCircle2 className="h-4 w-4" />}
                    {uploadResult.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => selectedSession && onDownloadTemplate(selectedSession.exam_type_id)}
                  disabled={!selectedSession}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Şablon İndir
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="individual">
              <Alert>
                <AlertDescription>
                  Bireysel giriş için "Sonuç Girişi" sekmesini kullanın. Buradan öğrenci seçip
                  detaylı sonuç girebilirsiniz.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
