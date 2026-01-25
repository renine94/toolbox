import html2canvas from 'html2canvas-pro';
import GIF from 'gif.js';

export interface GifGeneratorOptions {
  width: number;
  height?: number; // 자동 계산되지만 명시 가능
  typingSpeed: number;
  onProgress?: (progress: number) => void;
  quality?: number; // 1-30, lower is better quality
  dither?: boolean; // 디더링 사용 여부 (FloydSteinberg)
  workers?: number;
  codeContainerElement?: HTMLElement | null; // 코드 컨테이너 (minHeight 설정용)
  setCaptureMinHeight?: (height: number | null) => void; // minHeight 설정 함수
}

/**
 * GIF 생성기
 * html2canvas로 각 프레임을 캡처하고 gif.js로 GIF 생성
 */
export async function generateTypingGif(
  containerElement: HTMLElement,
  codeLength: number,
  setCharIndex: (index: number) => Promise<void>,
  options: GifGeneratorOptions
): Promise<Blob> {
  const {
    width,
    typingSpeed,
    onProgress,
    quality = 10,
    dither = true,
    workers = 4,
    codeContainerElement,
    setCaptureMinHeight,
  } = options;

  // 1. 먼저 전체 코드를 렌더링하여 최대 높이 측정
  await setCharIndex(codeLength);
  await delay(50); // 렌더링 완료 대기

  // 코드 컨테이너의 실제 높이를 측정 (padding 제외한 내부 콘텐츠 높이)
  const codeContainerHeight = codeContainerElement?.scrollHeight ?? 0;

  // 2. minHeight를 설정하여 빈 공간도 테마 배경색으로 채움
  if (setCaptureMinHeight && codeContainerHeight > 0) {
    setCaptureMinHeight(codeContainerHeight);
    await delay(20); // 스타일 적용 대기
  }

  const rect = containerElement.getBoundingClientRect();
  const targetWidth = width;
  const targetHeight = Math.round(rect.height * (width / rect.width));

  // 3. 다시 처음으로 리셋
  await setCharIndex(0);
  await delay(10);

  // GIF 인스턴스 생성 (전체 코드 기준 높이로 설정)
  const gif = new GIF({
    workers,
    quality,
    width: targetWidth,
    height: targetHeight,
    workerScript: '/gif.worker.js',
    dither: dither ? 'FloydSteinberg' : false, // 디더링으로 색상 품질 향상
  });

  // 프레임 수 계산 (각 문자당 1프레임은 너무 많으므로 샘플링)
  const totalChars = codeLength;
  const frameSamplingRate = Math.max(1, Math.floor(typingSpeed / 30)); // 30ms당 1프레임
  const frameCount = Math.ceil(totalChars / frameSamplingRate) + 10; // 마지막에 몇 프레임 추가

  let capturedFrames = 0;

  // 시작 상태 캡처 (빈 화면 몇 프레임)
  for (let i = 0; i < 3; i++) {
    await setCharIndex(0);
    await delay(10);
    const canvas = await captureFrame(containerElement, targetWidth, targetHeight);
    gif.addFrame(canvas, { delay: 100 });
    capturedFrames++;
    onProgress?.(Math.round((capturedFrames / frameCount) * 50));
  }

  // 타이핑 애니메이션 캡처
  for (let charIndex = 0; charIndex <= totalChars; charIndex += frameSamplingRate) {
    await setCharIndex(Math.min(charIndex, totalChars));
    await delay(10); // 렌더링 대기

    const canvas = await captureFrame(containerElement, targetWidth, targetHeight);
    gif.addFrame(canvas, { delay: typingSpeed * frameSamplingRate });
    capturedFrames++;
    onProgress?.(Math.round((capturedFrames / frameCount) * 50));
  }

  // 마지막 프레임 (완성된 상태) 몇 프레임 유지
  await setCharIndex(totalChars);
  await delay(10);
  for (let i = 0; i < 5; i++) {
    const canvas = await captureFrame(containerElement, targetWidth, targetHeight);
    gif.addFrame(canvas, { delay: 500 }); // 마지막은 오래 유지
  }

  // GIF 렌더링
  return new Promise((resolve, reject) => {
    gif.on('progress', (p) => {
      onProgress?.(50 + Math.round(p * 50)); // 50-100%
    });

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    gif.on('abort', () => {
      reject(new Error('GIF generation was aborted'));
    });

    try {
      gif.render();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * HTML 요소를 고해상도로 캡처하고 타겟 크기 캔버스에 배치
 * - scale: 2로 고해상도 캡처 후 다운샘플링 (선명도 향상)
 * - 캡처된 이미지가 타겟보다 작으면 상단 정렬로 배치
 */
async function captureFrame(
  element: HTMLElement,
  targetWidth: number,
  targetHeight: number
): Promise<HTMLCanvasElement> {
  // scale: 2로 고해상도 캡처
  const originalCanvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2, // 고해상도 캡처
    logging: false,
    useCORS: true,
  });

  // 타겟 크기 캔버스 생성
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = targetWidth;
  resultCanvas.height = targetHeight;

  const ctx = resultCanvas.getContext('2d');
  if (ctx) {
    // 배경 투명 유지 (GIF에서는 첫 프레임 기준)
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // 고품질 다운샘플링 설정
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 원본 캔버스를 타겟 너비에 맞춰 비율 유지하며 그리기
    const scale = targetWidth / originalCanvas.width;
    const drawHeight = originalCanvas.height * scale;

    // 상단 정렬로 그리기 (타이핑이 위에서 아래로 진행되므로)
    ctx.drawImage(
      originalCanvas,
      0, 0, originalCanvas.width, originalCanvas.height,
      0, 0, targetWidth, drawHeight
    );
  }

  return resultCanvas;
}

/**
 * 지연 함수
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GIF 파일 크기 예상 (대략적인 추정)
 * gif.js quality: 1 = 최고 품질(큰 파일), 10+ = 낮은 품질(작은 파일)
 */
export function estimateGifSize(
  width: number,
  height: number,
  frameCount: number,
  quality: number
): string {
  // 매우 대략적인 추정 - 실제 크기는 압축률에 따라 다름
  const pixelsPerFrame = width * height;
  const bytesPerPixel = 0.3; // GIF 압축 후 대략적인 값
  // quality가 낮을수록(1) 더 좋은 품질 = 더 큰 파일
  const qualityFactor = (12 - quality) / 10; // quality 1 → 1.1, quality 10 → 0.2
  const estimatedBytes = pixelsPerFrame * bytesPerPixel * frameCount * qualityFactor;

  if (estimatedBytes < 1024) {
    return `${Math.round(estimatedBytes)} B`;
  } else if (estimatedBytes < 1024 * 1024) {
    return `${Math.round(estimatedBytes / 1024)} KB`;
  } else {
    return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * GIF 생성 예상 시간 (대략적인 추정)
 * - html2canvas 캡처: 프레임당 약 100-300ms
 * - GIF 인코딩: 프레임당 약 50-200ms (quality에 따라)
 */
export function estimateGenerationTime(
  frameCount: number,
  quality: number,
  dither: boolean
): string {
  // 프레임당 기본 시간 (html2canvas 캡처 + DOM 렌더링 대기)
  const captureTimePerFrame = 200; // ms
  // GIF 인코딩 시간 (quality가 낮을수록 더 많은 처리)
  const encodingTimePerFrame = 100 * ((12 - quality) / 10); // quality 1 → 110ms, quality 10 → 20ms
  // 디더링 추가 시간
  const ditherMultiplier = dither ? 1.5 : 1.0;
  // GIF 최종 렌더링 시간 (전체 프레임 처리)
  const finalRenderTime = frameCount * 30;

  const estimatedMs = frameCount * (captureTimePerFrame + encodingTimePerFrame * ditherMultiplier) + finalRenderTime;

  if (estimatedMs < 1000) {
    return '< 1초';
  } else if (estimatedMs < 60000) {
    return `약 ${Math.round(estimatedMs / 1000)}초`;
  } else {
    const minutes = Math.floor(estimatedMs / 60000);
    const seconds = Math.round((estimatedMs % 60000) / 1000);
    return `약 ${minutes}분 ${seconds}초`;
  }
}

/**
 * Blob을 다운로드
 */
export function downloadGif(blob: Blob, filename: string = 'code-typing.gif'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
