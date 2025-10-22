import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIStatusIndicatorProps {
  className?: string;
}

export default function AIStatusIndicator({ className }: AIStatusIndicatorProps) {
  const { data: status, isLoading } = useQuery({
    queryKey: ['/api/ai-status'],
    queryFn: async () => {
      const response = await fetch('/api/ai-status');
      if (!response.ok) throw new Error('Failed to fetch AI status');
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("gap-1.5", className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="hidden md:inline">Kontrol ediliyor...</span>
      </Badge>
    );
  }

  const isHealthy = status?.status === 'healthy';

  return (
    <Badge
      variant={isHealthy ? "default" : "destructive"}
      className={cn("gap-1.5", className)}
    >
      {isHealthy ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      <span className="hidden md:inline">
        AI: {status?.provider || 'N/A'}
      </span>
      <span className="md:hidden">AI</span>
    </Badge>
  );
}