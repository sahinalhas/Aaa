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
import { Upload, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react';
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
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await onImport(session.id, file);
      setUploadResult(result);
      
      if (result.success) {
        setTimeout(() => {
          onOpenChange(false);
          setUploadResult(null);
        }, 2000);
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Toplu Sonuç Yükleme - {session.name}</DialogTitle>
          <DialogDescription>
            Excel dosyası ile toplu sonuç girişi yapın
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              cursor-pointer
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
              onClick={() => onDownloadTemplate(session.exam_type_id)}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Şablon İndir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
