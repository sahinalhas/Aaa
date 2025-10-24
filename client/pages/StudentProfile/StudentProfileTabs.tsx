/**
 * Student Profile Tabs - Modern 2025 Design
 * 8 Ana Sekme Yapısı - Bilgi Tekrarı YOK
 * Glassmorphism & Smooth Transitions
 */

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MAIN_TABS } from "./constants";
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
      {/* Modern Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsList className="flex flex-wrap gap-2 h-auto w-full justify-start p-2 bg-gradient-to-br from-background/95 via-muted/40 to-background/95 rounded-xl border border-border/50 shadow-lg">
          {MAIN_TABS.map(({ value, label, icon: Icon, description }) => (
            <TabsTrigger 
              key={value} 
              value={value} 
              title={description}
              className="flex items-center gap-2 shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 hover:bg-muted px-4 py-2.5 rounded-lg"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">{label}</span>
              <span className="sm:hidden text-xs font-medium">{label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </motion.div>

      {/* 1. DASHBOARD - Özet Görünüm */}
      <TabsContent value="dashboard" className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ModernDashboard 
            student={student}
            studentId={studentId}
            scoresData={scoresData}
            loadingScores={loadingScores}
          />
        </motion.div>
      </TabsContent>

      {/* 2. KİMLİK & İLETİŞİM */}
      <TabsContent value="kimlik" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-blue-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <UnifiedIdentitySection
            student={student}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 3. SAĞLIK & GÜVENLİK */}
      <TabsContent value="saglik" className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-green-500 to-green-600" />
            <EnhancedHealthSection
              studentId={studentId}
              onUpdate={onUpdate}
            />
            </div>
          
          <OzelEgitimSection
            studentId={studentId}
            specialEducation={data.specialEducation || []}
            onUpdate={onUpdate}
          />
        </motion.div>
      </TabsContent>

      {/* 4. AKADEMİK */}
      <TabsContent value="akademik" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-blue-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <SmartAcademicDashboard
            studentId={studentId}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 5. GELİŞİM & KİŞİLİK */}
      <TabsContent value="gelisim" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-purple-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <DevelopmentProfileSection
            studentId={studentId}
            multipleIntelligence={data.multipleIntelligence}
            evaluations360={data.evaluations360}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 6. RİSK & MÜDAHALE */}
      <TabsContent value="risk" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-red-500 to-red-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <EnhancedRiskDashboard
            studentId={studentId}
            student={student}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 7. KARİYER & GELECEK */}
      <TabsContent value="kariyer" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-500 to-amber-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <CareerFutureSection
            studentId={studentId}
            studentName={studentName}
            academicGoals={data.academicGoals}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 8. İLETİŞİM MERKEZİ */}
      <TabsContent value="iletisim" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-cyan-500 to-cyan-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <CommunicationCenter
            studentId={studentId}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>

      {/* 9. AI ARAÇLARI */}
      <TabsContent value="ai-hub" className="mt-6">
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-violet-500 to-violet-600" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
          <AIToolsHub
            studentId={studentId}
            studentName={studentName}
            onUpdate={onUpdate}
          />
          </motion.div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
