# Color Picker Implementation Plan

This plan outlines the steps to implement the Color Picker feature following the Feature-Sliced Design (FSD) architecture and project guidelines.

## 1. Directory Structure

We will create the following directories and files:

### Feature: `src/features/color-picker`
- `ui/`: UI components for the color picker.
  - `ColorPicker.tsx`: Main container component.
  - `ColorCanvas.tsx`: The interactive color selection area (using `react-colorful` or custom implementation).
  - `ColorInputs.tsx`: Inputs for HEX, RGB, HSL values.
  - `ColorPalette.tsx`: Predefined or history of colors.
- `model/`: State management and types.
  - `useColorStore.ts`: Zustand store for managing current color state.
  - `types.ts`: Type definitions (RGB, HSL, HEX types).
- `lib/`: Utility functions.
  - `color-utils.ts`: Conversion functions (hexToRgb, rgbToHsl, etc.) - or use a library like `colord` if permissible, otherwise implement basic ones.
- `index.ts`: Public API export.

### Page: `src/app/tools/color-picker`
- `page.tsx`: The page component that nests the feature.

## 2. Implementation Steps

### Step 1: Install Dependencies
- Install `react-colorful` (lightweight color picker component) and `colord` (tiny color manipulation library) for robust handling.
  ```bash
  npm install react-colorful colord
  ```

### Step 2: Create Feature Skeleton
- Create the directory structure `src/features/color-picker`.
- Create `model/types.ts` and `model/useColorStore.ts` to hold the selected color.
- Create `lib/color-utils.ts` (if wrapping `colord`).

### Step 3: Implement UI Components
- Create `ui/ColorCanvas.tsx` integrating `react-colorful`.
- Create `ui/ColorInputs.tsx`:
  - Input fields for HEX, RGB, HSL.
  - sync changes between inputs and the store.
- Create `ui/ColorPalette.tsx`:
  - Simple grid of suggested colors.
  - Click to set color.
- Assemble them in `ui/ColorPicker.tsx`.

### Step 4: Create Page
- Create `src/app/tools/color-picker/page.tsx`.
- Import `ColorPicker` from `features/color-picker`.
- Add SEO metadata (title, description).

### Step 5: Update Navigation
- Update `src/widgets/developer-section/ui/DeveloperSection.tsx` (or appropriate grid component) to link the "Color Picker" card to `/tools/color-picker`.

## 3. Tech Stack Details
- **State**: Zustand (for syncing color state between picker and inputs).
- **Styling**: Tailwind CSS 4.
- **Libraries**: `react-colorful` (UI), `colord` (Logic).
- **Icons**: Copy icon for values.

## 4. Verification
- Verify picking a color updates all inputs.
- Verify changing an input (e.g., HEX) updates the picker and other inputs.
- Verify "Copy to Clipboard" works for all formats.
- Verify responsive layout.
