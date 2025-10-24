import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIStatusIndicatorProps {
  className?: string;
  collapsed?: boolean;
}

export default function AIStatusIndicator({ className, collapsed = false }: AIStatusIndicatorProps) {
  const { data: status, isLoading, error } = useQuery({
    queryKey: ['/api/ai-status'],
    queryFn: async () => {
      const response = await fetch('/api/ai-status');
      if (!response.ok) throw new Error('Failed to fetch AI status');
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Sarı - Bağlantı kontrol ediliyor
  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("gap-1.5 border-yellow-500 bg-yellow-50 text-yellow-700", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        {!collapsed && (
          <>
            <span className="hidden md:inline">Kontrol ediliyor...</span>
            <span className="md:hidden">AI</span>
          </>
        )}
      </Badge>
    );
  }

  // Kırmızı - AI devre dışı veya hata var
  if (error || !status?.isActive) {
    return (
      <Badge variant="destructive" className={cn("gap-1.5", className)}>
        <AlertCircle className="h-3 w-3" />
        {!collapsed && (
          <>
            <span className="hidden md:inline">AI Devre Dışı</span>
            <span className="md:hidden">AI</span>
          </>
        )}
      </Badge>
    );
  }

  // Yeşil - AI aktif ve sağlıklı
  return (
    <Badge
      className={cn("gap-1.5 border-green-500 bg-green-50 text-green-700", className)}
    >
      <CheckCircle2 className="h-3 w-3" />
      {!collapsed && (
        <>
          <span className="hidden md:inline">
            AI: {status.providerName || status.provider || 'Aktif'}
          </span>
          <span className="md:hidden">AI</span>
        </>
      )}
    </Badge>
  );
}