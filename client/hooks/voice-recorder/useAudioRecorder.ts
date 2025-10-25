import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderOptions {
  mimeType?: string;
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  resetRecording: () => void;
  error: string | null;
}

export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const { mimeType = 'audio/webm', onDataAvailable, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : 'audio/webm',
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event: Event) => {
        const errorMsg = 'Ses kaydı sırasında hata oluştu';
        setError(errorMsg);
        const err = new Error(errorMsg);
        onError?.(err);
        console.error('MediaRecorder error:', event);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Mikrofona erişilemedi';
      setError(errorMsg);
      onError?.(err as Error);
      throw err;
    }
  }, [mimeType, onError]);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || mimeType,
        });
        
        setAudioBlob(blob);
        setIsRecording(false);
        onDataAvailable?.(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        mediaRecorderRef.current = null;
        resolve(blob);
      };

      try {
        mediaRecorder.stop();
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err);
        setIsRecording(false);
        resolve(null);
      }
    });
  }, [isRecording, mimeType, onDataAvailable]);

  const resetRecording = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setAudioBlob(null);
    setIsRecording(false);
    setError(null);
  }, [isRecording]);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error,
  };
}
