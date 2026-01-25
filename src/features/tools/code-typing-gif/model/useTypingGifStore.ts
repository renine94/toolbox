'use client';

import { create } from 'zustand';
import {
  TypingGifSettings,
  DEFAULT_SETTINGS,
  PlaybackState,
  GifGenerationState,
  SupportedLanguage,
  Theme,
  CursorStyle,
  WindowStyle,
  GifQualityPreset,
  DEFAULT_CODE_TEMPLATES,
} from './types';

interface TypingGifState {
  // 코드 입력
  code: string;

  // 설정
  settings: TypingGifSettings;

  // 애니메이션 상태
  playbackState: PlaybackState;
  currentCharIndex: number;
  progress: number; // 0-100

  // GIF 생성 상태
  gifState: GifGenerationState;
  gifProgress: number; // 0-100
  generatedGifUrl: string | null;
  estimatedSize: string;

  // 액션
  setCode: (code: string) => void;
  setLanguage: (language: SupportedLanguage) => void;
  setTheme: (theme: Theme) => void;
  setTypingSpeed: (speed: number) => void;
  setCursorStyle: (style: CursorStyle) => void;
  setWindowStyle: (style: WindowStyle) => void;
  setFontSize: (size: number) => void;
  setGifWidth: (width: number) => void;
  setShowLineNumbers: (show: boolean) => void;
  setCursorBlinkSpeed: (speed: number) => void;
  setGifQuality: (quality: GifQualityPreset) => void;
  updateSettings: (settings: Partial<TypingGifSettings>) => void;

  // 재생 컨트롤
  play: () => void;
  pause: () => void;
  reset: () => void;
  setCurrentCharIndex: (index: number) => void;
  setPlaybackState: (state: PlaybackState) => void;

  // GIF 생성
  startGifGeneration: () => void;
  setGifProgress: (progress: number) => void;
  completeGifGeneration: (url: string) => void;
  failGifGeneration: () => void;
  resetGifGeneration: () => void;

  // 유틸
  loadTemplate: () => void;
}

export const useTypingGifStore = create<TypingGifState>((set, get) => ({
  // 초기 상태
  code: DEFAULT_CODE_TEMPLATES.javascript,
  settings: DEFAULT_SETTINGS,
  playbackState: 'idle',
  currentCharIndex: 0,
  progress: 0,
  gifState: 'idle',
  gifProgress: 0,
  generatedGifUrl: null,
  estimatedSize: '',

  // 코드 설정
  setCode: (code) => set({ code }),

  // 개별 설정 액션
  setLanguage: (language) =>
    set((state) => ({
      settings: { ...state.settings, language },
    })),

  setTheme: (theme) =>
    set((state) => ({
      settings: { ...state.settings, theme },
    })),

  setTypingSpeed: (typingSpeed) =>
    set((state) => ({
      settings: { ...state.settings, typingSpeed },
    })),

  setCursorStyle: (cursorStyle) =>
    set((state) => ({
      settings: { ...state.settings, cursorStyle },
    })),

  setWindowStyle: (windowStyle) =>
    set((state) => ({
      settings: { ...state.settings, windowStyle },
    })),

  setFontSize: (fontSize) =>
    set((state) => ({
      settings: { ...state.settings, fontSize },
    })),

  setGifWidth: (gifWidth) =>
    set((state) => ({
      settings: { ...state.settings, gifWidth },
    })),

  setShowLineNumbers: (showLineNumbers) =>
    set((state) => ({
      settings: { ...state.settings, showLineNumbers },
    })),

  setCursorBlinkSpeed: (cursorBlinkSpeed) =>
    set((state) => ({
      settings: { ...state.settings, cursorBlinkSpeed },
    })),

  setGifQuality: (gifQuality) =>
    set((state) => ({
      settings: { ...state.settings, gifQuality },
    })),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // 재생 컨트롤
  play: () => set({ playbackState: 'playing' }),

  pause: () => set({ playbackState: 'paused' }),

  reset: () =>
    set({
      playbackState: 'idle',
      currentCharIndex: 0,
      progress: 0,
    }),

  setCurrentCharIndex: (index) => {
    const { code } = get();
    const progress = code.length > 0 ? Math.round((index / code.length) * 100) : 0;
    set({ currentCharIndex: index, progress });
  },

  setPlaybackState: (playbackState) => set({ playbackState }),

  // GIF 생성
  startGifGeneration: () =>
    set({
      gifState: 'generating',
      gifProgress: 0,
      generatedGifUrl: null,
    }),

  setGifProgress: (gifProgress) => set({ gifProgress }),

  completeGifGeneration: (url) =>
    set({
      gifState: 'completed',
      gifProgress: 100,
      generatedGifUrl: url,
    }),

  failGifGeneration: () =>
    set({
      gifState: 'error',
      gifProgress: 0,
      generatedGifUrl: null,
    }),

  resetGifGeneration: () =>
    set({
      gifState: 'idle',
      gifProgress: 0,
      generatedGifUrl: null,
    }),

  // 템플릿 로드
  loadTemplate: () => {
    const { settings } = get();
    const template = DEFAULT_CODE_TEMPLATES[settings.language];
    set({ code: template, currentCharIndex: 0, progress: 0, playbackState: 'idle' });
  },
}));
