# JSON Formatter Implementation Plan

This plan outlines the steps to implement the JSON Formatter feature following the Feature-Sliced Design (FSD) architecture and project guidelines.

## 1. Directory Structure

We will create the following directories and files:

### Feature: `src/features/json-formatter`
- `ui/`: UI components for the JSON formatter.
  - `JsonFormatter.tsx`: Main container component.
  - `JsonInput.tsx`: Input text area with validation.
  - `JsonOutput.tsx`: Output display with syntax highlighting (if possible) or simple pre tag.
  - `ControlPanel.tsx`: Buttons for Format, Minify, Copy, Clear.
- `model/`: State management and types.
  - `useJsonStore.ts`: Zustand store for managing input, output, and options.
  - `types.ts`: Type definitions.
- `lib/`: Utility functions.
  - `formatter.ts`: Logic for JSON formatting and validation.
- `index.ts`: Public API export.

### Page: `src/app/tools/json-formatter`
- `page.tsx`: The page component that nests the feature.

## 2. Implementation Steps

### Step 1: Create Feature Skeleton
- Create the directory structure `src/features/json-formatter`.
- Create `model/types.ts` and `model/useJsonStore.ts`.
- Create `lib/formatter.ts` with basic `format` and `minify` functions.

### Step 2: Implement UI Components
- Create `ui/JsonInput.tsx` using `shadcn/ui` Textarea.
- Create `ui/JsonOutput.tsx` for displaying results.
- Create `ui/ControlPanel.tsx` with Buttons from `shared/ui/button`.
- Assemble them in `ui/JsonFormatter.tsx`.

### Step 3: Global Component Logic
- Connect the UI components to `useJsonStore`.
- Handle errors (invalid JSON) gracefully with toast notifications (`sonner`).

### Step 4: Create Page
- Create `src/app/tools/json-formatter/page.tsx`.
- Import `JsonFormatter` from `features/json-formatter`.
- Add SEO metadata (title, description).

### Step 5: Update Home Page & Navigation
- Update `src/app/page.tsx`:
  - Change status of JSON Formatter to `available`.
- Update `src/widgets/tools-grid/ui/ToolsGrid.tsx`:
  - Wrap `ToolCard` in `Link` to enable navigation to `/tools/[id]`.

## 3. Tech Stack Details
- **State**: Zustand (for managing JSON content across components).
- **Styling**: Tailwind CSS 4.
- **Validation**: Manual JSON.parse + try-catch.
- **Icons**: Heroicons (via `lucide-react` or similar if available, or just text/emoji as per existing).

## 4. Verification
- Verify formatting works for valid JSON.
- Verify error message for invalid JSON.
- Verify "Copy to Clipboard" functionality.
- Verify responsive design.
