import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Download,
  Info,
  AlertCircle,
  FileCheck,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { ExamSession } from '../../../shared/types/exam-management.types';

interface EnhancedExcelImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ExamSession;
  onImport: (sessionId: string, file: File) => Promise<{ 
    success: boolean; 
    message: string;
    imported_count?: number;
    errors?: Array<{ row: number; message: string; student?: string }>;
  }>;
  onDownloadTemplate: (examTypeId: string) => void;
}

interface PreviewData {
  studentId: string;
  studentName: string;
  subjects: Record<string, { correct: number; wrong: number; empty: number }>;
}

export function EnhancedExcelImport({
  open,
  onOpenChange,
  session,
  onImport,
  onDownloadTemplate,
}: EnhancedExcelImportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ 
    success: boolean; 
    message: string;
    imported_count?: number;
    errors?: Array<{ row: number; message: string; student?: string }>;
  } | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'result'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

      const files = Array.from(e.dataTransfer.files);
      const excelFile = files.find(
        (file) =>
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel' ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.xls')
      );

      if (excelFile) {
        setSelectedFile(excelFile);
        await processFilePreview(excelFile);
      } else {
        setUploadResult({
          success: false,
          message: 'Lütfen geçerli bir Excel dosyası yükleyin (.xlsx veya .xls)',
        });
      }
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      await processFilePreview(file);
    }
    e.target.value = '';
  };

  const processFilePreview = async (file: File) => {
    try {
      // Simulate preview parsing (in real implementation, parse Excel here)
      setActiveTab('preview');
      // Mock preview data
      setPreviewData([
        {
          studentId: '12345',
          studentName: 'Örnek Öğrenci 1',
          subjects: {
            'Matematik': { correct: 10, wrong: 5, empty: 5 },
            'Türkçe': { correct: 15, wrong: 3, empty: 2 },
          },
        },
      ]);
    } catch (error) {
      console.error('Preview error:', error);
      setUploadResult({
        success: false,
        message: 'Dosya önizlemesi oluşturulamadı',
      });
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);
    setUploadProgress(0);
    setActiveTab('result');

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const result = await onImport(session.id, selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);

      if (result.success) {
        setTimeout(() => {
          onOpenChange(false);
          resetState();
        }, 3000);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadResult({
        success: false,
        message: 'Dosya yüklenirken bir hata oluştu',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setUploadResult(null);
    setUploadProgress(0);
    setPreviewData([]);
    setSelectedFile(null);
    setActiveTab('upload');
  };

  const handleDownloadTemplate = () => {
    onDownloadTemplate(session.exam_type_id);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetState();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Excel ile Toplu Giriş - Gelişmiş
          </DialogTitle>
          <DialogDescription>
            {session.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              Yükle
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedFile || isUploading}>
              <FileCheck className="h-4 w-4 mr-2" />
              Önizleme
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!uploadResult}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Sonuç
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 overflow-auto space-y-4">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs space-y-2">
                <p className="font-medium text-foreground">3 Basit Adımda İçe Aktarın:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Aşağıdaki "Şablon İndir" butonuna tıklayıp Excel şablonunu indirin</li>
                  <li>Şablonu açın ve öğrenci bilgilerini ve sonuçları girin</li>
                  <li>Dosyayı buraya sürükleyip bırakın veya "Dosya Seç" butonuna tıklayın</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Download className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div>Şablon İndir</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    Öğrenci bilgileriyle hazır
                  </div>
                </div>
              </Button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-all
                ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border'}
                ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50 hover:bg-accent/5'}
              `}
            >
              <input
                type="file"
                id="excel-upload-enhanced"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label
                htmlFor="excel-upload-enhanced"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Dosyayı sürükleyip bırakın veya seçin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Excel dosyaları (.xlsx, .xls) kabul edilir
                  </p>
                  {selectedFile && (
                    <Badge variant="secondary" className="mt-2">
                      {selectedFile.name}
                    </Badge>
                  )}
                </div>
              </label>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-auto space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Dosya içeriğini kontrol edin. Doğruysa "Onayla ve Yükle" butonuna tıklayın.
              </AlertDescription>
            </Alert>

            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{previewData.length} öğrenci</Badge>
              </div>
            )}

            {previewData.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Öğrenci No</TableHead>
                      <TableHead>Öğrenci Adı</TableHead>
                      <TableHead>Ders Sayısı</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((student, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">{student.studentId}</TableCell>
                        <TableCell className="font-medium">{student.studentName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {Object.keys(student.subjects).length} ders
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Hazır
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewData([]);
                  setActiveTab('upload');
                }}
                variant="outline"
                className="flex-1"
              >
                Geri
              </Button>
              <Button
                onClick={handleConfirmUpload}
                className="flex-1"
                disabled={isUploading}
              >
                Onayla ve Yükle
              </Button>
            </div>
          </TabsContent>

          {/* Result Tab */}
          <TabsContent value="result" className="flex-1 overflow-auto space-y-4">
            {isUploading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <div className="w-full max-w-md space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-center text-sm font-medium text-primary">
                    Yükleniyor... {uploadProgress}%
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    Lütfen bekleyin, sonuçlar işleniyor...
                  </p>
                </div>
              </div>
            )}

            {uploadResult && !isUploading && (
              <div className="space-y-4">
                <Alert 
                  variant={uploadResult.success ? 'default' : 'destructive'} 
                  className={`border-l-4 ${uploadResult.success ? 'bg-green-50 border-green-500' : ''}`}
                >
                  {uploadResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{uploadResult.message}</p>
                      {uploadResult.imported_count !== undefined && (
                        <p className="text-sm mt-1">
                          {uploadResult.imported_count} sonuç başarıyla kaydedildi
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <h4 className="font-medium text-sm">
                        Hatalar ({uploadResult.errors.length})
                      </h4>
                    </div>
                    <div className="border rounded-lg max-h-60 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-20">Satır</TableHead>
                            <TableHead>Öğrenci</TableHead>
                            <TableHead>Hata</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadResult.errors.map((error, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono text-xs">{error.row}</TableCell>
                              <TableCell className="text-sm">{error.student || '-'}</TableCell>
                              <TableCell className="text-sm text-destructive">
                                {error.message}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      resetState();
                      onOpenChange(false);
                    }}
                    className="flex-1"
                  >
                    Kapat
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
