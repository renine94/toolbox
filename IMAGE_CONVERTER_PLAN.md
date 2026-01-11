# Image Converter 구현 계획

## 개요
다양한 이미지 포맷 간 변환을 지원하는 종합 이미지 변환 도구

**핵심 기능**:
- 다중 입력 포맷: WebP, PNG, JPEG, GIF, BMP, TIFF, AVIF, SVG
- 다중 출력 포맷: PNG, JPEG, WebP, GIF, BMP
- 품질 조절, 배경색 설정, 크기 조정
- 일괄 변환 (최대 10개 파일)
- ZIP 다운로드

---

## 파일 구조

```
src/features/tools/image-converter/
├── ui/
│   ├── ImageConverter.tsx       # 메인 컨테이너
│   ├── ConverterUploader.tsx    # 다중 파일 업로드 (드래그앤드롭)
│   ├── ImagePreview.tsx         # 업로드된 이미지 목록
│   ├── ConversionSettings.tsx   # 변환 옵션 패널
│   ├── ConversionProgress.tsx   # 진행 상태 표시
│   └── ConversionResult.tsx     # 결과 및 다운로드
├── model/
│   ├── types.ts                 # Zod 스키마 + 타입
│   └── useConverterStore.ts     # Zustand 스토어
├── lib/
│   └── converter-utils.ts       # Canvas API 유틸리티
└── index.ts                     # Public API

src/app/[locale]/(main)/image-converter/
└── page.tsx                     # 페이지 컴포넌트

messages/
├── ko.json                      # 한국어 번역 추가
└── en.json                      # 영어 번역 추가
```

---

## 구현 단계

### Phase 1: 기반 구조
1. `model/types.ts` - Zod 스키마 + 타입 정의
   - InputFormat, OutputFormat (포맷 상수)
   - ResizeOptions, ConversionOptions (변환 옵션)
   - UploadedImage (이미지 상태)
   - FILE_LIMITS, FORMAT_INFO (상수)

2. `lib/converter-utils.ts` - 유틸리티 함수
   - loadImageAsDataURL(), validateImageFile()
   - getImageSize(), calculateTargetSize()
   - convertImage() - Canvas API 변환
   - downloadImage(), downloadAllAsZip()

3. `index.ts` - Public API

### Phase 2: 상태 관리
4. `model/useConverterStore.ts` - Zustand 스토어
   - 상태: images[], options, isConverting
   - 액션: addImages, removeImage, clearImages
   - 액션: setOption, setResizeOption, resetOptions
   - 액션: convertAll, convertSingle, cancelConversion
   - 액션: downloadSingle, downloadAll, reset

### Phase 3: UI 컴포넌트
5. `ui/ConverterUploader.tsx` - 업로드 영역
   - 드래그앤드롭 + 클릭 업로드
   - 다중 파일 지원 (최대 10개)
   - 파일 유효성 검사

6. `ui/ImagePreview.tsx` - 이미지 목록
   - 썸네일 그리드
   - 파일 정보 (이름, 크기, 해상도)
   - 상태 배지 (pending, converting, completed, error)
   - 개별 삭제 버튼

7. `ui/ConversionSettings.tsx` - 설정 패널
   - 출력 포맷 선택 (Select)
   - 품질 슬라이더 (JPEG, WebP)
   - 배경색 선택기
   - 리사이즈 옵션 (모드, 비율, 크기)
   - 변환 시작/취소 버튼

8. `ui/ConversionProgress.tsx` - 진행 상태
   - 전체 진행률
   - 취소 버튼

9. `ui/ConversionResult.tsx` - 결과
   - 변환 완료 이미지 목록
   - 크기 비교 (원본 vs 변환)
   - 개별/전체 다운로드 버튼

10. `ui/ImageConverter.tsx` - 메인 컨테이너
    - 조건부 렌더링: Uploader vs Preview+Settings

### Phase 4: 페이지 + 다국어
11. `messages/ko.json`, `messages/en.json` - 번역 추가
    - metadata.tools.imageConverter
    - tools.imageConverter.ui

12. `src/app/[locale]/(main)/image-converter/page.tsx`
    - generateMetadata 함수
    - 서버 컴포넌트 + 번역 적용

13. 메인 페이지 도구 카드 추가
    - 디자이너 카테고리에 추가

### Phase 5: 검증
14. 빌드 및 테스트
    - `npx tsc --noEmit`
    - `npm run lint`
    - `npm run build`
    - 브라우저 테스트

---

## 핵심 타입

```typescript
// 포맷 정의
export const outputFormats = ["png", "jpeg", "webp", "gif", "bmp"] as const;
export type OutputFormat = (typeof outputFormats)[number];

// 리사이즈 모드
export const resizeModes = ["none", "percentage", "dimensions", "width", "height"] as const;

// 변환 옵션
export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;              // 1-100 (JPEG, WebP)
  backgroundColor: string;      // 투명 배경 처리
  preserveTransparency: boolean;
  resize: ResizeOptions;
}

// 업로드된 이미지
export interface UploadedImage {
  id: string;
  file: File;
  name: string;
  originalFormat: string;
  size: number;
  dimensions: ImageSize;
  dataUrl: string;
  status: "pending" | "converting" | "completed" | "error";
  progress: number;
  convertedDataUrl?: string;
  convertedSize?: number;
  error?: string;
}
```

---

## 번역 키 구조

### metadata.tools.imageConverter
```json
{
  "title": "Image Converter - 디자이너 도구",
  "description": "WebP, PNG, JPEG 등 다양한 이미지 포맷을 손쉽게 변환하세요.",
  "heading": "Image Converter",
  "subheading": "다양한 이미지 포맷을 손쉽게 변환하세요."
}
```

### tools.imageConverter.ui
- upload: title, description, formats, limits, selectFiles
- preview: title, fileCount, clearAll, addMore, status.*
- settings: title, outputFormat, quality, backgroundColor, resize.*, convertButton
- progress: title, processing, cancel
- result: title, original, converted, sizeSaved, downloadSingle, downloadAll
- formats: png, jpeg, webp, gif, bmp (설명 포함)
- toast: 성공/에러 메시지

---

## 의존성

### 추가 필요
```bash
npm install jszip
```
- ZIP 파일 생성 (일괄 다운로드용)

---

## 제한 사항
- 최대 파일 크기: 10MB
- 최대 이미지 크기: 4096 x 4096px
- 최대 파일 수: 10개
- 지원 입력: WebP, PNG, JPEG, GIF, BMP, TIFF, AVIF, SVG
- 지원 출력: PNG, JPEG, WebP, GIF, BMP

---

## 검증 방법
1. TypeScript 타입 체크: `npx tsc --noEmit`
2. ESLint 검사: `npm run lint`
3. 프로덕션 빌드: `npm run build`
4. 브라우저 테스트:
   - 다양한 포맷 간 변환 테스트
   - 일괄 변환 테스트
   - 크기 조정 테스트
   - 다국어 전환 (ko ↔ en)
   - 다운로드 기능 확인 (개별 + ZIP)
