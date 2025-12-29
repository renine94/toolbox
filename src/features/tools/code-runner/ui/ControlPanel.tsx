"use client";

import { Button } from "@/shared/ui/button";
import { useCodeStore } from "../model/useCodeStore";
import { executeCode } from "../lib/executor";
import { toast } from "sonner";

export function ControlPanel() {
  const {
    code,
    language,
    isRunning,
    setOutput,
    setIsRunning,
    setIsPyodideLoading,
    clear,
  } = useCodeStore();

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to run");
      return;
    }

    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(
        code,
        language,
        () => setIsPyodideLoading(true),
        () => setIsPyodideLoading(false)
      );
      setOutput(result);

      if (result.error) {
        toast.error("Execution failed");
      } else {
        toast.success(`Executed in ${result.executionTime.toFixed(2)}ms`);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleClear = () => {
    clear();
    toast.success("Code cleared");
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleRun}
        disabled={isRunning}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isRunning ? (
          <>
            <span className="animate-spin mr-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
            Running...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Run
          </>
        )}
      </Button>
      <Button variant="outline" onClick={handleCopy} disabled={isRunning}>
        <svg
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy
      </Button>
      <Button variant="outline" onClick={handleClear} disabled={isRunning}>
        <svg
          className="h-4 w-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
        </svg>
        Clear
      </Button>
    </div>
  );
}
