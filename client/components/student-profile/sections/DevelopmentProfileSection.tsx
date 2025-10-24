/**
 * Development Profile Section
 * Gelişim ve kişilik profili - sosyal-duygusal, çoklu zeka, yetenekler, motivasyon
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GELISIM_TABS, TAB_COLORS } from "@/pages/StudentProfile/constants";
import StandardizedSocialEmotionalSection from "./StandardizedSocialEmotionalSection";
import KisilikProfiliSection from "./KisilikProfiliSection";
import StandardizedTalentsSection from "./StandardizedTalentsSection";
import MotivationProfileSection from "./MotivationProfileSection";
import Degerlendirme360Section from "./Degerlendirme360Section";

interface DevelopmentProfileSectionProps {
  studentId: string;
  multipleIntelligence: any;
  evaluations360: any[];
  onUpdate: () => void;
}

export default function DevelopmentProfileSection({
  studentId,
  multipleIntelligence,
  evaluations360,
  onUpdate
}: DevelopmentProfileSectionProps) {
  return (
    <Tabs defaultValue="sosyal-duygusal" className="space-y-6">
      <TabsList className={`w-full justify-start ${TAB_COLORS.gelisim.bg} p-2 flex-wrap h-auto min-h-[2.5rem] border-2 ${TAB_COLORS.gelisim.border} rounded-xl shadow-md`}>
        {GELISIM_TABS.map(({ value, label, icon: Icon }) => (
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

      <TabsContent value="sosyal-duygusal" className="animate-in slide-in-from-left-10 duration-300">
        <StandardizedSocialEmotionalSection
          studentId={studentId}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="coklu-zeka" className="animate-in slide-in-from-left-10 duration-300">
        <div className="space-y-6">
          <KisilikProfiliSection
            studentId={studentId}
            multipleIntelligence={multipleIntelligence}
            onUpdate={onUpdate}
          />
          <Degerlendirme360Section
            studentId={studentId}
            evaluations360={evaluations360}
            onUpdate={onUpdate}
          />
        </div>
      </TabsContent>

      <TabsContent value="yetenekler" className="animate-in slide-in-from-left-10 duration-300">
        <StandardizedTalentsSection
          studentId={studentId}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="motivasyon" className="animate-in slide-in-from-left-10 duration-300">
        <MotivationProfileSection
          studentId={studentId}
          onUpdate={onUpdate}
        />
      </TabsContent>
    </Tabs>
  );
}
