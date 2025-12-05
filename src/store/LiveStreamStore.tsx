import { create } from 'zustand';

export type StreamPlatform = 'youtube' | 'livepeer';

interface LiveStreamState {
  isStreamActive: boolean;
  isMinimized: boolean;
  platform: StreamPlatform;
  videoId: string; // YouTube video ID or Livepeer playback ID
  embedUrl: string; // Full embed URL for Livepeer
  streamTitle: string;
  description: string;
  liveSessionId: string; // For chat functionality
  startStream: (platform: StreamPlatform, videoId: string, title: string, description: string, liveSessionId?: string) => void;
  closeStream: () => void;
  minimizeStream: () => void;
  maximizeStream: () => void;
}

export const useLiveStreamStore = create<LiveStreamState>((set) => ({
  isStreamActive: false,
  isMinimized: false,
  platform: 'youtube',
  videoId: '',
  embedUrl: '',
  streamTitle: '',
  description: '',
  liveSessionId: '',
  
  startStream: (platform, videoId, title, description, liveSessionId = '') => {
    // For Livepeer, use the correct iframe embed URL format
    const embedUrl = platform === 'livepeer' 
      ? `https://lvpr.tv?v=${videoId}&autoplay=true`
      : '';
    
    set({ 
      isStreamActive: true, 
      isMinimized: false,
      platform,
      videoId,
      embedUrl,
      streamTitle: title,
      description: description,
      liveSessionId
    });
  },
  
  closeStream: () => 
    set({ 
      isStreamActive: false, 
      isMinimized: false,
      platform: 'youtube',
      videoId: '',
      embedUrl: '',
      streamTitle: '',
      description: '',
      liveSessionId: ''
    }),
  
  minimizeStream: () => 
    set({ isMinimized: true }),
  
  maximizeStream: () => 
    set({ isMinimized: false }),
}));
