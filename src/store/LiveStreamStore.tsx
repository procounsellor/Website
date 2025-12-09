import { create } from 'zustand';

export type StreamPlatform = 'youtube';

interface LiveStreamState {
  isStreamActive: boolean;
  platform: StreamPlatform;
  videoId: string;
  streamTitle: string;
  description: string;
  liveSessionId: string;
  counsellorId: string;
  startStream: (
    platform: StreamPlatform,
    videoId: string,
    title: string,
    description: string,
    liveSessionId: string,
    counsellorId: string
  ) => void;
  closeStream: () => void;
}

export const useLiveStreamStore = create<LiveStreamState>((set) => ({
  isStreamActive: false,
  platform: 'youtube',
  videoId: '',
  streamTitle: '',
  description: '',
  liveSessionId: '',
  counsellorId: '',
  startStream: (platform, videoId, title, description, liveSessionId, counsellorId) => {
    set({
      isStreamActive: true,
      platform,
      videoId,
      streamTitle: title,
      description,
      liveSessionId,
      counsellorId,
    });
  },
  closeStream: () => {
    set({
      isStreamActive: false,
      videoId: '',
      streamTitle: '',
      description: '',
      liveSessionId: '',
      counsellorId: '',
    });
  },
}));
