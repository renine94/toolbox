"use client";

import { useMemo } from "react";
import { Copy, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
import { STANDARD_CLAIMS, ALGORITHMS } from "../model/types";
import {
  formatJson,
  copyToClipboard,
  formatDate,
  getRelativeTime,
} from "../lib/jwt-utils";
import { cn } from "@/shared/lib/utils";

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} 복사 완료`);
    } else {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy}>
      <Copy className="w-4 h-4" />
    </Button>
  );
}

function JsonBlock({
  data,
  colorClass,
}: {
  data: unknown;
  colorClass: string;
}) {
  const formatted = formatJson(data);
  return (
    <pre
      className={cn(
        "text-sm font-mono p-4 rounded-lg bg-muted overflow-x-auto",
        colorClass
      )}
    >
      {formatted}
    </pre>
  );
}

function ClaimInfo({ payload, currentTime }: { payload: Record<string, unknown>; currentTime: number }) {
  const timeFields = ["exp", "iat", "nbf"];

  const processedClaims = useMemo(() => {
    return Object.entries(payload).map(([key, value]) => {
      const claimInfo = STANDARD_CLAIMS[key];
      const isTimeField = timeFields.includes(key);

      let displayValue: string;
      if (isTimeField && typeof value === "number") {
        const date = new Date(value * 1000);
        displayValue = `${formatDate(date)} (${getRelativeTime(date)})`;
      } else if (typeof value === "object") {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = String(value);
      }

      const isExpired = key === "exp" && typeof value === "number" && value * 1000 < currentTime;

      return { key, value, claimInfo, displayValue, isExpired };
    });
  }, [payload, currentTime]);

  return (
    <div className="space-y-2 mt-4 pt-4 border-t">
      <p className="text-sm font-medium flex items-center gap-2">
        <Clock className="w-4 h-4" />
        클레임 정보
      </p>
      <div className="grid gap-2">
        {processedClaims.map(({ key, claimInfo, displayValue, isExpired }) => (
          <div
            key={key}
            className={cn(
              "flex items-start gap-2 text-sm p-2 rounded",
              isExpired ? "bg-destructive/10" : "bg-muted/50"
            )}
          >
            <Badge variant="outline" className="shrink-0 font-mono">
              {key}
            </Badge>
            <div className="flex-1 min-w-0">
              {claimInfo && (
                <span className="text-muted-foreground text-xs block">
                  {claimInfo.description}
                </span>
              )}
              <span
                className={cn(
                  "break-all",
                  isExpired && "text-destructive"
                )}
              >
                {displayValue}
                {isExpired && (
                  <AlertCircle className="inline w-4 h-4 ml-1 text-destructive" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JwtDisplay() {
  const { decoded } = useJwtStore();
  const currentTime = useMemo(() => Date.now(), [decoded]);

  if (!decoded) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>JWT 토큰을 입력하면</p>
            <p>디코딩된 결과가 여기에 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const algorithmInfo = ALGORITHMS[decoded.header.alg];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-500 flex items-center gap-2">
              Header
              <Badge variant="outline">{decoded.header.alg}</Badge>
            </CardTitle>
            <CopyButton
              text={formatJson(decoded.header)}
              label="Header"
            />
          </div>
          {algorithmInfo && (
            <CardDescription>
              {algorithmInfo.name} - {algorithmInfo.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <JsonBlock data={decoded.header} colorClass="text-purple-600 dark:text-purple-400" />
        </CardContent>
      </Card>

      {/* Payload */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-500 flex items-center gap-2">
              Payload
              {decoded.isExpired ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  만료됨
                </Badge>
              ) : decoded.expiresAt ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  유효
                </Badge>
              ) : null}
            </CardTitle>
            <CopyButton
              text={formatJson(decoded.payload)}
              label="Payload"
            />
          </div>
          <CardDescription>
            토큰에 담긴 데이터 (Claims)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JsonBlock data={decoded.payload} colorClass="text-blue-600 dark:text-blue-400" />
          <ClaimInfo payload={decoded.payload as Record<string, unknown>} currentTime={currentTime} />
        </CardContent>
      </Card>

      {/* Signature */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-orange-500">Signature</CardTitle>
            <CopyButton text={decoded.signature} label="Signature" />
          </div>
          <CardDescription>
            서명 (검증은 서버 측에서만 가능)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono p-4 rounded-lg bg-muted text-orange-600 dark:text-orange-400 break-all">
            {decoded.signature}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
