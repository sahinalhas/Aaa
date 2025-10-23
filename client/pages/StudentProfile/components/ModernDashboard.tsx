/**
 * Modern Student Dashboard
 * Modern SIS standartlarına uygun öğrenci özet ekranı
 * 
 * Özellikler:
 * - İlk bakışta en kritik 5-6 bilgi kartı
 * - Quick actions (hızlı erişim)
 * - Görsel metrikler ve progress göstergeleri
 * - Responsive tasarım
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  FileText, 
  Shield, 
  TrendingUp, 
  Heart, 
  Target, 
  Activity,
  BookOpen,
  AlertTriangle,
  Sparkles,
  Calendar,
  Award,
  Brain,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/lib/storage";

import LiveProfileCard from "@/components/live-profile/LiveProfileCard";
import { EnhancedRiskCard } from "@/components/analytics/EnhancedRiskCard";
import { PersonalizedLearningCard } from "@/components/learning/PersonalizedLearningCard";
import ProfileUpdateTimeline from "@/components/live-profile/ProfileUpdateTimeline";
import { ProfileCompletenessIndicator } from "@/components/student-profile/ProfileCompletenessIndicator";

interface ModernDashboardProps {
  student: Student;
  studentId: string;
  scoresData?: any;
  loadingScores?: boolean;
}

interface MetricCardProps {
  title: string;
  score: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description?: string;
}

const MetricCard = ({ title, score, icon: Icon, color, bgColor, description }: MetricCardProps) => {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Mükemmel", textColor: "text-green-700", badgeVariant: "default" as const };
    if (score >= 60) return { label: "İyi", textColor: "text-blue-700", badgeVariant: "secondary" as const };
    if (score >= 40) return { label: "Orta", textColor: "text-yellow-700", badgeVariant: "outline" as const };
    return { label: "Gelişmeli", textColor: "text-red-700", badgeVariant: "destructive" as const };
  };

  const status = getScoreStatus(score);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3.5 rounded-xl shadow-sm ${bgColor}`}>
            <Icon className={`h-7 w-7 ${color}`} />
          </div>
          <Badge variant={status.badgeVariant} className={`${status.textColor} font-semibold`}>
            {status.label}
          </Badge>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight">{Math.round(score)}</span>
            <span className="text-base text-muted-foreground mb-1.5 font-medium">/ 100</span>
          </div>
          <Progress value={score} className="h-2.5 shadow-sm" />
          {description && (
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function ModernDashboard({ 
  student, 
  studentId, 
  scoresData,
  loadingScores 
}: ModernDashboardProps) {
  const navigate = useNavigate();
  const [analyzingRisk, setAnalyzingRisk] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleAIChat = () => {
    navigate(`/ai-asistan?student=${studentId}`);
  };

  const handleRiskAnalysis = async () => {
    setAnalyzingRisk(true);
    try {
      navigate(`/ai-asistan?student=${studentId}&action=risk`);
    } finally {
      setAnalyzingRisk(false);
    }
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    navigate(`/ai-asistan?student=${studentId}&action=report`);
    setTimeout(() => setGeneratingReport(false), 1000);
  };

  const scores = scoresData || {
    akademikSkor: 0,
    sosyalDuygusalSkor: 0,
    motivasyonSkor: 0,
    riskSkoru: 0,
  };

  const defaultCompletenessData = {
    overall: 0,
    sections: {
      temelBilgiler: 0,
      iletisimBilgileri: 0,
      veliBilgileri: 0,
      akademikProfil: 0,
      sosyalDuygusalProfil: 0,
      yetenekIlgiProfil: 0,
      saglikProfil: 0,
      davranisalProfil: 0,
    },
    eksikAlanlar: [],
  };

  const completenessData = {
    overall: scoresData?.completeness?.overall ?? 0,
    sections: scoresData?.completeness?.sections || defaultCompletenessData.sections,
    eksikAlanlar: scoresData?.completeness?.eksikAlanlar || [],
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Canlı Profil Kartı - En Üstte, En Dikkat Çekici */}
      <LiveProfileCard studentId={studentId} />

      {/* Quick Actions - Hızlı Erişim Butonları */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/10 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Hızlı İşlemler</CardTitle>
              <CardDescription className="text-sm mt-0.5">
                En sık kullanılan araçlara hızlı erişim
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              onClick={handleAIChat}
              className="gap-2 h-auto py-3 md:py-4 shadow-sm hover:shadow-md transition-all w-full"
              variant="default"
              size="lg"
            >
              <Bot className="h-5 w-5" />
              <span className="font-semibold">AI ile Konuş</span>
            </Button>
            <Button
              onClick={handleRiskAnalysis}
              className="gap-2 h-auto py-3 md:py-4 shadow-sm hover:shadow-md transition-all w-full"
              variant="outline"
              size="lg"
              disabled={analyzingRisk}
            >
              {analyzingRisk ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Shield className="h-5 w-5" />
              )}
              <span className="font-semibold">Risk Analizi</span>
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="gap-2 h-auto py-3 md:py-4 shadow-sm hover:shadow-md transition-all w-full sm:col-span-2 lg:col-span-1"
              variant="outline"
              size="lg"
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              <span className="font-semibold">Rapor Oluştur</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Önemli Metrikler - 4 Kart Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Önemli Göstergeler</h2>
            <p className="text-sm text-muted-foreground">Öğrenci performansının özet analizi</p>
          </div>
        </div>
        
        {loadingScores ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            <MetricCard
              title="Akademik Performans"
              score={scores.akademikSkor || 0}
              icon={BookOpen}
              color="text-blue-600"
              bgColor="bg-blue-100"
              description="Genel akademik başarı düzeyi"
            />
            <MetricCard
              title="Sosyal-Duygusal Gelişim"
              score={scores.sosyalDuygusalSkor || 0}
              icon={Heart}
              color="text-pink-600"
              bgColor="bg-pink-100"
              description="Duygusal zeka ve sosyal beceriler"
            />
            <MetricCard
              title="Motivasyon"
              score={scores.motivasyonSkor || 0}
              icon={Target}
              color="text-purple-600"
              bgColor="bg-purple-100"
              description="Öğrenme motivasyonu ve tutumu"
            />
            <MetricCard
              title="Risk Durumu"
              score={100 - (scores.riskSkoru || 0)}
              icon={Shield}
              color={scores.riskSkoru > 60 ? "text-red-600" : scores.riskSkoru > 30 ? "text-yellow-600" : "text-green-600"}
              bgColor={scores.riskSkoru > 60 ? "bg-red-100" : scores.riskSkoru > 30 ? "bg-yellow-100" : "bg-green-100"}
              description={scores.riskSkoru > 60 ? "Acil müdahale gerekli" : scores.riskSkoru > 30 ? "Takip edilmeli" : "Düşük risk"}
            />
          </div>
        )}
      </div>

      {/* Detaylı Analiz Kartları - 2 Sütun */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Detaylı Analizler</h2>
            <p className="text-sm text-muted-foreground">AI destekli derinlemesine profil değerlendirmesi</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <EnhancedRiskCard studentId={studentId} />
          <PersonalizedLearningCard studentId={studentId} />
        </div>
      </div>

      {/* Profil Tamlık Göstergesi */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Profil Durumu</h2>
            <p className="text-sm text-muted-foreground">Veri tamlığı ve eksik alanlar</p>
          </div>
        </div>
        <ProfileCompletenessIndicator
          overall={completenessData.overall}
          sections={completenessData.sections}
          eksikAlanlar={completenessData.eksikAlanlar}
        />
      </div>

      {/* Son Güncellemeler - Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Son Aktiviteler</h2>
            <p className="text-sm text-muted-foreground">Güncel profil değişiklikleri ve olaylar</p>
          </div>
        </div>
        <ProfileUpdateTimeline studentId={studentId} />
      </div>

      {/* Yüksek Risk Uyarısı */}
      {scores.riskSkoru > 60 && (
        <Card className="border-2 border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Yüksek Risk Uyarısı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Bu öğrenci için risk skoru yüksek seviyede ({Math.round(scores.riskSkoru)}/100). 
              Acil müdahale planı oluşturulması önerilir.
            </p>
            <Button 
              onClick={handleRiskAnalysis}
              variant="destructive"
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              Müdahale Planı Oluştur
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
