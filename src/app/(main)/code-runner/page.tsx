import { Metadata } from "next";
import { CodeRunner } from "@/features/tools/code-runner";

export const metadata: Metadata = {
  title: "Code Runner | AI Tools",
  description:
    "JavaScript, Python 등 다양한 언어의 코드를 브라우저에서 직접 실행합니다.",
};

export default function CodeRunnerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Runner</h1>
          <p className="text-muted-foreground">
            JavaScript, Python 등 다양한 언어의 코드를 브라우저에서 직접
            실행합니다.
          </p>
        </div>
        <CodeRunner />
      </main>
    </div>
  );
}
