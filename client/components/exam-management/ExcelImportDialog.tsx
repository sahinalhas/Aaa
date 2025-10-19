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
import { 
  Upload, 
  FileSpreadsheet, 
  Loader2, 
  CheckCircle2, 
  Download,
  Info,
  AlertCircle,
} from 'lucide-react';
import type { ExamSession } from '../../../shared/types/exam-management.types';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: ExamSession;
  onImport: (sessionId: string, file: File) => Promise<{ success: boolean; message: string }>;
  onDownloadTemplate: (examTypeId: string) => void;
}

export function ExcelImportDialog({
  open,
  onOpenChange,
  session,
  onImport,
  onDownloadTemplate,
}: ExcelImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

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
        await handleFileUpload(excelFile);
      } else {
        setUploadResult({
          success: false,
          message: 'Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin',
        });
      }
    },
    [session.id]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const result = await onImport(session.id, file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      
      if (result.success) {
        setTimeout(() => {
          onOpenChange(false);
          setUploadResult(null);
          setUploadProgress(0);
        }, 2000);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excel ile Toplu Sonuç Yükleme
          </DialogTitle>
          <DialogDescription>
            {session.name} - Excel dosyası ile toplu sonuç girişi yapın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm space-y-2">
              <p className="font-medium">Excel ile toplu giriş nasıl yapılır?</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Aşağıdaki "Şablon İndir" butonuna tıklayın</li>
                <li>İndirilen Excel dosyasını açın</li>
                <li>Öğrenci bilgilerini ve sınav sonuçlarını doldurun</li>
                <li>Dosyayı kaydedin ve buraya yükleyin</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all
              ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25'}
              ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-primary/50 hover:bg-accent/5'}
            `}
          >
            <input
              type="file"
              id="excel-upload"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <label
              htmlFor="excel-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <div className="w-full max-w-xs space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm font-medium text-primary">
                      Yükleniyor... {uploadProgress}%
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                    <Upload className="h-5 w-5 text-primary absolute -bottom-1 -right-1" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Excel dosyasını sürükleyip bırakın veya tıklayın
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Desteklenen formatlar: .xlsx, .xls (Maksimum 10MB)
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>

          {uploadResult && (
            <Alert variant={uploadResult.success ? 'default' : 'destructive'}>
              {uploadResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className="flex items-center gap-2">
                {uploadResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onDownloadTemplate(session.exam_type_id)}
              disabled={isUploading}
            >
              <Download className="mr-2 h-4 w-4" />
              Şablon İndir
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Kapat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
