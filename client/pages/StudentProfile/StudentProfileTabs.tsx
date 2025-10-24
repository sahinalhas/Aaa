/**
 * Student Profile Tabs - Modern 2025 Design
 * 8 Ana Sekme Yapısı - Bilgi Tekrarı YOK
 * Glassmorphism & Smooth Transitions
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAIN_TABS, KIMLIK_TABS, SAGLIK_TABS, TAB_COLORS } from "./constants";
import { StudentData } from "@/hooks/student-profile";
import { Student } from "@/lib/storage";

// Yeni Modern Component'ler
import UnifiedIdentitySection from "@/components/student-profile/sections/UnifiedIdentitySection";
import EnhancedHealthSection from "@/components/student-profile/sections/EnhancedHealthSection";
import SmartAcademicDashboard from "@/components/student-profile/sections/SmartAcademicDashboard";
import DevelopmentProfileSection from "@/components/student-profile/sections/DevelopmentProfileSection";
import EnhancedRiskDashboard from "@/components/student-profile/sections/EnhancedRiskDashboard";
import CareerFutureSection from "@/components/student-profile/sections/CareerFutureSection";
import CommunicationCenter from "@/components/student-profile/sections/CommunicationCenter";
import AIToolsHub from "@/components/student-profile/sections/AIToolsHub";

// Dashboard
import { ModernDashboard } from "./components/ModernDashboard";

// Eski component'ler (geçici - sonra kaldırılacak)
import OzelEgitimSection from "@/components/student-profile/sections/OzelEgitimSection";

interface StudentProfileTabsProps {
  student: Student;
  studentId: string;
  data: StudentData;
  onUpdate: () => void;
  scoresData?: any;
  loadingScores?: boolean;
}

export function StudentProfileTabs({
  student,
  studentId,
  data,
  onUpdate,
  scoresData,
  loadingScores,
}: StudentProfileTabsProps) {
  const studentName = `${student.ad} ${student.soyad}`;

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      {/* Main Navigation - 8 Ana Sekme */}
      <TabsList className="flex flex-wrap gap-2 md:gap-3 h-auto w-full justify-start min-h-[3rem] p-3 bg-gradient-to-br from-muted/60 via-muted/40 to-background/80 rounded-2xl border-2 border-primary/15 shadow-xl backdrop-blur-md">
        {MAIN_TABS.map(({ value, label, icon: Icon, description }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            title={description}
            className="flex items-center gap-2.5 shrink-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:via-primary/95 data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 px-5 py-3.5 font-semibold rounded-xl border-2 border-transparent data-[state=active]:border-primary/30 hover:bg-primary/5"
          >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">{label}</span>
            <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* 1. DASHBOARD - Özet Görünüm */}
      <TabsContent value="dashboard" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        <ModernDashboard 
          student={student}
          studentId={studentId}
          scoresData={scoresData}
          loadingScores={loadingScores}
        />
      </TabsContent>

      {/* 2. KİMLİK & İLETİŞİM - Temel Bilgiler */}
      <TabsContent value="kimlik" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.kimlik.border} ${TAB_COLORS.kimlik.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <UnifiedIdentitySection
            student={student}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 3. SAĞLIK & GÜVENLİK - Sağlık Profili + Acil İletişim */}
      <TabsContent value="saglik" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className="space-y-6">
          <div className={`rounded-2xl border-2 ${TAB_COLORS.saglik.border} ${TAB_COLORS.saglik.bg} p-6 shadow-lg backdrop-blur-sm`}>
            <EnhancedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </div>
          
          {/* Özel Eğitim Gereksinimi Varsa */}
          <OzelEgitimSection
            studentId={studentId}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 4. AKADEMİK - Performans, Sınavlar, Çalışma */}
      <TabsContent value="akademik" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.akademik.border} ${TAB_COLORS.akademik.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <SmartAcademicDashboard
            studentId={studentId}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 5. GELİŞİM & KİŞİLİK - Sosyal-Duygusal, Zeka, Yetenekler */}
      <TabsContent value="gelisim" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.gelisim.border} ${TAB_COLORS.gelisim.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <DevelopmentProfileSection
            studentId={studentId}
            multipleIntelligence={data.multipleIntelligence}
            evaluations360={data.evaluations360}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 6. RİSK & MÜDAHALE - Otomatik Risk Analizi */}
      <TabsContent value="risk" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.risk.border} ${TAB_COLORS.risk.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <EnhancedRiskDashboard
            studentId={studentId}
            student={student}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 7. KARİYER & GELECEK - Kariyer Analizi, Hedefler */}
      <TabsContent value="kariyer" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.kariyer.border} ${TAB_COLORS.kariyer.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <CareerFutureSection
            studentId={studentId}
            studentName={studentName}
            academicGoals={data.academicGoals}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 8. İLETİŞİM MERKEZİ - Tüm Görüşmeler Tek Yerde */}
      <TabsContent value="iletisim" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.iletisim.border} ${TAB_COLORS.iletisim.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <CommunicationCenter
            studentId={studentId}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      {/* 9. AI ARAÇLARI - AI Hub */}
      <TabsContent value="ai-hub" className="mt-8 min-h-[400px] animate-in fade-in-50 slide-in-from-right-10 duration-500">
        <div className={`rounded-2xl border-2 ${TAB_COLORS.ai.border} ${TAB_COLORS.ai.bg} p-6 shadow-lg backdrop-blur-sm`}>
          <AIToolsHub
            studentId={studentId}
            studentName={studentName}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
