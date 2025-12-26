import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MarkdownState, MarkdownDocument, DocumentStats, Template } from "./types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_CONTENT = `# Markdown Editor에 오신 것을 환영합니다

여기에 마크다운을 작성하세요...

## 기능
- **굵은 글씨**와 *기울임 글씨*
- 목록과 체크박스
- 구문 강조가 적용된 코드 블록
- 실시간 미리보기

## 예제 코드

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

> 인용문도 지원합니다.

---

즐거운 작성 되세요!
`;

export const useMarkdownStore = create<MarkdownState>()(
  persist(
    (set, get) => ({
      currentDocumentId: null,
      content: DEFAULT_CONTENT,
      title: "제목 없음",
      documents: [],
      isAutoSaveEnabled: true,
      lastSavedAt: null,

      setContent: (content) => set({ content }),
      setTitle: (title) => set({ title }),

      createDocument: (title = "제목 없음", templateContent) => {
        const id = generateId();
        const now = Date.now();
        const newDoc: MarkdownDocument = {
          id,
          title,
          content: templateContent || DEFAULT_CONTENT,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          documents: [newDoc, ...state.documents],
          currentDocumentId: id,
          content: newDoc.content,
          title: newDoc.title,
          lastSavedAt: now,
        }));
        return id;
      },

      saveDocument: () => {
        const { currentDocumentId, content, title, documents } = get();
        const now = Date.now();

        if (currentDocumentId) {
          set({
            documents: documents.map((doc) =>
              doc.id === currentDocumentId
                ? { ...doc, content, title, updatedAt: now }
                : doc
            ),
            lastSavedAt: now,
          });
        } else {
          get().createDocument(title, content);
        }
      },

      loadDocument: (id) => {
        const doc = get().documents.find((d) => d.id === id);
        if (doc) {
          set({
            currentDocumentId: id,
            content: doc.content,
            title: doc.title,
          });
        }
      },

      deleteDocument: (id) => {
        const { documents, currentDocumentId } = get();
        const newDocs = documents.filter((d) => d.id !== id);
        set({
          documents: newDocs,
          ...(currentDocumentId === id && {
            currentDocumentId: null,
            content: DEFAULT_CONTENT,
            title: "제목 없음",
          }),
        });
      },

      renameDocument: (id, title) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, title } : doc
          ),
          ...(state.currentDocumentId === id && { title }),
        }));
      },

      applyTemplate: (template) => {
        set({
          content: template.content,
          title: template.nameKo,
          currentDocumentId: null,
          lastSavedAt: null,
        });
      },

      toggleAutoSave: () =>
        set((state) => ({ isAutoSaveEnabled: !state.isAutoSaveEnabled })),

      getStats: () => {
        const { content } = get();
        const characters = content.length;
        const charactersNoSpaces = content.replace(/\s/g, "").length;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const lines = content.split("\n").length;
        const readingTime = Math.max(1, Math.ceil(words / 200));

        return { characters, charactersNoSpaces, words, lines, readingTime };
      },

      clearAll: () =>
        set({
          documents: [],
          currentDocumentId: null,
          content: DEFAULT_CONTENT,
          title: "제목 없음",
          lastSavedAt: null,
        }),
    }),
    {
      name: "markdown-editor-storage",
      partialize: (state) => ({
        documents: state.documents,
        isAutoSaveEnabled: state.isAutoSaveEnabled,
      }),
    }
  )
);
