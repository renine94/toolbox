import { ExecutionResult, Language } from "../model/types";

const JS_TIMEOUT = 5000;
const PYTHON_TIMEOUT = 10000;

let pyodide: unknown = null;
let pyodideLoading: Promise<unknown> | null = null;

// JavaScript execution using Function constructor with console capture
export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  const logs: string[] = [];
  const errors: string[] = [];

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        stdout: logs.join("\n"),
        stderr: errors.join("\n"),
        error: "Execution timeout: Code took longer than 5 seconds",
        executionTime: JS_TIMEOUT,
      });
    }, JS_TIMEOUT);

    try {
      // Create sandboxed console
      const sandboxConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
        error: (...args: unknown[]) => errors.push(args.map(String).join(" ")),
        warn: (...args: unknown[]) => logs.push("[WARN] " + args.map(String).join(" ")),
        info: (...args: unknown[]) => logs.push("[INFO] " + args.map(String).join(" ")),
      };

      // Execute code with sandboxed console
      const wrappedCode = `(function(console) {
          "use strict";
          ${code}
        })`;

      const fn = new Function("console", `return ${wrappedCode}`);
      const result = fn()(sandboxConsole);

      if (result !== undefined) {
        logs.push(`=> ${String(result)}`);
      }

      clearTimeout(timeoutId);
      resolve({
        stdout: logs.join("\n"),
        stderr: errors.join("\n"),
        error: null,
        executionTime: performance.now() - startTime,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const errorMessage = err instanceof Error ? err.message : String(err);
      resolve({
        stdout: logs.join("\n"),
        stderr: errors.join("\n"),
        error: errorMessage,
        executionTime: performance.now() - startTime,
      });
    }
  });
}

// Load Pyodide dynamically
async function loadPyodideRuntime(): Promise<unknown> {
  if (pyodide) return pyodide;

  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = (async () => {
    // Load pyodide script dynamically
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadPyodideFn = (window as any).loadPyodide;
      if (!loadPyodideFn) {
        throw new Error("Pyodide not available");
      }

      pyodide = await loadPyodideFn({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      return pyodide;
    }

    throw new Error("Pyodide can only be loaded in browser environment");
  })();

  return pyodideLoading;
}

// Python execution using Pyodide
export async function executePython(
  code: string,
  onLoadingStart?: () => void,
  onLoadingEnd?: () => void
): Promise<ExecutionResult> {
  const startTime = performance.now();

  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        stdout: "",
        stderr: "",
        error: "Execution timeout: Code took longer than 10 seconds",
        executionTime: PYTHON_TIMEOUT,
      });
    }, PYTHON_TIMEOUT);

    try {
      onLoadingStart?.();
      const py = (await loadPyodideRuntime()) as any;
      onLoadingEnd?.();

      // Capture stdout
      py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      // Execute user code
      const result = await py.runPythonAsync(code);

      // Get captured output
      const stdout = py.runPython("sys.stdout.getvalue()") as string;
      const stderr = py.runPython("sys.stderr.getvalue()") as string;

      // Reset stdout/stderr
      py.runPython(`
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      clearTimeout(timeoutId);

      let output = stdout;
      if (result !== undefined && result !== null) {
        output += (output ? "\n" : "") + `=> ${String(result)}`;
      }

      resolve({
        stdout: output,
        stderr,
        error: null,
        executionTime: performance.now() - startTime,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      onLoadingEnd?.();
      const errorMessage = err instanceof Error ? err.message : String(err);
      resolve({
        stdout: "",
        stderr: "",
        error: errorMessage,
        executionTime: performance.now() - startTime,
      });
    }
  });
}

// Main execute function
export async function executeCode(
  code: string,
  language: Language,
  onPyodideLoadingStart?: () => void,
  onPyodideLoadingEnd?: () => void
): Promise<ExecutionResult> {
  if (!code.trim()) {
    return {
      stdout: "",
      stderr: "",
      error: "No code to execute",
      executionTime: 0,
    };
  }

  switch (language) {
    case "javascript":
      return executeJavaScript(code);
    case "python":
      return executePython(code, onPyodideLoadingStart, onPyodideLoadingEnd);
    default:
      return {
        stdout: "",
        stderr: "",
        error: `Unsupported language: ${language}`,
        executionTime: 0,
      };
  }
}
