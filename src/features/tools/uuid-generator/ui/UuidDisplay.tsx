"use client";

import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useUuidStore } from "../model/useUuidStore";
import { copyToClipboard } from "../lib/uuid-utils";
import { toast } from "sonner";

export function UuidDisplay() {
  const currentUuid = useUuidStore((state) => state.currentUuid);
  const config = useUuidStore((state) => state.config);
  const generate = useUuidStore((state) => state.generate);

  const handleCopy = async () => {
    if (!currentUuid) {
      toast.error("복사할 UUID가 없습니다");
      return;
    }
    const success = await copyToClipboard(currentUuid);
    if (success) {
      toast.success("클립보드에 복사되었습니다");
    } else {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="text"
              value={currentUuid}
              readOnly
              placeholder="생성 버튼을 클릭하세요"
              className="w-full px-4 py-3 text-lg font-mono bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          disabled={!currentUuid}
          title="복사"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button onClick={generate} size="icon" title="새로 생성">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>버전: {config.version.toUpperCase()}</span>
        <span>길이: {currentUuid.length}자</span>
      </div>
    </div>
  );
}
