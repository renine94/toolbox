import { ImageEditor } from "@/features/image-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Editor | DevTools",
  description:
    "온라인 이미지 편집기. 밝기, 대비, 채도 조절, 필터 효과, 회전, 뒤집기, 크기 조절 등 다양한 이미지 편집 기능을 제공합니다.",
  keywords: [
    "이미지 편집기",
    "image editor",
    "사진 편집",
    "필터",
    "밝기 조절",
    "크기 조절",
    "이미지 변환",
  ],
};

export default function ImageEditorPage() {
  return (
    <div className="container min-h-screen py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Image Editor</h1>
        <p className="text-muted-foreground">
          이미지에 필터를 적용하고, 회전/뒤집기, 크기 조절 등 다양한 편집 기능을
          사용할 수 있습니다.
        </p>
      </div>
      <ImageEditor />
    </div>
  );
}
