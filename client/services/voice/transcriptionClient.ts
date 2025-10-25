import { apiClient } from '@/lib/api/api-client';
import { VOICE_ENDPOINTS } from '@/lib/constants/api-endpoints';

export interface TranscriptionResult {
  transcription: {
    text: string;
    provider: string;
    confidence?: number;
    duration?: number;
  };
  analysis: {
    summary: string;
    keywords: string[];
    category: string;
    sentiment: string;
    riskLevel: string;
    riskKeywords: string[];
    urgentAction: boolean;
    recommendations: string[];
  };
}

export interface VoiceProviderInfo {
  provider: string;
  useBrowserAPI: boolean;
}

export interface TranscribeOptions {
  audioData?: string;
  mimeType?: string;
  browserTranscription?: string;
  studentId?: string;
  sessionType?: 'INDIVIDUAL' | 'GROUP' | 'PARENT' | 'OTHER';
}

export class TranscriptionClient {
  async getProvider(): Promise<VoiceProviderInfo> {
    try {
      const response = await apiClient.get<{ success: boolean; data: VoiceProviderInfo }>(
        '/api/voice-transcription/provider'
      );

      if (response?.data) {
        return response.data;
      }

      return { provider: 'browser', useBrowserAPI: true };
    } catch (error) {
      console.error('Provider kontrol hatası:', error);
      return { provider: 'browser', useBrowserAPI: true };
    }
  }

  async transcribe(options: TranscribeOptions): Promise<TranscriptionResult> {
    const response = await apiClient.post<{ success: boolean; data: TranscriptionResult }>(
      VOICE_ENDPOINTS.TRANSCRIBE,
      options
    );

    return response.data;
  }

  async transcribeFromBrowser(
    text: string,
    studentId?: string,
    sessionType?: string
  ): Promise<TranscriptionResult> {
    return this.transcribe({
      browserTranscription: text,
      studentId,
      sessionType: sessionType as any,
    });
  }

  async transcribeFromAudio(
    audioBlob: Blob,
    studentId?: string,
    sessionType?: string
  ): Promise<TranscriptionResult> {
    const base64Audio = await this.blobToBase64(audioBlob);

    return this.transcribe({
      audioData: base64Audio,
      mimeType: audioBlob.type,
      studentId,
      sessionType: sessionType as any,
    });
  }

  async analyzeText(text: string): Promise<TranscriptionResult['analysis']> {
    const response = await apiClient.post<{ success: boolean; data: TranscriptionResult['analysis'] }>(
      '/api/voice-transcription/analyze-only',
      { text }
    );

    return response.data;
  }

  async autoFillForm(transcriptionText: string, sessionType?: string): Promise<any> {
    const response = await apiClient.post<{ success: boolean; data: any }>(
      '/api/voice-transcription/auto-fill-form',
      { transcriptionText, sessionType }
    );

    return response.data;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };

      reader.onerror = () => reject(new Error('Dosya okunamadı'));

      reader.readAsDataURL(blob);
    });
  }
}

export const transcriptionClient = new TranscriptionClient();
