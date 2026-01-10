"use client";

import { Copy, Trash2, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useUuidStore } from "../model/useUuidStore";
import { copyToClipboard } from "../lib/uuid-utils";
import { toast } from "sonner";

export function BulkUuidList() {
  const config = useUuidStore((state) => state.config);
  const bulkUuids = useUuidStore((state) => state.bulkUuids);
  const setQuantity = useUuidStore((state) => state.setQuantity);
  const generateBulk = useUuidStore((state) => state.generateBulk);
  const clearBulk = useUuidStore((state) => state.clearBulk);

  const handleCopyAll = async () => {
    if (bulkUuids.length === 0) {
      toast.error("복사할 UUID가 없습니다");
      return;
    }
    const text = bulkUuids.map((item) => item.uuid).join("\n");
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${bulkUuids.length}개의 UUID가 복사되었습니다`);
    } else {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleCopySingle = async (uuid: string) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      toast.success("클립보드에 복사되었습니다");
    } else {
      toast.error("복사에 실패했습니다");
    }
  };

  const handleDownload = () => {
    if (bulkUuids.length === 0) {
      toast.error("다운로드할 UUID가 없습니다");
      return;
    }
    const text = bulkUuids.map((item) => item.uuid).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${config.version}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("파일이 다운로드되었습니다");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">생성 개수</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            value={config.quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-24"
          />
        </div>
        <Button onClick={generateBulk}>벌크 생성</Button>
        {bulkUuids.length > 0 && (
          <>
            <Button variant="outline" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-2" />
              전체 복사
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
            <Button variant="ghost" onClick={clearBulk}>
              <Trash2 className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </>
        )}
      </div>

      {bulkUuids.length > 0 && (
        <ScrollArea className="h-[300px] rounded-lg border">
          <div className="p-4 space-y-2">
            {bulkUuids.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted group"
              >
                <span className="text-sm text-muted-foreground w-8">
                  {index + 1}.
                </span>
                <code className="flex-1 text-sm font-mono">{item.uuid}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopySingle(item.uuid)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {bulkUuids.length === 0 && (
        <div className="h-[100px] flex items-center justify-center text-muted-foreground border rounded-lg">
          생성 개수를 입력하고 벌크 생성 버튼을 클릭하세요
        </div>
      )}
    </div>
  );
}
