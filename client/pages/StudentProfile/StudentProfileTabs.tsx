import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MAIN_TABS,
  AKADEMIK_TABS_NEW,
  KISISEL_SOSYAL_TABS_NEW,
  REHBERLIK_DESTEK_TABS,
  SISTEM_TABS,
} from "./constants";
import { StudentData } from "@/hooks/student-profile";
import { Student } from "@/lib/storage";

// Temel bilgi bileşenleri
import BasicInfoSection from "@/components/student-profile/sections/BasicInfoSection";
import StandardizedHealthSection from "@/components/student-profile/sections/StandardizedHealthSection";
import OzelEgitimSection from "@/components/student-profile/sections/OzelEgitimSection";

// Akademik bileşenler
import StandardizedAcademicSection from "@/components/student-profile/sections/StandardizedAcademicSection";
import CalismaProgramiSection from "@/components/student-profile/sections/CalismaProgramiSection";
import IlerlemeTakibiSection from "@/components/student-profile/sections/IlerlemeTakibiSection";
import AnketlerSection from "@/components/student-profile/sections/AnketlerSection";

// Kişisel & Sosyal bileşenler
import StandardizedSocialEmotionalSection from "@/components/student-profile/sections/StandardizedSocialEmotionalSection";
import KisilikProfiliSection from "@/components/student-profile/sections/KisilikProfiliSection";
import StandardizedTalentsSection from "@/components/student-profile/sections/StandardizedTalentsSection";
import MotivationProfileSection from "@/components/student-profile/sections/MotivationProfileSection";
import Degerlendirme360Section from "@/components/student-profile/sections/Degerlendirme360Section";

// Aile & İletişim bileşenleri
import EvZiyaretleriSection from "@/components/student-profile/sections/EvZiyaretleriSection";
import AileKatilimiSection from "@/components/student-profile/sections/AileKatilimiSection";

// Mesleki bileşenler
import HedeflerPlanlamaSection from "@/components/student-profile/sections/HedeflerPlanlamaSection";
import CareerGuidanceSection from "@/components/student-profile/sections/CareerGuidanceSection";

// Ölçme Değerlendirme bileşenleri
import StudentExamResultsSection from "@/components/student-profile/sections/StudentExamResultsSection";

// Birleştirilmiş bileşenler (Yeni!)
import UnifiedRiskSection from "@/components/student-profile/sections/UnifiedRiskSection";
import UnifiedMeetingsSection from "@/components/student-profile/sections/UnifiedMeetingsSection";
import AIToolsHub from "@/components/student-profile/sections/AIToolsHub";

// Dashboard bileşenleri
import { ModernDashboard } from "./components/ModernDashboard";

// Sistem bileşenleri
import ManualCorrectionPanel from "@/components/profile-sync/ManualCorrectionPanel";
import ConflictResolutionUI from "@/components/profile-sync/ConflictResolutionUI";
import ProfileChangeTimeline from "@/components/profile-sync/ProfileChangeTimeline";
import ConflictResolutionPanel from "@/components/profile-sync/ConflictResolutionPanel";
import UnifiedProfileCard from "@/components/profile-sync/UnifiedProfileCard";

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
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      {/* Main Navigation Tabs - Modern Design */}
      <TabsList className="flex flex-wrap gap-2 md:gap-3 h-auto w-full justify-start min-h-[3rem] p-2 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-primary/10 shadow-lg backdrop-blur-sm">
        {MAIN_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            className="flex items-center gap-2 shrink-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 px-4 py-3 font-semibold rounded-lg border-2 border-transparent data-[state=active]:border-primary/20"
          >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* DASHBOARD - MODERN SIS STANDARDS */}
      <TabsContent value="dashboard" className="mt-6 min-h-[400px] animate-in fade-in-50 duration-500">
        <ModernDashboard 
          student={student}
          studentId={studentId}
          scoresData={scoresData}
          loadingScores={loadingScores}
        />
      </TabsContent>

      {/* ACADEMIC PROFILE - Extended with Exams */}
      <TabsContent value="akademik" className="mt-6 min-h-[400px] animate-in fade-in-50 duration-500">
        <Tabs defaultValue="performans" className="space-y-6">
          <TabsList className="w-full justify-start bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-2 flex-wrap h-auto min-h-[2.5rem] border-2 border-blue-200/50 dark:border-blue-800/50 rounded-xl shadow-md">
            {AKADEMIK_TABS_NEW.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-blue-300 dark:data-[state=active]:border-blue-700 shrink-0 px-4 py-2.5 transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="performans" className="animate-in slide-in-from-left-10 duration-300">
            <StandardizedAcademicSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="sinavlar" className="animate-in slide-in-from-left-10 duration-300">
            <StudentExamResultsSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="calisma-programi" className="animate-in slide-in-from-left-10 duration-300">
            <CalismaProgramiSection studentId={studentId} />
          </TabsContent>

          <TabsContent value="ilerleme" className="animate-in slide-in-from-left-10 duration-300">
            <IlerlemeTakibiSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="anketler" className="animate-in slide-in-from-left-10 duration-300">
            <AnketlerSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* PERSONAL & SOCIAL - Unified (Identity + Social-Emotional + Talents) */}
      <TabsContent value="kisisel-sosyal" className="mt-6 min-h-[400px] animate-in fade-in-50 duration-500">
        <Tabs defaultValue="kimlik-bilgiler" className="space-y-6">
          <TabsList className="w-full justify-start bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-2 flex-wrap h-auto min-h-[2.5rem] border-2 border-pink-200/50 dark:border-pink-800/50 rounded-xl shadow-md">
            {KISISEL_SOSYAL_TABS_NEW.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-pink-300 dark:data-[state=active]:border-pink-700 shrink-0 px-4 py-2.5 transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="kimlik-bilgiler" className="animate-in slide-in-from-left-10 duration-300">
            <div className="space-y-6">
              <BasicInfoSection student={student} onUpdate={onUpdate} />
              <OzelEgitimSection
                studentId={studentId}
                specialEducation={data.specialEducation}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="saglik" className="animate-in slide-in-from-left-10 duration-300">
            <StandardizedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="sosyal-duygusal" className="animate-in slide-in-from-left-10 duration-300">
            <StandardizedSocialEmotionalSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="kisilik-yetenek" className="animate-in slide-in-from-left-10 duration-300">
            <div className="space-y-6">
              <KisilikProfiliSection
                studentId={studentId}
                multipleIntelligence={data.multipleIntelligence}
                onUpdate={onUpdate}
              />
              <StandardizedTalentsSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
              <Degerlendirme360Section
                studentId={studentId}
                evaluations360={data.evaluations360}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="motivasyon" className="animate-in slide-in-from-left-10 duration-300">
            <MotivationProfileSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* GUIDANCE & SUPPORT - New Unified Tab */}
      <TabsContent value="rehberlik-destek" className="mt-6 min-h-[400px] animate-in fade-in-50 duration-500">
        <Tabs defaultValue="risk-mudahale" className="space-y-6">
          <TabsList className="w-full justify-start bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-2 flex-wrap h-auto min-h-[2.5rem] border-2 border-amber-200/50 dark:border-amber-800/50 rounded-xl shadow-md">
            {REHBERLIK_DESTEK_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-amber-300 dark:data-[state=active]:border-amber-700 shrink-0 px-4 py-2.5 transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="risk-mudahale" className="animate-in slide-in-from-left-10 duration-300">
            <UnifiedRiskSection
              studentId={studentId}
              student={student}
              onUpdate={onUpdate}
            />
          </TabsContent>

          <TabsContent value="aile-iletisim" className="animate-in slide-in-from-left-10 duration-300">
            <div className="space-y-6">
              <UnifiedMeetingsSection
                studentId={studentId}
                onUpdate={onUpdate}
              />
              <EvZiyaretleriSection
                studentId={studentId}
                homeVisits={data.homeVisits}
                onUpdate={onUpdate}
              />
              <AileKatilimiSection
                studentId={studentId}
                familyParticipation={data.familyParticipation}
                onUpdate={onUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="mesleki-rehberlik" className="animate-in slide-in-from-left-10 duration-300">
            <div className="space-y-6">
              <HedeflerPlanlamaSection
                studentId={studentId}
                academicGoals={data.academicGoals}
                onUpdate={onUpdate}
              />
              <CareerGuidanceSection
                studentId={studentId}
                studentName={`${student.ad} ${student.soyad}`}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai-destegi" className="animate-in slide-in-from-left-10 duration-300">
            <AIToolsHub
              studentId={studentId}
              studentName={`${student.ad} ${student.soyad}`}
              onUpdate={onUpdate}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* SYSTEM - Technical Tools */}
      <TabsContent value="sistem" className="mt-6 min-h-[400px] animate-in fade-in-50 duration-500">
        <Tabs defaultValue="profil-gecmisi" className="space-y-6">
          <TabsList className="w-full justify-start bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 p-2 flex-wrap h-auto min-h-[2.5rem] border-2 border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-md">
            {SISTEM_TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger 
                key={value} 
                value={value} 
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-300 dark:data-[state=active]:border-slate-700 shrink-0 px-4 py-2.5 transition-all duration-200 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg"
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profil-gecmisi" className="animate-in slide-in-from-left-10 duration-300">
            <div className="space-y-6">
              <UnifiedProfileCard studentId={studentId} />
              <ProfileChangeTimeline studentId={studentId} />
            </div>
          </TabsContent>

          <TabsContent value="manuel-duzeltme" className="animate-in slide-in-from-left-10 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ManualCorrectionPanel studentId={studentId} />
              <ConflictResolutionPanel studentId={studentId} />
            </div>
          </TabsContent>

          <TabsContent value="celiski-cozum" className="animate-in slide-in-from-left-10 duration-300">
            <ConflictResolutionUI studentId={studentId} />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
