import { Theme } from '../model/types';

// 각 테마의 배경색과 텍스트 색상 정의
export interface ThemeColors {
  background: string;
  foreground: string;
  lineNumber: string;
  lineNumberBg: string;
  cursor: string;
  selection: string;
  // 창 프레임 색상
  windowBg: string;
  windowBorder: string;
  windowButtonClose: string;
  windowButtonMinimize: string;
  windowButtonMaximize: string;
}

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  'github-dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    lineNumber: '#6e7681',
    lineNumberBg: '#0d1117',
    cursor: '#58a6ff',
    selection: '#264f78',
    windowBg: '#161b22',
    windowBorder: '#30363d',
    windowButtonClose: '#f85149',
    windowButtonMinimize: '#f0883e',
    windowButtonMaximize: '#3fb950',
  },
  'github-dark-dimmed': {
    background: '#22272e',
    foreground: '#adbac7',
    lineNumber: '#636e7b',
    lineNumberBg: '#22272e',
    cursor: '#539bf5',
    selection: '#3d4f5f',
    windowBg: '#2d333b',
    windowBorder: '#444c56',
    windowButtonClose: '#f47067',
    windowButtonMinimize: '#daa520',
    windowButtonMaximize: '#57ab5a',
  },
  dracula: {
    background: '#282a36',
    foreground: '#f8f8f2',
    lineNumber: '#6272a4',
    lineNumberBg: '#282a36',
    cursor: '#f8f8f2',
    selection: '#44475a',
    windowBg: '#21222c',
    windowBorder: '#44475a',
    windowButtonClose: '#ff5555',
    windowButtonMinimize: '#f1fa8c',
    windowButtonMaximize: '#50fa7b',
  },
  monokai: {
    background: '#272822',
    foreground: '#f8f8f2',
    lineNumber: '#90908a',
    lineNumberBg: '#272822',
    cursor: '#f8f8f2',
    selection: '#49483e',
    windowBg: '#1e1f1c',
    windowBorder: '#3e3d32',
    windowButtonClose: '#f92672',
    windowButtonMinimize: '#e6db74',
    windowButtonMaximize: '#a6e22e',
  },
  'vs-dark': {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    lineNumber: '#858585',
    lineNumberBg: '#1e1e1e',
    cursor: '#aeafad',
    selection: '#264f78',
    windowBg: '#252526',
    windowBorder: '#3c3c3c',
    windowButtonClose: '#e81123',
    windowButtonMinimize: '#ffb900',
    windowButtonMaximize: '#16c60c',
  },
  'atom-one-dark': {
    background: '#282c34',
    foreground: '#abb2bf',
    lineNumber: '#4b5263',
    lineNumberBg: '#282c34',
    cursor: '#528bff',
    selection: '#3e4451',
    windowBg: '#21252b',
    windowBorder: '#181a1f',
    windowButtonClose: '#e06c75',
    windowButtonMinimize: '#e5c07b',
    windowButtonMaximize: '#98c379',
  },
  nord: {
    background: '#2e3440',
    foreground: '#d8dee9',
    lineNumber: '#4c566a',
    lineNumberBg: '#2e3440',
    cursor: '#88c0d0',
    selection: '#434c5e',
    windowBg: '#3b4252',
    windowBorder: '#4c566a',
    windowButtonClose: '#bf616a',
    windowButtonMinimize: '#ebcb8b',
    windowButtonMaximize: '#a3be8c',
  },
  'tokyo-night': {
    background: '#1a1b26',
    foreground: '#a9b1d6',
    lineNumber: '#3b4261',
    lineNumberBg: '#1a1b26',
    cursor: '#c0caf5',
    selection: '#283457',
    windowBg: '#16161e',
    windowBorder: '#292e42',
    windowButtonClose: '#f7768e',
    windowButtonMinimize: '#e0af68',
    windowButtonMaximize: '#9ece6a',
  },
};

/**
 * highlight.js 테마 CSS를 동적으로 주입
 * 각 테마에 맞는 스타일 반환
 */
export function getThemeStyles(theme: Theme): string {
  const colors = THEME_COLORS[theme];

  // 기본 highlight.js 클래스 스타일 정의
  const baseStyles: Record<Theme, string> = {
    'github-dark': `
      .hljs { color: #c9d1d9; }
      .hljs-comment, .hljs-quote { color: #8b949e; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #ff7b72; }
      .hljs-string, .hljs-addition { color: #a5d6ff; }
      .hljs-number { color: #79c0ff; }
      .hljs-function, .hljs-title { color: #d2a8ff; }
      .hljs-variable, .hljs-template-variable { color: #ffa657; }
      .hljs-type, .hljs-class { color: #ffa657; }
      .hljs-attr, .hljs-attribute { color: #79c0ff; }
      .hljs-built_in { color: #ffa657; }
      .hljs-symbol, .hljs-bullet { color: #a5d6ff; }
      .hljs-params { color: #c9d1d9; }
    `,
    'github-dark-dimmed': `
      .hljs { color: #adbac7; }
      .hljs-comment, .hljs-quote { color: #768390; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #f47067; }
      .hljs-string, .hljs-addition { color: #96d0ff; }
      .hljs-number { color: #6cb6ff; }
      .hljs-function, .hljs-title { color: #dcbdfb; }
      .hljs-variable, .hljs-template-variable { color: #f69d50; }
      .hljs-type, .hljs-class { color: #f69d50; }
      .hljs-attr, .hljs-attribute { color: #6cb6ff; }
      .hljs-built_in { color: #f69d50; }
      .hljs-symbol, .hljs-bullet { color: #96d0ff; }
      .hljs-params { color: #adbac7; }
    `,
    dracula: `
      .hljs { color: #f8f8f2; }
      .hljs-comment, .hljs-quote { color: #6272a4; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #ff79c6; }
      .hljs-string, .hljs-addition { color: #f1fa8c; }
      .hljs-number { color: #bd93f9; }
      .hljs-function, .hljs-title { color: #50fa7b; }
      .hljs-variable, .hljs-template-variable { color: #f8f8f2; }
      .hljs-type, .hljs-class { color: #8be9fd; }
      .hljs-attr, .hljs-attribute { color: #50fa7b; }
      .hljs-built_in { color: #8be9fd; }
      .hljs-symbol, .hljs-bullet { color: #ffb86c; }
      .hljs-params { color: #ffb86c; }
    `,
    monokai: `
      .hljs { color: #f8f8f2; }
      .hljs-comment, .hljs-quote { color: #75715e; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #f92672; }
      .hljs-string, .hljs-addition { color: #e6db74; }
      .hljs-number { color: #ae81ff; }
      .hljs-function, .hljs-title { color: #a6e22e; }
      .hljs-variable, .hljs-template-variable { color: #f8f8f2; }
      .hljs-type, .hljs-class { color: #66d9ef; }
      .hljs-attr, .hljs-attribute { color: #a6e22e; }
      .hljs-built_in { color: #66d9ef; }
      .hljs-symbol, .hljs-bullet { color: #ae81ff; }
      .hljs-params { color: #fd971f; }
    `,
    'vs-dark': `
      .hljs { color: #d4d4d4; }
      .hljs-comment, .hljs-quote { color: #6a9955; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #569cd6; }
      .hljs-string, .hljs-addition { color: #ce9178; }
      .hljs-number { color: #b5cea8; }
      .hljs-function, .hljs-title { color: #dcdcaa; }
      .hljs-variable, .hljs-template-variable { color: #9cdcfe; }
      .hljs-type, .hljs-class { color: #4ec9b0; }
      .hljs-attr, .hljs-attribute { color: #9cdcfe; }
      .hljs-built_in { color: #4ec9b0; }
      .hljs-symbol, .hljs-bullet { color: #d7ba7d; }
      .hljs-params { color: #9cdcfe; }
    `,
    'atom-one-dark': `
      .hljs { color: #abb2bf; }
      .hljs-comment, .hljs-quote { color: #5c6370; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #c678dd; }
      .hljs-string, .hljs-addition { color: #98c379; }
      .hljs-number { color: #d19a66; }
      .hljs-function, .hljs-title { color: #61afef; }
      .hljs-variable, .hljs-template-variable { color: #e06c75; }
      .hljs-type, .hljs-class { color: #e5c07b; }
      .hljs-attr, .hljs-attribute { color: #d19a66; }
      .hljs-built_in { color: #e5c07b; }
      .hljs-symbol, .hljs-bullet { color: #56b6c2; }
      .hljs-params { color: #abb2bf; }
    `,
    nord: `
      .hljs { color: #d8dee9; }
      .hljs-comment, .hljs-quote { color: #616e88; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #81a1c1; }
      .hljs-string, .hljs-addition { color: #a3be8c; }
      .hljs-number { color: #b48ead; }
      .hljs-function, .hljs-title { color: #88c0d0; }
      .hljs-variable, .hljs-template-variable { color: #d8dee9; }
      .hljs-type, .hljs-class { color: #8fbcbb; }
      .hljs-attr, .hljs-attribute { color: #8fbcbb; }
      .hljs-built_in { color: #81a1c1; }
      .hljs-symbol, .hljs-bullet { color: #ebcb8b; }
      .hljs-params { color: #d8dee9; }
    `,
    'tokyo-night': `
      .hljs { color: #a9b1d6; }
      .hljs-comment, .hljs-quote { color: #565f89; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag { color: #bb9af7; }
      .hljs-string, .hljs-addition { color: #9ece6a; }
      .hljs-number { color: #ff9e64; }
      .hljs-function, .hljs-title { color: #7aa2f7; }
      .hljs-variable, .hljs-template-variable { color: #c0caf5; }
      .hljs-type, .hljs-class { color: #2ac3de; }
      .hljs-attr, .hljs-attribute { color: #7dcfff; }
      .hljs-built_in { color: #2ac3de; }
      .hljs-symbol, .hljs-bullet { color: #e0af68; }
      .hljs-params { color: #c0caf5; }
    `,
  };

  return `
    .code-preview-container {
      background: ${colors.background};
      color: ${colors.foreground};
    }
    .code-line-number {
      color: ${colors.lineNumber};
      background: ${colors.lineNumberBg};
    }
    .code-cursor {
      background: ${colors.cursor};
    }
    ${baseStyles[theme]}
  `;
}

/**
 * 테마 색상 가져오기
 */
export function getThemeColors(theme: Theme): ThemeColors {
  return THEME_COLORS[theme];
}
