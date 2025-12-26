# Implementation Plan: Base64 Encoder & UI Improvements

## 1. Feature Implementation: Base64 Encoder/Decoder
- [ ] Create directory structure `src/features/base64-encoder`
  - [ ] `ui/`
  - [ ] `model/`
  - [ ] `lib/` (if needed)
  - [ ] `index.ts`
- [ ] Implement `useBase64` hook in `model/useBase64.ts` (state for input/output, encode/decode functions).
- [ ] Implement `Base64Encoder` component in `ui/Base64Encoder.tsx`.
  - [ ] Two text areas (Input/Output).
  - [ ] Buttons for Encode/Decode.
  - [ ] Clear/Copy buttons.
- [ ] Export component in `index.ts`.

## 2. Page Implementation
- [ ] Create `src/app/base64-encoder/page.tsx`.
- [ ] Import `Base64Encoder` feature.
- [ ] Add metadata (Title, Description).

## 3. UI Update: Tools Grid (Carousel/Slider)
- [ ] Install Carousel component (if using shadcn/embla) or implement custom logic.
  - *Check `package.json` for existing carousel libs.*
- [ ] Refactor `src/widgets/tools-grid/ui/ToolsGrid.tsx`.
  - [ ] Add logic to check if tools > 4.
  - [ ] If > 4, render a Carousel/Slider.
  - [ ] If <= 4, render Grid (or just always use Grid if we only want a "Show More" button, but user asked for Left/Right buttons which implies slider).
  
## 4. Integration
- [ ] Update `src/app/page.tsx`.
  - [ ] Add `base64-encoder` tool to the `Developer` category.
  - [ ] Ensure `status` is `available`.

## 5. Verification
- [ ] Check `/base64-encoder` page.
- [ ] Check Homepage UI for the slider.
