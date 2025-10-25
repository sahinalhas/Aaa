
/**
 * VoiceInputButton Component
 * Modern, responsive mikrofon butonu
 */

import { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import type { VoiceInputButtonProps } from '@/shared/types/speech.types';

export function VoiceInputButton({
  onTranscript,
  onError,
  size = 'md',
  variant = 'inline',
  language = 'tr-TR',
  continuous = true,
  disabled = false,
  className
}: VoiceInputButtonProps) {
  const [hasStarted, setHasStarted] = useState(false);

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language,
    continuous,
    interimResults: true,
    onTranscript: (text) => {
      onTranscript(text);
      setHasStarted(true);
    },
    onError
  });

  const handleClick = () => {
    if (isListening) {
      stopListening();
      if (transcript && hasStarted) {
        resetTranscript();
        setHasStarted(false);
      }
    } else {
      startListening();
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (!isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            className={cn(
              sizeClasses[size],
              'transition-all duration-200',
              isListening && 'animate-pulse shadow-lg shadow-red-500/50',
              variant === 'standalone' && 'rounded-full',
              className
            )}
            onClick={handleClick}
            disabled={disabled || !isSupported}
            aria-label={isListening ? 'Dinlemeyi durdur' : 'Mikrofonu başlat'}
          >
            {isListening ? (
              <div className="relative">
                <Mic className={cn(iconSizes[size], 'text-white')} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            ) : (
              <Mic className={iconSizes[size]} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? 'Dinlemeyi durdur' : 'Mikrofona tıklayıp konuşun'}</p>
          <p className="text-xs text-muted-foreground">Kısayol: Ctrl+Shift+S</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
