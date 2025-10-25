import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Star, 
  MessageSquare, 
  Activity, 
  Brain, 
  Target, 
  ArrowRight, 
  FileText, 
  ClipboardCheck, 
  CheckCircle2, 
  Sparkles,
  Calendar as CalendarIcon,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedTextarea as Textarea } from "@/components/ui/enhanced-textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { completeSessionSchema, type CompleteSessionFormValues, type CounselingSession } from "../types";
import ActionItemsManager from "./ActionItemsManager";
import { cn } from "@/lib/utils";

interface EnhancedCompleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CounselingSession | null;
  onSubmit: (data: CompleteSessionFormValues) => void;
  isPending: boolean;
}

export default function EnhancedCompleteSessionDialog({
  open,
  onOpenChange,
  session,
  onSubmit,
  isPending,
}: EnhancedCompleteSessionDialogProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const form = useForm<CompleteSessionFormValues>({
    resolver: zodResolver(completeSessionSchema),
    mode: "onBlur",
    defaultValues: {
      exitTime: new Date().toTimeString().slice(0, 5),
      detailedNotes: "",
      actionItems: [],
      followUpNeeded: false,
      cooperationLevel: 3,
      emotionalState: "sakin",
      physicalState: "normal",
      communicationQuality: "açık",
      followUpDate: undefined,
      followUpTime: undefined,
    },
  });

  const followUpNeeded = form.watch("followUpNeeded");
  
  useEffect(() => {
    if (followUpNeeded && !form.getValues("followUpDate")) {
      setDatePickerOpen(true);
    }
  }, [followUpNeeded]);

  const handleSubmit = (data: CompleteSessionFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const getCurrentStepLabel = () => {
    switch(activeTab) {
      case "summary": return "Adım 1/3";
      case "assessment": return "Adım 2/3";
      case "actions": return "Adım 3/3";
      default: return "";
    }
  };

  const getSubmitButtonText = () => {
    if (followUpNeeded) {
      return "Görüşmeyi Kaydet ve Takip Planla";
    }
    return "Görüşmeyi Kaydet";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-40" />
                  <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <DialogTitle className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Görüşmeyi Tamamla
                  </DialogTitle>
                  <DialogDescription className="mt-1">
                    Görüşme detaylarını kaydedin ve takip planı oluşturun
                  </DialogDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-sm font-semibold">
                {getCurrentStepLabel()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1 bg-muted/50 gap-1">
                  <TabsTrigger 
                    value="summary" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 min-h-[44px]"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Özet</span>
                    <span className="sm:hidden">1. Özet</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="assessment"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white py-3 min-h-[44px]"
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Değerlendirme</span>
                    <span className="sm:hidden">2. Değerlendirme</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="actions"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white py-3 min-h-[44px]"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Takip & Aksiyon</span>
                    <span className="sm:hidden">3. Takip</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-5 mt-6">
                  <div className="relative pb-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-30" />
                        <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Görüşme Özeti
                      </h3>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="exitTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-blue-700 dark:text-blue-400">
                          Çıkış Saati <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="h-12 border-2 focus:border-blue-400" />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Görüşmenin bittiği saat
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sessionFlow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-purple-700 dark:text-purple-400">
                          Görüşme Seyri <span className="text-muted-foreground text-sm font-normal">(İsteğe Bağlı)</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                              <SelectValue placeholder="Görüşme nasıl geçti?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="çok_olumlu">✅ Çok Olumlu</SelectItem>
                            <SelectItem value="olumlu">😊 Olumlu</SelectItem>
                            <SelectItem value="nötr">😐 Nötr</SelectItem>
                            <SelectItem value="sorunlu">😟 Sorunlu</SelectItem>
                            <SelectItem value="kriz">🚨 Kriz</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Görüşmenin genel atmosferi ve sonucu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailedNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Görüşme Notları <span className="text-muted-foreground text-sm font-normal">(İsteğe Bağlı)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Görüşmede neler konuşuldu, hangi kararlar alındı, ulaşılan sonuçlar neler oldu..."
                            rows={8}
                            className="border-2 focus:border-blue-400 resize-none"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Görüşmenin detaylı özeti, konuşulan konular ve alınan kararlar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="assessment" className="space-y-5 mt-6">
                  <div className="relative pb-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-sm opacity-30" />
                        <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                          <ClipboardCheck className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Görüşme Değerlendirmesi
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-semibold">Tüm alanlar isteğe bağlı</p>
                      <p className="text-xs mt-1">AI zaten akıllı varsayılanlar seçti. Sadece değiştirmek istediğiniz alanları düzenleyin.</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="studentParticipationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Öğrenci Katılım Düzeyi <span className="text-muted-foreground text-sm font-normal">(İsteğe Bağlı)</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                              <SelectValue placeholder="Katılım düzeyini seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="çok_aktif">Çok Aktif</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="pasif">Pasif</SelectItem>
                            <SelectItem value="dirençli">Dirençli</SelectItem>
                            <SelectItem value="kapalı">Kapalı</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Öğrencinin görüşmeye katılım seviyesi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cooperationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          İşbirliği Düzeyi: {field.value}/5
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[field.value || 3]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-muted-foreground">
                          Öğrencinin işbirliğine açıklık seviyesi (1: Çok düşük, 5: Çok yüksek)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotionalState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Duygu Durumu
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sakin">😌 Sakin</SelectItem>
                            <SelectItem value="kaygılı">😰 Kaygılı</SelectItem>
                            <SelectItem value="üzgün">😢 Üzgün</SelectItem>
                            <SelectItem value="sinirli">😠 Sinirli</SelectItem>
                            <SelectItem value="mutlu">😊 Mutlu</SelectItem>
                            <SelectItem value="karışık">😕 Karışık</SelectItem>
                            <SelectItem value="diğer">🤔 Diğer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Öğrencinin görüşme sırasındaki genel duygu durumu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="physicalState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Fiziksel Durum</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-teal-400">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="yorgun">Yorgun</SelectItem>
                            <SelectItem value="huzursuz">Huzursuz</SelectItem>
                            <SelectItem value="ajite">Ajite</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Öğrencinin fiziksel gözlemleri
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="communicationQuality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">İletişim Kalitesi</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-emerald-400">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="açık">Açık</SelectItem>
                            <SelectItem value="ketum">Ketum</SelectItem>
                            <SelectItem value="seçici">Seçici</SelectItem>
                            <SelectItem value="kapalı">Kapalı</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-muted-foreground">
                          Öğrencinin iletişime açıklık seviyesi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="actions" className="space-y-5 mt-6">
                  <div className="relative pb-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl blur-sm opacity-30" />
                        <div className="relative p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        Takip & Aksiyon Planı
                      </h3>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="followUpNeeded"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">Takip Görüşmesi Planla</FormLabel>
                          <FormDescription className="text-sm">
                            Takip gerekiyorsa açın, otomatik randevu oluşturulacak
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {followUpNeeded && (
                    <div className="space-y-4 rounded-xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 p-4">
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-semibold">
                        <CalendarIcon className="h-5 w-5" />
                        <span>Takip Randevusu</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="followUpDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>
                                Takip Tarihi <span className="text-red-500">*</span>
                              </FormLabel>
                              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "justify-start text-left font-normal h-11 min-h-[44px]",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "d MMMM yyyy, EEEE", { locale: tr })
                                      ) : (
                                        <span>Tarih seçin</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      if (date) {
                                        field.onChange(date);
                                        setDatePickerOpen(false);
                                      }
                                    }}
                                    disabled={(date) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="followUpTime"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>
                                Takip Saati <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field} 
                                  className="h-11 min-h-[44px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="followUpPlan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Takip Planı <span className="text-muted-foreground text-sm font-normal">(İsteğe Bağlı)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Takip görüşmesinde neler yapılacak, hangi konular konuşulacak..."
                                rows={3}
                                className="border-2 focus:border-orange-400 resize-none"
                              />
                            </FormControl>
                            <FormDescription className="text-sm">
                              Bu plan, takip randevusu oluştururken not olarak eklenecek
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="actionItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Eylem Maddeleri <span className="text-muted-foreground text-sm font-normal">(İsteğe Bağlı)</span>
                        </FormLabel>
                        <FormControl>
                          <ActionItemsManager
                            items={(field.value || []).filter(item => item.id && item.description) as any}
                            onItemsChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription className="text-sm">
                          Yapılacak işleri ve sorumlularını belirleyin
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        <Separator />
        
        <DialogFooter className="gap-2 sm:gap-0 pt-4 sticky bottom-0 bg-background">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-2 min-h-[44px]"
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            onClick={form.handleSubmit(handleSubmit)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold min-w-[200px] min-h-[44px]"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getSubmitButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
