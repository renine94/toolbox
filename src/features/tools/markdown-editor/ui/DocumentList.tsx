"use client";

import { useState } from "react";
import { useMarkdownStore } from "../model/useMarkdownStore";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  FileText,
  Trash2,
  Plus,
  FolderOpen,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

export function DocumentList() {
  const {
    documents,
    currentDocumentId,
    loadDocument,
    deleteDocument,
    renameDocument,
    createDocument,
  } = useMarkdownStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleLoad = (id: string) => {
    loadDocument(id);
    toast.success("문서를 불러왔습니다");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDocument(id);
    toast.success("문서가 삭제되었습니다");
  };

  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameDocument(id, editTitle.trim());
      toast.success("문서 이름이 변경되었습니다");
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleNewDocument = () => {
    createDocument();
    toast.success("새 문서가 생성되었습니다");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            저장된 문서
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewDocument}
            className="h-7 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            새 문서
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            저장된 문서가 없습니다
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleLoad(doc.id)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                currentDocumentId === doc.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
            >
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editingId === doc.id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-6 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(doc.id, e as unknown as React.MouseEvent);
                        if (e.key === "Escape") handleCancelEdit(e as unknown as React.MouseEvent);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => handleSaveEdit(doc.id, e)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(doc.updatedAt)}
                    </p>
                  </>
                )}
              </div>
              {editingId !== doc.id && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => handleStartEdit(doc.id, doc.title, e)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => handleDelete(doc.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
