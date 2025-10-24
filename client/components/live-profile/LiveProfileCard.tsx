
/**
 * Live Profile Card Component
 * "Öğrenci Kimdir?" - Canlı öğrenci kimlik kartı
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw,
  Heart,
  BookOpen,
  Activity,
  Target,
  Clock,
  Sparkles,
  Shield
} from "lucide-react";
import { useLiveProfile } from "@/hooks/live-profile/useLiveProfile";
import { cn } from "@/lib/utils";

interface LiveProfileCardProps {
  studentId: string;
  compact?: boolean;
}

export default function LiveProfileCard({ studentId, compact = false }: LiveProfileCardProps) {
  const { identity, isLoading, refresh, isRefreshing } = useLiveProfile(studentId);

  if (isLoading) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!identity) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Canlı Profil
          </CardTitle>
          <CardDescription>Profil henüz oluşturulmadı</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refresh()} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Profil Oluştur
          </Button>
        </CardContent>
      </Card>
    );
  }

  const priorityColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };

  const priorityIcons = {
    low: TrendingUp,
    medium: Target,
    high: AlertTriangle,
    critical: AlertTriangle,
  };

  const PriorityIcon = priorityIcons[identity.interventionPriority];

  const priorityGradients = {
    low: 'bg-gradient-to-br from-emerald-500 to-green-500',
    medium: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    high: 'bg-gradient-to-br from-orange-500 to-red-500',
    critical: 'bg-gradient-to-br from-red-500 to-pink-500',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ana Profil Kartı */}
      <Card className="lg:col-span-2 relative overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-50"></div>
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  identity.interventionPriority === 'critical' ? 'bg-red-500/10' : 
                  identity.interventionPriority === 'high' ? 'bg-orange-500/10' :
                  'bg-primary/10'
                )}>
                  <User className={cn(
                    "h-5 w-5",
                    identity.interventionPriority === 'critical' ? 'text-red-600' : 
                    identity.interventionPriority === 'high' ? 'text-orange-600' :
                    'text-primary'
                  )} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Canlı Öğrenci Profili</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(identity.lastUpdated).toLocaleString('tr-TR', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs font-medium", priorityColors[identity.interventionPriority])}>
                <PriorityIcon className="h-3 w-3 mr-1" />
                {identity.interventionPriority === 'critical' ? 'KRİTİK' :
                 identity.interventionPriority === 'high' ? 'YÜKSEK' :
                 identity.interventionPriority === 'medium' ? 'ORTA' : 'NORMAL'}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refresh()}
                disabled={isRefreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Kim Bu Öğrenci? */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Kim Bu Öğrenci?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{identity.summary}</p>
            </CardContent>
          </Card>

          {/* Anlık Durum */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Şu Anki Durum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{identity.currentState}</p>
            </CardContent>
          </Card>

          {!compact && (
            <>
              {/* Güçlü Yönler & Zorluklar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      Güçlü Yönler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {identity.strengths.slice(0, 3).map((strength, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span className="flex-1">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      Gelişim Alanları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {identity.challenges.slice(0, 3).map((challenge, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span className="flex-1">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* AI Önerileri */}
              {identity.recommendedActions.length > 0 && (
                <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      AI Destekli Öneriler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {identity.recommendedActions.slice(0, 3).map((action, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-blue-600 font-bold flex-shrink-0">{idx + 1}.</span>
                          <span className="flex-1">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Sağ Panel - Performans Skorları */}
      <div className="space-y-4">
        {/* Genel Durum Kartı */}
        <Card className={cn(
          "border border-border/50 shadow-sm relative overflow-hidden"
        )}>
          <div className={cn(
            "absolute inset-0 opacity-5",
            priorityGradients[identity.interventionPriority]
          )}></div>
          
          <CardHeader className="relative pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Genel Değerlendirme
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center">
              <div className={cn(
                "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2",
                priorityGradients[identity.interventionPriority]
              )}>
                <span className="text-2xl font-bold text-white">
                  {100 - identity.riskLevel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {identity.riskLevel > 60 ? 'Yüksek Risk' :
                 identity.riskLevel > 30 ? 'Orta Risk' : 'Düşük Risk'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performans Skorları */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Performans Skorları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  Akademik
                </span>
                <span className="text-xs font-bold">{identity.academicScore}%</span>
              </div>
              <Progress value={identity.academicScore} className="h-1.5" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  Sosyal-Duygusal
                </span>
                <span className="text-xs font-bold">{identity.socialEmotionalScore}%</span>
              </div>
              <Progress value={identity.socialEmotionalScore} className="h-1.5" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <Target className="h-3 w-3" />
                  Motivasyon
                </span>
                <span className="text-xs font-bold">{identity.motivationScore}%</span>
              </div>
              <Progress value={identity.motivationScore} className="h-1.5" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Risk Seviyesi
                </span>
                <span className="text-xs font-bold">{identity.riskLevel}%</span>
              </div>
              <Progress value={identity.riskLevel} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
