import { useState, useRef, useEffect, useCallback } from 'react';

type RecognitionState = 'idle' | 'listening' | 'processing' | 'error';

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
}

interface UseSpeechRecognitionReturn {
  state: RecognitionState;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { language = 'tr-TR', continuous = true } = options;

  const [state, setState] = useState<RecognitionState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setState('listening');
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript;

          if (result.isFinal) {
            finalTranscriptRef.current += transcriptText + ' ';
          } else {
            currentInterim += transcriptText;
          }
        }

        setTranscript(finalTranscriptRef.current.trim());
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMessages: Record<string, string> = {
          'not-allowed': 'Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından izin verin.',
          'no-speech': 'Ses algılanamadı. Lütfen tekrar deneyin.',
          'audio-capture': 'Mikrofon bulunamadı.',
          'network': 'Ağ hatası oluştu.',
          'aborted': 'Ses kaydı iptal edildi.',
        };

        const errorMessage = errorMessages[event.error] || `Hata: ${event.error}`;
        setError(errorMessage);
        setState('error');
      };

      recognition.onend = () => {
        if (state === 'listening') {
          setState('idle');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language, continuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;

    if (state === 'listening') return;

    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setError('Ses kaydı başlatılamadı.');
      setState('error');
    }
  }, [isSupported, state]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || state !== 'listening') return;

    try {
      setState('processing');
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Speech recognition stop failed:', err);
      setState('idle');
    }
  }, [state]);

  const reset = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setState('idle');
  }, []);

  return {
    state,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    reset,
  };
}
