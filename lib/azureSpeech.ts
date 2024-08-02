// lib/azureSpeech.ts
import axios, { AxiosResponse } from 'axios';

const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_SUBSCRIPTION_KEY;
const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION;
const endpoint = `https://${region}.api.cognitive.microsoft.com/speechtotext/v3.2/`;

interface RecognitionResponse {
  self: string;
  model: {
    self: string;
  };
  links: {
    files: string;
  };
  properties: {
    diarizationEnabled: boolean;
    wordLevelTimestampsEnabled: boolean;
    channels: number[];
    punctuationMode: string;
    profanityFilterMode: string;
    languageIdentification: {
      candidateLocales: string[];
    };
  };
  lastActionDateTime: string;
  status: string;
  createdDateTime: string;
  locale: string;
  displayName: string;
}

export const startAsyncRecognition = async (audioUrl: string): Promise<RecognitionResponse> => {
  const headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  };

  const body = {
    contentUrls: [audioUrl],
    locale: 'en-US',
    displayName: 'My Transcription',
    model: null,
    properties: {
      wordLevelTimestampsEnabled: true,
      languageIdentification: {
        candidateLocales: ['en-US', 'de-DE', 'es-ES'],
      },
    },
  };

  try {
    const response: AxiosResponse<RecognitionResponse> = await axios.post(`${endpoint}transcriptions`, body, { headers });
    return response.data;
  } catch (error) {
    console.error('Error starting async recognition:', error);
    throw error;
  }
};