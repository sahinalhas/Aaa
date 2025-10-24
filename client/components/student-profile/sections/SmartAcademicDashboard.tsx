/**
 * Smart Academic Dashboard
 * Akademik performans özeti - mevcut akademik sekmelerini organize eder
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AKADEMIK_TABS, TAB_COLORS } from "@/pages/StudentProfile/constants";
import StandardizedAcademicSection from "./StandardizedAcademicSection";
import StudentExamResultsSection from "./StudentExamResultsSection";
import CalismaProgramiSection from "./CalismaProgramiSection";
import IlerlemeTakibiSection from "./IlerlemeTakibiSection";
import AnketlerSection from "./AnketlerSection";

interface SmartAcademicDashboardProps {
  studentId: string;
  onUpdate: () => void;
}

export default function SmartAcademicDashboard({
  studentId,
  onUpdate
}: SmartAcademicDashboardProps) {
  return (
    <Tabs defaultValue="performans" className="space-y-6">
      <TabsList className={`w-full justify-start ${TAB_COLORS.akademik.bg} p-2 flex-wrap h-auto min-h-[2.5rem] border-2 ${TAB_COLORS.akademik.border} rounded-xl shadow-md`}>
        {AKADEMIK_TABS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md shrink-0 px-4 py-2.5 transition-all duration-200 rounded-lg"
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
  );
}
