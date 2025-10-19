import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Upload, 
  Download, 
  BarChart3, 
  Users, 
  FileSpreadsheet,
  TrendingUp,
  GitCompare,
  Zap
} from 'lucide-react';

interface QuickActionsPanelProps {
  onCreateSession?: () => void;
  onBulkImport?: () => void;
  onViewStatistics?: () => void;
  onViewTrends?: () => void;
  onCompare?: () => void;
  onExportReport?: () => void;
}

export function QuickActionsPanel({
  onCreateSession,
  onBulkImport,
  onViewStatistics,
  onViewTrends,
  onCompare,
  onExportReport
}: QuickActionsPanelProps) {
  const actions = [
    {
      icon: Plus,
      label: 'Yeni Deneme',
      description: 'Deneme sınavı oluştur',
      onClick: onCreateSession,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      icon: Upload,
      label: 'Toplu Aktar',
      description: 'Excel ile sonuç yükle',
      onClick: onBulkImport,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      icon: BarChart3,
      label: 'İstatistikler',
      description: 'Performans analizi',
      onClick: onViewStatistics,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      icon: TrendingUp,
      label: 'Trendler',
      description: 'Gelişim grafikleri',
      onClick: onViewTrends,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      borderColor: 'border-amber-200'
    },
    {
      icon: GitCompare,
      label: 'Karşılaştır',
      description: 'Deneme analizi',
      onClick: onCompare,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      borderColor: 'border-cyan-200'
    },
    {
      icon: Download,
      label: 'Rapor Al',
      description: 'PDF/Excel indir',
      onClick: onExportReport,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 hover:bg-rose-100',
      borderColor: 'border-rose-200'
    }
  ];

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
            <CardDescription className="mt-0.5">
              Sık kullanılan işlemlere hızlı erişim
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className={`h-auto flex-col gap-2 p-4 ${action.bgColor} ${action.borderColor} border-2 transition-all hover:scale-105 hover:shadow-md`}
              onClick={action.onClick}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <div className="text-center">
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
