
import { useEffect } from "react";
import type { Student } from "@/lib/types/student.types";
import { upsertStudent } from "@/lib/api/students.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Bus, DollarSign, Award, AlertTriangle } from "lucide-react";
import { EnhancedTextarea } from "@/components/ui/enhanced-textarea";

const additionalInfoSchema = z.object({
  servisKullanimDurumu: z.string().optional(),
  servisFirma: z.string().optional(),
  bursYardimDurumu: z.string().optional(),
  bursKurumu: z.string().optional(),
  bursYiliMiktari: z.string().optional(),
  disiplinCezalari: z.string().optional(),
  odulBasarilar: z.string().optional(),
});

type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>;

interface AdditionalInfoSectionProps {
  student: Student;
  onUpdate: () => void;
}

export default function AdditionalInfoSection({ student, onUpdate }: AdditionalInfoSectionProps) {
  const form = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      servisKullanimDurumu: (student as any).servisKullanimDurumu || "",
      servisFirma: (student as any).servisFirma || "",
      bursYardimDurumu: (student as any).bursYardimDurumu || "",
      bursKurumu: (student as any).bursKurumu || "",
      bursYiliMiktari: (student as any).bursYiliMiktari || "",
      disiplinCezalari: (student as any).disiplinCezalari || "",
      odulBasarilar: (student as any).odulBasarilar || "",
    },
  });

  useEffect(() => {
    form.reset({
      servisKullanimDurumu: (student as any).servisKullanimDurumu || "",
      servisFirma: (student as any).servisFirma || "",
      bursYardimDurumu: (student as any).bursYardimDurumu || "",
      bursKurumu: (student as any).bursKurumu || "",
      bursYiliMiktari: (student as any).bursYiliMiktari || "",
      disiplinCezalari: (student as any).disiplinCezalari || "",
      odulBasarilar: (student as any).odulBasarilar || "",
    });
  }, [student, form]);

  const onSubmit = async (data: AdditionalInfoFormValues) => {
    try {
      const updatedStudent: Student = {
        ...student,
        ...data,
      };
      
      await upsertStudent(updatedStudent);
      toast.success("Ek bilgiler kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving additional info:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Ulaşım Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bus className="h-5 w-5 text-primary" />
              Ulaşım Bilgileri
            </CardTitle>
            <CardDescription>
              Okul servisi ve ulaşım detayları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="servisKullanimDurumu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servis Kullanım Durumu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kullanıyor">Kullanıyor</SelectItem>
                        <SelectItem value="Kullanmıyor">Kullanmıyor</SelectItem>
                        <SelectItem value="Zaman Zaman">Zaman Zaman</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servisFirma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Bus className="h-3.5 w-3.5" />
                      Servis Firma/Plaka
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Firma adı veya plaka" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Finansal Destek */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              Burs ve Finansal Destek
            </CardTitle>
            <CardDescription>
              Alınan burs, yardım ve destekler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="bursYardimDurumu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Burs/Yardım Durumu</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yok">Almıyor</SelectItem>
                      <SelectItem value="Devlet Bursu">Devlet Bursu</SelectItem>
                      <SelectItem value="Özel Burs">Özel Kuruluş Bursu</SelectItem>
                      <SelectItem value="Okul Bursu">Okul Bursu</SelectItem>
                      <SelectItem value="Sosyal Yardım">Sosyal Yardım</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bursKurumu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      Burs Veren Kurum
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Kurum adı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bursYiliMiktari"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yıllık Miktar</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: Tam burs, 50% indirim" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Disiplin ve Başarılar */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-primary" />
              Disiplin Geçmişi ve Başarılar
            </CardTitle>
            <CardDescription>
              Aldığı cezalar, ödüller ve başarılar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="disiplinCezalari"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Disiplin Cezaları
                  </FormLabel>
                  <FormControl>
                    <EnhancedTextarea 
                      {...field} 
                      className="min-h-[100px]" 
                      placeholder="Tarih, ceza türü ve açıklama..."
                      aiContext="notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="odulBasarilar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    Ödüller ve Başarılar
                  </FormLabel>
                  <FormControl>
                    <EnhancedTextarea 
                      {...field} 
                      className="min-h-[100px]" 
                      placeholder="Aldığı ödüller, başarılar, yarışma dereceleri..."
                      aiContext="notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="min-w-[200px]">
            Kaydet
          </Button>
        </div>
      </form>
    </Form>
  );
}
