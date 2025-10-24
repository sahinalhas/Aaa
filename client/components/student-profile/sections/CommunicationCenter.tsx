/**
 * Communication Center
 * Tüm görüşme ve iletişim kayıtlarını tek merkezde toplar
 * NOT: GorusmelerSection, VeliGorusmeleriSection ve diğer iletişim component'lerini birleştirir
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ILETISIM_TABS, TAB_COLORS } from "@/pages/StudentProfile/constants";
import UnifiedMeetingsSection from "./UnifiedMeetingsSection";
import EvZiyaretleriSection from "./EvZiyaretleriSection";
import AileKatilimiSection from "./AileKatilimiSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotesByStudent } from "@/lib/api/notes.api";
import { getParentMeetingsByStudent, getHomeVisitsByStudent, getFamilyParticipationByStudent } from "@/lib/api/family.api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface CommunicationCenterProps {
  studentId: string;
  onUpdate: () => void;
}

export default function CommunicationCenter({
  studentId,
  onUpdate
}: CommunicationCenterProps) {
  const [stats, setStats] = useState({
    totalMeetings: 0,
    homeVisits: 0,
    familyParticipation: 0,
    lastContact: null as string | null
  });
  const [homeVisitsData, setHomeVisitsData] = useState<any[]>([]);
  const [familyParticipationData, setFamilyParticipationData] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, [studentId]);

  const loadStats = async () => {
    try {
      const [notes, parentMeetings, homeVisits, familyParticipation] = await Promise.all([
        getNotesByStudent(studentId),
        getParentMeetingsByStudent(studentId),
        getHomeVisitsByStudent(studentId),
        getFamilyParticipationByStudent(studentId)
      ]);

      // State'e kaydet
      setHomeVisitsData(homeVisits);
      setFamilyParticipationData(familyParticipation);

      const allDates = [
        ...notes.map(n => n.date),
        ...parentMeetings.map(m => m.meetingDate),
        ...homeVisits.map(v => v.date),
        ...familyParticipation.map(p => p.eventDate)
      ].filter(Boolean).sort().reverse();

      setStats({
        totalMeetings: notes.length + parentMeetings.length,
        homeVisits: homeVisits.length,
        familyParticipation: familyParticipation.length,
        lastContact: allDates[0] || null
      });
    } catch (error) {
      console.error("Error loading communication stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              Toplam Görüşme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" />
              Ev Ziyareti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.homeVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Aile Katılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.familyParticipation}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              Son İletişim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {stats.lastContact 
                ? format(new Date(stats.lastContact), "dd MMM yyyy", { locale: tr })
                : "Henüz kayıt yok"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alt Sekmeler */}
      <Tabs defaultValue="tum-gorusmeler" className="space-y-6" onValueChange={loadStats}>
        <TabsList className={`w-full justify-start ${TAB_COLORS.iletisim.bg} p-2 flex-wrap h-auto min-h-[2.5rem] border-2 ${TAB_COLORS.iletisim.border} rounded-xl shadow-md`}>
          {ILETISIM_TABS.map(({ value, label, icon: Icon }) => (
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

        <TabsContent value="tum-gorusmeler" className="animate-in slide-in-from-left-10 duration-300">
          <UnifiedMeetingsSection
            studentId={studentId}
            onUpdate={() => {
              onUpdate();
              loadStats();
            }}
          />
        </TabsContent>

        <TabsContent value="ev-ziyaretleri" className="animate-in slide-in-from-left-10 duration-300">
          <EvZiyaretleriSection
            studentId={studentId}
            homeVisits={homeVisitsData}
            onUpdate={() => {
              onUpdate();
              loadStats();
            }}
          />
        </TabsContent>

        <TabsContent value="aile-katilimi" className="animate-in slide-in-from-left-10 duration-300">
          <AileKatilimiSection
            studentId={studentId}
            familyParticipation={familyParticipationData}
            onUpdate={() => {
              onUpdate();
              loadStats();
            }}
          />
        </TabsContent>

        <TabsContent value="gecmis" className="animate-in slide-in-from-left-10 duration-300">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Geçmişi</CardTitle>
              <CardDescription>
                Tüm görüşme, ziyaret ve etkinlik kayıtları kronolojik sırada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                İletişim geçmişi görünümü geliştirilme aşamasında...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
