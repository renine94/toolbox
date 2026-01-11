"use client";

import { ClipboardPaste, FileText, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { toast } from "sonner";
import { useJwtStore } from "../model/useJwtStore";
import { cn } from "@/shared/lib/utils";

export function JwtInput() {
  const { token, validation, setToken, clear, loadExample } = useJwtStore();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToken(text);
      toast.success("클립보드에서 붙여넣기 완료");
    } catch {
      toast.error("클립보드 접근 권한이 없습니다");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-purple-500">JWT</span> 토큰 입력
        </CardTitle>
        <CardDescription>
          디코딩할 JWT 토큰을 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="min-h-[120px] font-mono text-sm resize-none"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadExample("valid")}
          >
            <FileText className="w-4 h-4 mr-1" />
            예제 (유효)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadExample("expired")}
          >
            <FileText className="w-4 h-4 mr-1" />
            예제 (만료)
          </Button>
          <Button variant="outline" size="sm" onClick={handlePaste}>
            <ClipboardPaste className="w-4 h-4 mr-1" />
            붙여넣기
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            disabled={!token}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            초기화
          </Button>
        </div>

        {validation && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground">
              검증 상태
            </p>
            <div className="flex flex-wrap gap-2">
              {validation.isValid ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  형식 유효
                </Badge>
              ) : (
                <Badge variant="destructive">형식 오류</Badge>
              )}
              {validation.isExpired && (
                <Badge variant="destructive">토큰 만료됨</Badge>
              )}
            </div>
            {validation.errors.length > 0 && (
              <ul className="text-sm text-destructive space-y-1">
                {validation.errors.map((error, i) => (
                  <li key={i} className={cn("flex items-center gap-1")}>
                    <span className="text-destructive">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
