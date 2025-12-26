export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  readingTime: number; // minutes
}

export type ExportFormat = "markdown" | "html" | "pdf";

export type TemplateType =
  | "blank"
  | "blog-post"
  | "readme"
  | "resume"
  | "meeting-notes"
  | "api-docs";

export interface Template {
  id: TemplateType;
  name: string;
  nameKo: string;
  description: string;
  content: string;
}

export interface MarkdownState {
  // Current document
  currentDocumentId: string | null;
  content: string;
  title: string;

  // Saved documents (persisted)
  documents: MarkdownDocument[];

  // UI state
  isAutoSaveEnabled: boolean;
  lastSavedAt: number | null;

  // Actions
  setContent: (content: string) => void;
  setTitle: (title: string) => void;

  // Document management
  createDocument: (title?: string, templateContent?: string) => string;
  saveDocument: () => void;
  loadDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, title: string) => void;

  // Template
  applyTemplate: (template: Template) => void;

  // Settings
  toggleAutoSave: () => void;

  // Utils
  getStats: () => DocumentStats;
  clearAll: () => void;
}
