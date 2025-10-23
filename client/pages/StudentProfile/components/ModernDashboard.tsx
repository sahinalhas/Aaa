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
    if (score >= 80) return { label: "Mükemmel", textColor: "text-green-700" };
    if (score >= 60) return { label: "İyi", textColor: "text-blue-700" };
    if (score >= 40) return { label: "Orta", textColor: "text-yellow-700" };
    return { label: "Gelişmeli", textColor: "text-red-700" };
  };

  const status = getScoreStatus(score);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <Badge variant="outline" className={status.textColor}>
            {status.label}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{Math.round(score)}</span>
            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
          </div>
          <Progress value={score} className="h-2" />
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
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

  const completenessData = scoresData?.completeness || {
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

  return (
    <div className="space-y-6">
      {/* Canlı Profil Kartı - En Üstte, En Dikkat Çekici */}
      <LiveProfileCard studentId={studentId} />

      {/* Quick Actions - Hızlı Erişim Butonları */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Hızlı İşlemler
          </CardTitle>
          <CardDescription>
            En sık kullanılan araçlara hızlı erişim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAIChat}
              className="gap-2 flex-1 min-w-[140px]"
              variant="default"
            >
              <Bot className="h-4 w-4" />
              AI ile Konuş
            </Button>
            <Button
              onClick={handleRiskAnalysis}
              className="gap-2 flex-1 min-w-[140px]"
              variant="outline"
              disabled={analyzingRisk}
            >
              {analyzingRisk ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
              Risk Analizi
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="gap-2 flex-1 min-w-[140px]"
              variant="outline"
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Rapor Oluştur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Önemli Metrikler - 4 Kart Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Önemli Göstergeler
        </h2>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Detaylı Analizler
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EnhancedRiskCard studentId={studentId} />
          <PersonalizedLearningCard studentId={studentId} />
        </div>
      </div>

      {/* Profil Tamlık Göstergesi */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Profil Durumu
        </h2>
        <ProfileCompletenessIndicator
          overall={completenessData.overall}
          sections={completenessData.sections}
          eksikAlanlar={completenessData.eksikAlanlar}
        />
      </div>

      {/* Son Güncellemeler - Timeline */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Son Aktiviteler
        </h2>
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
