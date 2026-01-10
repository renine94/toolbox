"use client";

import { Button } from "@/shared/ui/button";
import { Loader2, Play, Copy, Trash2 } from "lucide-react";
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
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Run
          </>
        )}
      </Button>
      <Button variant="outline" onClick={handleCopy} disabled={isRunning}>
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button variant="outline" onClick={handleClear} disabled={isRunning}>
        <Trash2 className="h-4 w-4 mr-2" />
        Clear
      </Button>
    </div>
  );
}
