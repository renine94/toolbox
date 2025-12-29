"use client";

import { Button } from "@/shared/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Minus,
  Table,
  CheckSquare,
} from "lucide-react";

interface ToolbarProps {
  onFormat: (prefix: string, suffix: string) => void;
}

export function Toolbar({ onFormat }: ToolbarProps) {
  const tools = [
    {
      icon: Bold,
      action: () => onFormat("**", "**"),
      title: "굵게 (Ctrl+B)",
    },
    {
      icon: Italic,
      action: () => onFormat("*", "*"),
      title: "기울임 (Ctrl+I)",
    },
    {
      icon: Strikethrough,
      action: () => onFormat("~~", "~~"),
      title: "취소선",
    },
    { type: "separator" },
    {
      icon: Heading1,
      action: () => onFormat("# ", ""),
      title: "제목 1",
    },
    {
      icon: Heading2,
      action: () => onFormat("## ", ""),
      title: "제목 2",
    },
    {
      icon: Heading3,
      action: () => onFormat("### ", ""),
      title: "제목 3",
    },
    { type: "separator" },
    {
      icon: List,
      action: () => onFormat("- ", ""),
      title: "순서 없는 목록",
    },
    {
      icon: ListOrdered,
      action: () => onFormat("1. ", ""),
      title: "순서 있는 목록",
    },
    {
      icon: CheckSquare,
      action: () => onFormat("- [ ] ", ""),
      title: "체크박스",
    },
    { type: "separator" },
    {
      icon: Link,
      action: () => onFormat("[", "](url)"),
      title: "링크",
    },
    {
      icon: Image,
      action: () => onFormat("![alt](", ")"),
      title: "이미지",
    },
    {
      icon: Code,
      action: () => onFormat("`", "`"),
      title: "인라인 코드",
    },
    {
      icon: Quote,
      action: () => onFormat("> ", ""),
      title: "인용",
    },
    {
      icon: Table,
      action: () =>
        onFormat(
          "\n| 제목1 | 제목2 | 제목3 |\n|-------|-------|-------|\n| 내용1 | 내용2 | 내용3 |\n",
          ""
        ),
      title: "표",
    },
    {
      icon: Minus,
      action: () => onFormat("\n---\n", ""),
      title: "구분선",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
      {tools.map((tool, index) =>
        tool.type === "separator" ? (
          <div
            key={`sep-${index}`}
            className="w-px h-6 bg-border mx-1"
          />
        ) : (
          <Button
            key={tool.title}
            variant="ghost"
            size="sm"
            onClick={tool.action}
            title={tool.title}
            className="h-8 w-8 p-0"
          >
            {tool.icon && <tool.icon className="h-4 w-4" />}
          </Button>
        )
      )}
    </div>
  );
}
