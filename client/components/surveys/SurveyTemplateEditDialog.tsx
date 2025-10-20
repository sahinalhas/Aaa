import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnhancedTextarea as Textarea } from "@/components/ui/enhanced-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SurveyTemplate } from "@/lib/survey-types";
import { surveyService } from "@/services/surveyService";
import { useToast } from "@/hooks/use-toast";

const editSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  description: z.string().optional(),
  type: z.enum(["MEB_STANDAR", "OZEL", "AKADEMIK", "SOSYAL", "REHBERLIK"]),
  estimatedDuration: z.number().min(1, "Tahmini süre en az 1 dakika olmalıdır"),
  targetGrades: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  mebCompliant: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type EditForm = z.infer<typeof editSchema>;

interface SurveyTemplateEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: SurveyTemplate;
  onEditComplete?: () => void;
}

const GRADE_OPTIONS = [
  "1. Sınıf", "2. Sınıf", "3. Sınıf", "4. Sınıf",
  "5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf"
];

export default function SurveyTemplateEditDialog({
  open,
  onOpenChange,
  template,
  onEditComplete
}: SurveyTemplateEditDialogProps) {
  const { toast } = useToast();

  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: template.title,
      description: template.description || "",
      type: template.type,
      estimatedDuration: template.estimatedDuration,
      targetGrades: template.targetGrades || [],
      tags: template.tags || [],
      mebCompliant: template.mebCompliant || false,
      isActive: template.isActive,
    },
  });

  useEffect(() => {
    if (open && template) {
      form.reset({
        title: template.title,
        description: template.description || "",
        type: template.type,
        estimatedDuration: template.estimatedDuration,
        targetGrades: template.targetGrades || [],
        tags: template.tags || [],
        mebCompliant: template.mebCompliant || false,
        isActive: template.isActive,
      });
    }
  }, [open, template, form]);

  const onSubmit = async (data: EditForm) => {
    try {
      await surveyService.updateTemplate(template.id, data);

      toast({
        title: "Başarılı",
        description: "Anket şablonu güncellendi"
      });

      onOpenChange(false);
      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Hata",
        description: "Anket şablonu güncellenemedi",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Anket Şablonunu Düzenle</DialogTitle>
          <DialogDescription>
            Anket şablonunun temel bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anket Başlığı</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Örn: Öğrenci Memnuniyet Anketi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Anket açıklaması..." rows={3} />
                  </FormControl>
                  <FormDescription>
                    Anketin amacını ve kapsamını açıklayın
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anket Türü</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tür seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEB_STANDAR">MEB Standart</SelectItem>
                        <SelectItem value="OZEL">Özel</SelectItem>
                        <SelectItem value="AKADEMIK">Akademik</SelectItem>
                        <SelectItem value="SOSYAL">Sosyal</SelectItem>
                        <SelectItem value="REHBERLIK">Rehberlik</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahmini Süre (dakika)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="15"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="targetGrades"
              render={() => (
                <FormItem>
                  <FormLabel>Hedef Sınıflar</FormLabel>
                  <FormDescription>
                    Anketin uygulanacağı sınıfları seçin
                  </FormDescription>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {GRADE_OPTIONS.map((grade) => (
                      <FormField
                        key={grade}
                        control={form.control}
                        name="targetGrades"
                        render={({ field }) => (
                          <FormItem
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(grade)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, grade]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== grade)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {grade}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mebCompliant"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">MEB Uyumlu</FormLabel>
                      <FormDescription>
                        MEB standartlarına uygun anket
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Aktif</FormLabel>
                      <FormDescription>
                        Şablon kullanıma açık
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
