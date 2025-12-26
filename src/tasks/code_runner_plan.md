# Code Runner Implementation Plan

This plan outlines the steps to implement the Code Runner feature following the Feature-Sliced Design (FSD) architecture and project guidelines.

## 결정 사항
- **코드 에디터**: Monaco Editor (VS Code 기반)
- **지원 언어**: JavaScript, Python
- **실행 방식**: 클라이언트 사이드 (JS: Web Worker, Python: Pyodide)

## 1. Directory Structure

We will create the following directories and files:

### Feature: `src/features/code-runner`
- `ui/`: UI components for the code runner.
  - `CodeRunner.tsx`: Main container component.
  - `CodeEditor.tsx`: Monaco Editor 기반 코드 입력 영역.
  - `CodeOutput.tsx`: Output display for execution results and errors.
  - `LanguageSelector.tsx`: JavaScript/Python 언어 선택 드롭다운.
  - `ControlPanel.tsx`: Buttons for Run, Clear, Copy.
- `model/`: State management and types.
  - `useCodeStore.ts`: Zustand store for managing code, output, and language state.
  - `types.ts`: Type definitions.
- `lib/`: Utility functions.
  - `executor.ts`: Code execution logic (JavaScript via Web Worker, Python via Pyodide).
- `index.ts`: Public API export.

### Page: `src/app/code-runner`
- `page.tsx`: The page component that nests the feature.

## 2. Implementation Steps

### Step 1: Install Dependencies
- Install code editor library and Python runtime:
  ```bash
  npm install @monaco-editor/react pyodide
  ```

### Step 2: Create Feature Skeleton
- Create the directory structure `src/features/code-runner`.
- Create `model/types.ts` with language and execution result types.
- Create `model/useCodeStore.ts` with Zustand store.
- Create `lib/executor.ts` with execution logic.

### Step 3: Implement UI Components
- Create `ui/LanguageSelector.tsx`:
  - Dropdown supporting JavaScript and Python.
  - Language icons (JS: yellow, Python: blue/green).
- Create `ui/CodeEditor.tsx`:
  - Monaco Editor integration (@monaco-editor/react).
  - Syntax highlighting based on selected language.
  - Line numbers, minimap, auto-completion.
  - Dark/Light theme support.
- Create `ui/CodeOutput.tsx`:
  - Display stdout, stderr in separate sections.
  - Error highlighting (red text).
  - Execution time display.
  - Clear output button.
- Create `ui/ControlPanel.tsx`:
  - Run button (▶️) with loading spinner.
  - Clear button.
  - Copy code button.
- Assemble them in `ui/CodeRunner.tsx`.

### Step 4: Implement Code Execution Logic
- **JavaScript Execution**:
  - Function constructor for sandboxed execution.
  - Override console.log to capture output.
  - Handle runtime errors with stack trace.
  - Timeout: 5 seconds.
- **Python Execution** (`lib/executor.ts`):
  - Pyodide WebAssembly runtime.
  - Lazy loading (load on first Python execution).
  - Capture stdout/stderr via sys.stdout redirect.
  - Handle import errors gracefully.
  - Timeout: 10 seconds.

### Step 5: Create Page
- Create `src/app/code-runner/page.tsx`.
- Import `CodeRunner` from `features/code-runner`.
- Add SEO metadata (title, description).

### Step 6: Update Home Page
- Update `src/app/page.tsx`:
  - Change status of Code Runner from `coming-soon` to `available`.

## 3. Tech Stack Details
- **State**: Zustand (for managing code, output, language, and execution state).
- **Styling**: Tailwind CSS 4.
- **Editor**: Monaco Editor (VS Code's editor component).
- **Execution**:
  - JavaScript: Function constructor with sandboxed console.
  - Python: Pyodide WebAssembly runtime.
- **Icons**: Heroicons (Play, Trash, Copy).

## 4. Supported Languages
| Language | Runtime | Timeout | Features |
|----------|---------|---------|----------|
| JavaScript | Function constructor | 5s | ES6+, console.log capture |
| Python | Pyodide | 10s | Python 3.x, basic stdlib |

## 5. Security Considerations
- **Sandboxing**: JavaScript runs in isolated function scope.
- **Timeout**: Prevent infinite loops with execution timeout.
- **Memory Limit**: Terminate execution on memory overflow.

## 6. Verification
- Verify JavaScript code execution works (console.log, return values).
- Verify Python code execution works (print, basic operations).
- Verify syntax highlighting for both languages.
- Verify error messages are displayed clearly.
- Verify timeout works for infinite loops.
- Verify "Copy to Clipboard" functionality.
- Verify responsive design.

## 7. Files Created

### New Files
```
src/features/code-runner/
├── index.ts
├── ui/
│   ├── CodeRunner.tsx
│   ├── CodeEditor.tsx
│   ├── CodeOutput.tsx
│   ├── LanguageSelector.tsx
│   └── ControlPanel.tsx
├── model/
│   ├── useCodeStore.ts
│   └── types.ts
└── lib/
    └── executor.ts

src/app/code-runner/
└── page.tsx
```

### Modified Files
- `src/app/page.tsx`: Change Code Runner status to `available`
- `package.json`: Add @monaco-editor/react, pyodide dependencies
