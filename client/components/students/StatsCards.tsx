import { Users, UserCheck, UserX, AlertTriangle, TrendingUp, GraduationCap } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { ModernCard } from '@/components/ui/modern-card';
import { StatsGrid, SkeletonCard } from '@/components/ui/stats-grid';
import { Badge } from '@/components/ui/badge';
import { MODERN_GRADIENTS } from '@/lib/config/theme.config';
import type { StudentStats } from '@/hooks/useStudentStats';

interface StatsCardsProps {
  stats: StudentStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
  if (isLoading) {
    return (
      <StatsGrid columns={4}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </StatsGrid>
    );
  }

  const classEntries = Object.entries(stats.classCounts).sort();

  const mainStats = [
    {
      title: 'Toplam Öğrenci',
      value: stats.total,
      subtitle: `${stats.female} Kız, ${stats.male} Erkek`,
      icon: Users,
      gradient: MODERN_GRADIENTS.blue,
    },
    {
      title: 'Düşük Risk',
      value: stats.lowRisk,
      subtitle: `${stats.total > 0 ? ((stats.lowRisk / stats.total) * 100).toFixed(1) : 0}% öğrenci`,
      icon: UserCheck,
      gradient: MODERN_GRADIENTS.green,
    },
    {
      title: 'Orta Risk',
      value: stats.mediumRisk,
      subtitle: `${stats.total > 0 ? ((stats.mediumRisk / stats.total) * 100).toFixed(1) : 0}% öğrenci`,
      icon: AlertTriangle,
      gradient: MODERN_GRADIENTS.amber,
    },
    {
      title: 'Yüksek Risk',
      value: stats.highRisk,
      subtitle: `${stats.total > 0 ? ((stats.highRisk / stats.total) * 100).toFixed(1) : 0}% öğrenci`,
      icon: UserX,
      gradient: MODERN_GRADIENTS.rose,
    },
  ];

  return (
    <div className="space-y-4">
      <StatsGrid columns={4}>
        {mainStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradient={stat.gradient}
            delay={index * 0.1}
          />
        ))}
      </StatsGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <ModernCard
          title="Sınıf Dağılımı"
          icon={GraduationCap}
          gradient={MODERN_GRADIENTS.indigo}
          delay={0.4}
        >
          <div className="flex flex-wrap gap-2">
            {classEntries.length > 0 ? (
              classEntries.map(([classNum, count]) => (
                <Badge key={classNum} variant="outline" className="text-sm">
                  {classNum}. Sınıf: <span className="font-bold ml-1">{count}</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Henüz öğrenci yok</p>
            )}
          </div>
        </ModernCard>

        <ModernCard
          title="Yeni Kayıtlar"
          icon={TrendingUp}
          gradient={MODERN_GRADIENTS.purple}
          delay={0.5}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bu hafta:</span>
              <Badge variant="secondary" className="text-sm font-bold">
                {stats.newThisWeek}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bu ay:</span>
              <Badge variant="secondary" className="text-sm font-bold">
                {stats.newThisMonth}
              </Badge>
            </div>
          </div>
        </ModernCard>
      </div>
    </div>
  );
}
