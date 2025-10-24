/**
 * Modern Student Dashboard - 2025 SIS Standards
 * Modern öğrenci bilgi sistemleri standartlarına uygun özet ekran
 * 
 * Özellikler:
 * - Glassmorphism ve modern visual effects
 * - AI-powered insights with visual hierarchy
 * - Responsive grid layout with adaptive cards
 * - Smooth animations and micro-interactions
 * - Data visualization with progress indicators
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
  Loader2,
  ArrowRight,
  TrendingDown,
  Zap
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
  bgGradient: string;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

const MetricCard = ({ title, score, icon: Icon, color, bgGradient, description, trend, trendValue }: MetricCardProps) => {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { 
      label: "Mükemmel", 
      textColor: "text-emerald-700", 
      bgColor: "bg-emerald-50"
    };
    if (score >= 60) return { 
      label: "İyi", 
      textColor: "text-blue-700", 
      bgColor: "bg-blue-50"
    };
    if (score >= 40) return { 
      label: "Orta", 
      textColor: "text-amber-700", 
      bgColor: "bg-amber-50"
    };
    return { 
      label: "Gelişmeli", 
      textColor: "text-red-700", 
      bgColor: "bg-red-50"
    };
  };

  const status = getScoreStatus(score);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Gradient Background - Görüşmeler sayfası stili */}
      <div className={`absolute inset-0 ${bgGradient} opacity-5`}></div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgGradient} bg-opacity-10`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">{Math.round(score)}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        <Badge 
          className={`${status.textColor} ${status.bgColor} font-semibold px-2 py-1 shadow-sm mt-2 inline-block`}
        >
          {status.label}
        </Badge>
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend === 'up' ? '+' : ''}{trendValue}%
            </span>
          </div>
        )}
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
    <div className="space-y-8">
      {/* AI-Powered Living Profile - Hero Card */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-2xl opacity-20 blur-xl"></div>
        <div className="relative">
          <LiveProfileCard studentId={studentId} />
        </div>
      </div>

      {/* Quick Actions - Glassmorphism Card */}
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        
        <CardHeader className="relative pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Hızlı İşlemler</CardTitle>
              <CardDescription className="text-sm mt-1">
                En sık kullanılan AI araçlarına anında erişim
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={handleAIChat}
              className="group gap-3 h-auto py-5 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              size="lg"
            >
              <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-left">
                <div className="font-bold text-base">AI ile Konuş</div>
                <div className="text-xs opacity-90">Anlık destek</div>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button
              onClick={handleRiskAnalysis}
              className="group gap-3 h-auto py-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2"
              variant="outline"
              size="lg"
              disabled={analyzingRisk}
            >
              {analyzingRisk ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Shield className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="text-left">
                <div className="font-bold text-base">Risk Analizi</div>
                <div className="text-xs opacity-70">Detaylı değerlendirme</div>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button
              onClick={handleGenerateReport}
              className="group gap-3 h-auto py-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 sm:col-span-2 lg:col-span-1"
              variant="outline"
              size="lg"
              disabled={generatingReport}
            >
              {generatingReport ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <FileText className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="text-left">
                <div className="font-bold text-base">Rapor Oluştur</div>
                <div className="text-xs opacity-70">PDF formatında</div>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics - Modern Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Performans Göstergeleri</h2>
              <p className="text-sm text-muted-foreground">Öğrenci performansının kapsamlı analizi</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold px-4 py-2">
            Güncel
          </Badge>
        </div>
        
        {loadingScores ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 w-16 bg-muted rounded-2xl"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-12 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              title="Akademik Performans"
              score={scores.akademikSkor || 0}
              icon={BookOpen}
              color="text-blue-600"
              bgGradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              description="Genel akademik başarı ve not ortalaması"
              trend="up"
              trendValue={5}
            />
            <MetricCard
              title="Sosyal-Duygusal"
              score={scores.sosyalDuygusalSkor || 0}
              icon={Heart}
              color="text-pink-600"
              bgGradient="bg-gradient-to-br from-pink-500 to-rose-500"
              description="Duygusal zeka ve sosyal beceriler"
              trend="stable"
            />
            <MetricCard
              title="Motivasyon Seviyesi"
              score={scores.motivasyonSkor || 0}
              icon={Target}
              color="text-purple-600"
              bgGradient="bg-gradient-to-br from-purple-500 to-fuchsia-500"
              description="Öğrenme isteği ve hedef odaklılık"
              trend="up"
              trendValue={8}
            />
            <MetricCard
              title="Genel Durum"
              score={100 - (scores.riskSkoru || 0)}
              icon={Shield}
              color={scores.riskSkoru > 60 ? "text-red-600" : scores.riskSkoru > 30 ? "text-amber-600" : "text-emerald-600"}
              bgGradient={
                scores.riskSkoru > 60 
                  ? "bg-gradient-to-br from-red-500 to-orange-500" 
                  : scores.riskSkoru > 30 
                    ? "bg-gradient-to-br from-amber-500 to-yellow-500" 
                    : "bg-gradient-to-br from-emerald-500 to-green-500"
              }
              description={
                scores.riskSkoru > 60 
                  ? "Acil müdahale gerekli - yüksek risk" 
                  : scores.riskSkoru > 30 
                    ? "Yakın takip önerilir - orta risk" 
                    : "Stabil durum - düşük risk"
              }
            />
          </div>
        )}
      </div>

      {/* AI-Powered Deep Analysis */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-xl border border-purple-200">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Destekli Analizler</h2>
            <p className="text-sm text-muted-foreground">Yapay zeka ile derinlemesine profil değerlendirmesi</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl opacity-10 blur-xl"></div>
            <div className="relative">
              <EnhancedRiskCard studentId={studentId} />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-10 blur-xl"></div>
            <div className="relative">
              <PersonalizedLearningCard studentId={studentId} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-xl border border-amber-200">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Profil Tamlığı</h2>
            <p className="text-sm text-muted-foreground">Veri bütünlüğü ve eksik alan analizi</p>
          </div>
        </div>
        
        <ProfileCompletenessIndicator
          overall={completenessData.overall}
          sections={completenessData.sections}
          eksikAlanlar={completenessData.eksikAlanlar}
        />
      </div>

      {/* Recent Activity Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-xl border border-cyan-200">
            <Calendar className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Son Aktiviteler</h2>
            <p className="text-sm text-muted-foreground">Profil güncellemeleri ve önemli olaylar</p>
          </div>
        </div>
        
        <ProfileUpdateTimeline studentId={studentId} />
      </div>

      {/* High Risk Alert */}
      {scores.riskSkoru > 60 && (
        <Card className="relative overflow-hidden border-4 border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
          
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-red-700 text-xl">
              <div className="p-3 bg-red-500 rounded-xl animate-pulse">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              Yüksek Risk Uyarısı - Acil Müdahale Gerekli
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative">
            <p className="text-red-700 mb-6 text-base leading-relaxed">
              Bu öğrenci için risk skoru kritik seviyede ({Math.round(scores.riskSkoru)}/100). 
              Derhal müdahale planı oluşturulması ve yakın takip yapılması önerilir. 
              AI asistanı ile detaylı risk analizi yapabilir ve öneriler alabilirsiniz.
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleRiskAnalysis}
                className="gap-2 bg-red-600 hover:bg-red-700 shadow-lg"
                size="lg"
              >
                <Shield className="h-5 w-5" />
                Acil Müdahale Planı Oluştur
              </Button>
              
              <Button 
                onClick={handleAIChat}
                variant="outline"
                className="gap-2 border-red-500 text-red-700 hover:bg-red-50"
                size="lg"
              >
                <Bot className="h-5 w-5" />
                AI Danışman ile Görüş
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
