"use client";

import { useMarkdownStore } from "../model/useMarkdownStore";
import { TEMPLATES } from "../lib/templates";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  FileText,
  Newspaper,
  BookOpen,
  User,
  Users,
  Code,
  LayoutTemplate,
} from "lucide-react";
import { toast } from "sonner";

const templateIcons: Record<string, React.ReactNode> = {
  blank: <FileText className="h-4 w-4" />,
  "blog-post": <Newspaper className="h-4 w-4" />,
  readme: <BookOpen className="h-4 w-4" />,
  resume: <User className="h-4 w-4" />,
  "meeting-notes": <Users className="h-4 w-4" />,
  "api-docs": <Code className="h-4 w-4" />,
};

export function TemplateSelector() {
  const { applyTemplate } = useMarkdownStore();

  const handleApplyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      applyTemplate(template);
      toast.success(`${template.nameKo} 템플릿이 적용되었습니다`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4" />
          템플릿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TEMPLATES.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => handleApplyTemplate(template.id)}
              className="h-auto flex-col gap-1 py-2 px-3"
              title={template.description}
            >
              {templateIcons[template.id] || <FileText className="h-4 w-4" />}
              <span className="text-xs">{template.nameKo}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
