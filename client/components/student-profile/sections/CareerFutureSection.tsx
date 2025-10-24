/**
 * Career & Future Section
 * Kariyer analizi, yol haritası, hedefler - unified view
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KARIYER_TABS, TAB_COLORS } from "@/pages/StudentProfile/constants";
import CareerGuidanceSection from "./CareerGuidanceSection";
import HedeflerPlanlamaSection from "./HedeflerPlanlamaSection";

interface CareerFutureSectionProps {
  studentId: string;
  studentName: string;
  academicGoals: any[];
  onUpdate: () => void;
}

export default function CareerFutureSection({
  studentId,
  studentName,
  academicGoals,
  onUpdate
}: CareerFutureSectionProps) {
  return (
    <Tabs defaultValue="kariyer-analizi" className="space-y-6">
      <TabsList className={`w-full justify-start ${TAB_COLORS.kariyer.bg} p-2 flex-wrap h-auto min-h-[2.5rem] border-2 ${TAB_COLORS.kariyer.border} rounded-xl shadow-md`}>
        {KARIYER_TABS.map(({ value, label, icon: Icon }) => (
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

      <TabsContent value="kariyer-analizi" className="animate-in slide-in-from-left-10 duration-300">
        <CareerGuidanceSection
          studentId={studentId}
          studentName={studentName}
        />
      </TabsContent>

      <TabsContent value="yol-haritasi" className="animate-in slide-in-from-left-10 duration-300">
        <CareerGuidanceSection
          studentId={studentId}
          studentName={studentName}
        />
      </TabsContent>

      <TabsContent value="hedefler" className="animate-in slide-in-from-left-10 duration-300">
        <HedeflerPlanlamaSection
          studentId={studentId}
          academicGoals={academicGoals}
          onUpdate={onUpdate}
        />
      </TabsContent>
    </Tabs>
  );
}
