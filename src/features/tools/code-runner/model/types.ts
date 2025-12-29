export type Language = "javascript" | "python";

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error: string | null;
  executionTime: number;
}

export interface CodeState {
  code: string;
  language: Language;
  output: ExecutionResult | null;
  isRunning: boolean;
  isPyodideLoading: boolean;
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  setOutput: (output: ExecutionResult | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsPyodideLoading: (loading: boolean) => void;
  clear: () => void;
}

export const DEFAULT_CODE: Record<Language, string> = {
  javascript: `// JavaScript Example
console.log("Hello, World!");

const sum = (a, b) => a + b;
console.log("Sum:", sum(3, 5));
`,
  python: `# Python Example
print("Hello, World!")

def sum(a, b):
    return a + b

print("Sum:", sum(3, 5))
`,
};
