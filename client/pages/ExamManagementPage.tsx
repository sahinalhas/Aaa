import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  FileSpreadsheet, 
  BarChart3, 
  Plus,
  GraduationCap 
} from 'lucide-react';
import { useExamTypes } from '@/hooks/useExamManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExamManagementPage() {
  const [selectedExamType, setSelectedExamType] = useState<string>('tyt');
  const [activeTab, setActiveTab] = useState<string>('sessions');
  
  const { data: examTypes, isLoading: typesLoading, error: typesError } = useExamTypes();

  if (typesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (typesError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Sınav türleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Ölçme Değerlendirme
        </h1>
        <p className="text-muted-foreground mt-2">
          Deneme sınavları, okul notları ve değerlendirme sonuçlarını yönetin
        </p>
      </div>

      <Tabs value={selectedExamType} onValueChange={setSelectedExamType}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          {examTypes?.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {examTypes?.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {type.name} - {type.description}
                </CardTitle>
                <CardDescription>
                  {type.name} sınavları için sonuç girişi, istatistikler ve raporlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="sessions" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Deneme Sınavları
                    </TabsTrigger>
                    <TabsTrigger value="entry" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Sonuç Girişi
                    </TabsTrigger>
                    <TabsTrigger value="excel" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Toplu İşlemler
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      İstatistikler
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sessions" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Deneme Sınavları Listesi</p>
                      <p className="text-sm">Bu bölüm yakında aktif olacak</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="entry" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Sonuç Giriş Formu</p>
                      <p className="text-sm">Bu bölüm yakında aktif olacak</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="excel" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Excel İçe/Dışa Aktarma</p>
                      <p className="text-sm">Bu bölüm yakında aktif olacak</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">İstatistikler ve Grafikler</p>
                      <p className="text-sm">Bu bölüm yakında aktif olacak</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Okul Sınavları</CardTitle>
          <CardDescription>
            Dönem sonu, yazılı ve diğer okul sınav notlarını yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Bu bölüm yakında aktif olacak</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
