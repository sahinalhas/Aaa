import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Users, 
  TrendingUp,
  Timer,
  BarChart3
} from 'lucide-react';
import type { SessionStats } from '@/hooks/counseling/useSessionStats';

interface SessionStatsCardsProps {
  stats: SessionStats;
  isLoading?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  gradient, 
  index 
}: { 
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  gradient: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-8 w-8 bg-muted animate-pulse rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  </motion.div>
);

export default function SessionStatsCards({ stats, isLoading }: SessionStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Toplam Görüşme',
      value: stats.total,
      subtitle: `${stats.individual} bireysel, ${stats.group} grup`,
      icon: Calendar,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Aktif Görüşmeler',
      value: stats.active,
      subtitle: 'Devam eden görüşmeler',
      icon: Activity,
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      title: 'Tamamlanan',
      value: stats.completed,
      subtitle: `Bu ay: ${stats.completedThisMonth}`,
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: stats.completedThisWeek > 0 ? `+${stats.completedThisWeek} bu hafta` : undefined,
    },
    {
      title: 'Ortalama Süre',
      value: stats.averageDuration > 0 ? `${stats.averageDuration} dk` : '-',
      subtitle: stats.totalDuration > 0 
        ? `Toplam: ${Math.floor(stats.totalDuration / 60)}s ${stats.totalDuration % 60}dk`
        : 'Tamamlanan görüşme yok',
      icon: Clock,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.mostActiveDay !== '-' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  En Aktif Gün
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{stats.mostActiveDay}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Haftalık görüşme dağılımı
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {Object.keys(stats.sessionsByMode).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  Görüşme Modları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.sessionsByMode)
                    .slice(0, 3)
                    .map(([mode, count]) => (
                      <div key={mode} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{mode}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Timer className="h-4 w-4 text-green-600" />
                Bu Hafta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tamamlanan görüşme
              </p>
              {stats.completedToday > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Bugün: </span>
                  <span className="font-medium">{stats.completedToday}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
