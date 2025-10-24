replit_final_file>
/**
 * Unified Identity Section
 * Temel kimlik bilgileri, veli iletişim, adres bilgileri
 * NOT: Acil iletişim bilgileri Health Section'a taşındı
 * NOT: Risk bilgisi manuel değil, otomatik hesaplanıyor
 */

import { useEffect } from "react";
import type { Student } from "@/lib/types/student.types";
import { upsertStudent } from "@/lib/api/students.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  Hash,
  UserCheck,
  Tag,
  Home,
  Map,
  Briefcase,
  BookOpen,
  Star,
  Heart,
  Flame,
  Wrench,
  Award,
  GitCommit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const unifiedIdentitySchema = z.object({
  ad: z.string().min(1, "Ad zorunludur"),
  soyad: z.string().min(1, "Soyad zorunludur"),
  okulNo: z.string().optional(),
  class: z.string().optional(),
  cinsiyet: z.enum(["K", "E"]).optional(),
  dogumTarihi: z.string().optional(),
  dogumYeri: z.string().optional(),
  tcKimlikNo: z.string().optional().transform(val => val === "" ? undefined : val),
  telefon: z.string().optional(),
  eposta: z.string().email("Geçerli bir e-posta giriniz").optional().or(z.literal("")),
  il: z.string().optional(),
  ilce: z.string().optional(),
  adres: z.string().optional(),
  veliAdi: z.string().optional(),
  veliTelefon: z.string().optional(),
  rehberOgretmen: z.string().optional(),
  etiketler: z.string().optional(),
  anneMeslek: z.string().optional(),
  babaMeslek: z.string().optional(),
  kardesSayisi: z.number().optional().or(z.literal("")),
  dilBecerileri: z.string().optional(),
  hobiler: z.string().optional(),
  okulDisiAktiviteler: z.string().optional(),
  beklentilerHedefler: z.string().optional(),
});

type UnifiedIdentityFormValues = z.infer<typeof unifiedIdentitySchema>;

interface UnifiedIdentitySectionProps {
  student: Student;
  onUpdate: () => void;
}

export default function UnifiedIdentitySection({ student, onUpdate }: UnifiedIdentitySectionProps) {
  const form = useForm<UnifiedIdentityFormValues>({
    resolver: zodResolver(unifiedIdentitySchema),
    defaultValues: {
      ad: student.ad || "",
      soyad: student.soyad || "",
      okulNo: student.okulNo || "",
      class: student.class || "",
      cinsiyet: student.cinsiyet,
      dogumTarihi: student.dogumTarihi || "",
      dogumYeri: student.dogumYeri || "",
      tcKimlikNo: student.tcKimlikNo,
      telefon: student.telefon || "",
      eposta: student.eposta || "",
      il: student.il || "",
      ilce: student.ilce || "",
      adres: student.adres || "",
      veliAdi: student.veliAdi || "",
      veliTelefon: student.veliTelefon || "",
      rehberOgretmen: student.rehberOgretmen || "",
      etiketler: (student.etiketler || []).join(", "),
      anneMeslek: student.anneMeslek || "",
      babaMeslek: student.babaMeslek || "",
      kardesSayisi: student.kardesSayisi || "",
      dilBecerileri: student.dilBecerileri || "",
      hobiler: student.hobiler || "",
      okulDisiAktiviteler: student.okulDisiAktiviteler || "",
      beklentilerHedefler: student.beklentilerHedefler || "",
    },
  });

  useEffect(() => {
    form.reset({
      ad: student.ad || "",
      soyad: student.soyad || "",
      okulNo: student.okulNo || "",
      class: student.class || "",
      cinsiyet: student.cinsiyet,
      dogumTarihi: student.dogumTarihi || "",
      dogumYeri: student.dogumYeri || "",
      tcKimlikNo: student.tcKimlikNo,
      telefon: student.telefon || "",
      eposta: student.eposta || "",
      il: student.il || "",
      ilce: student.ilce || "",
      adres: student.adres || "",
      veliAdi: student.veliAdi || "",
      veliTelefon: student.veliTelefon || "",
      rehberOgretmen: student.rehberOgretmen || "",
      etiketler: (student.etiketler || []).join(", "),
      anneMeslek: student.anneMeslek || "",
      babaMeslek: student.babaMeslek || "",
      kardesSayisi: student.kardesSayisi || "",
      dilBecerileri: student.dilBecerileri || "",
      hobiler: student.hobiler || "",
      okulDisiAktiviteler: student.okulDisiAktiviteler || "",
      beklentilerHedefler: student.beklentilerHedefler || "",
    });
  }, [student, form]);

  const onSubmit = async (data: UnifiedIdentityFormValues) => {
    try {
      const updatedStudent: Student = {
        ...student,
        ...data,
        etiketler: data.etiketler
          ? data.etiketler.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        kardesSayisi: data.kardesSayisi === "" ? undefined : Number(data.kardesSayisi),
      };

      await upsertStudent(updatedStudent);
      toast.success("Öğrenci bilgileri kaydedildi");
      onUpdate();
    } catch (error) {
      toast.error("Kayıt sırasında hata oluştu");
      console.error("Error saving student:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Temel Kimlik Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Temel Kimlik Bilgileri
            </CardTitle>
            <CardDescription>
              Öğrencinin temel tanımlayıcı bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Ad *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Öğrenci adı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soyad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Soyad *
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Öğrenci soyadı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="okulNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" />
                      Okul Numarası
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: 1001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Sınıf
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: 9/A" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cinsiyet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cinsiyet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="K">Kız</SelectItem>
                        <SelectItem value="E">Erkek</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dogumTarihi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Doğum Tarihi
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dogumYeri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Doğum Yeri
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="İl/İlçe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tcKimlikNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" />
                      TC Kimlik No
                      <Badge variant="outline" className="text-xs">Gizli</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="●●●●●●●●●●●"
                        maxLength={11}
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* İletişim Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              İletişim Bilgileri
            </CardTitle>
            <CardDescription>
              Öğrenciye ulaşmak için gerekli bilgiler
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Telefon
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" className="h-10" placeholder="+90 5XX XXX XX XX" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eposta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      E-posta
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" className="h-10" placeholder="ornek@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Adres Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Adres Bilgileri
            </CardTitle>
            <CardDescription>
              Ev adresi ve konum bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="il"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      İl
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: İstanbul" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ilce"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5" />
                      İlçe
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: Kadıköy" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açık Adres</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" placeholder="Mahalle, sokak, bina no, daire..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Aile Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Aile Bilgileri
            </CardTitle>
            <CardDescription>
              Öğrencinin aile yapısı ve meslek bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="anneMeslek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Anne Meslek
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Anne mesleği" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="babaMeslek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" />
                      Baba Meslek
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Baba mesleği" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="kardesSayisi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Kardeş Sayısı
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="h-10" placeholder="Örn: 2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Akademik ve Sosyal Profil */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Akademik ve Sosyal Profil
            </CardTitle>
            <CardDescription>
              Öğrencinin dil becerileri, hobileri ve okul dışı aktiviteleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dilBecerileri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      Dil Becerileri
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: İngilizce (İleri), Almanca (Orta)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hobiler"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5" />
                      Hobiler ve İlgi Alanları
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Örn: Kitap okumak, yüzme, satranç" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="okulDisiAktiviteler"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5" />
                    Okul Dışı Aktiviteler
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" placeholder="Örn: Robotik kulübü, gönüllülük faaliyetleri" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Hedefler ve Beklentiler */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GitCommit className="h-5 w-5 text-primary" />
              Hedefler ve Beklentiler
            </CardTitle>
            <CardDescription>
              Öğrencinin ve ailenin eğitimden beklentileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="beklentilerHedefler"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Beklentiler ve Hedefler
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" placeholder="Örn: Üniversite kazanmak, yurtdışı eğitimi almak" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Veli Bilgileri (Mevcut) */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Veli Bilgileri
            </CardTitle>
            <CardDescription>
              Birincil veli iletişim bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="veliAdi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Veli Adı Soyadı
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-10" placeholder="Anne/baba adı soyadı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="veliTelefon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Veli Telefon
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" className="h-10" placeholder="+90 5XX XXX XX XX" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sistem Bilgileri */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Sistem Bilgileri
            </CardTitle>
            <CardDescription>
              Rehberlik ve etiketleme bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="rehberOgretmen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    Rehber Öğretmen
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" placeholder="Sorumlu rehber öğretmen" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="etiketler"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Etiketler
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10" placeholder="Virgülle ayırarak etiket ekleyin (örn: takdir, lider, spor)" />
                  </FormControl>
                  <FormDescription>
                    Virgülle ayırarak birden fazla etiket ekleyebilirsiniz
                  </FormDescription>
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
</replit_final_file>