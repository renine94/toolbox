"use client";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { Upload, Trash2, Clock, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useQRStore } from "../model/useQRStore";
import { INPUT_TYPE_OPTIONS } from "../model/types";

export function SavedQRCodes() {
  const { savedQRCodes, loadQRCode, deleteQRCode, clearSavedQRCodes } =
    useQRStore();

  const handleLoad = (id: string, name: string) => {
    loadQRCode(id);
    toast.success(`"${name}" QR 코드를 불러왔습니다.`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteQRCode(id);
    toast.success(`"${name}" QR 코드가 삭제되었습니다.`);
  };

  const handleClearAll = () => {
    clearSavedQRCodes();
    toast.success("모든 저장된 QR 코드가 삭제되었습니다.");
  };

  const getInputTypeLabel = (type: string) => {
    return INPUT_TYPE_OPTIONS.find((opt) => opt.value === type)?.label ?? type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (savedQRCodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <QrCode className="h-12 w-12 mb-4 opacity-50" />
        <p>저장된 QR 코드가 없습니다.</p>
        <p className="text-sm mt-1">QR 코드를 만들고 저장해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {savedQRCodes.length}개 저장됨
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              전체 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>전체 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                모든 저장된 QR 코드를 삭제하시겠습니까? 이 작업은 취소할 수
                없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                전체 삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="h-[280px]">
        <div className="space-y-2">
          {savedQRCodes.map((qr) => (
            <div
              key={qr.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{qr.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-muted">
                    {getInputTypeLabel(qr.config.inputType)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(qr.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLoad(qr.id, qr.name)}
                  title="불러오기"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>QR 코드 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        &quot;{qr.name}&quot; QR 코드를 삭제하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(qr.id, qr.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
