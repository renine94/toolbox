'use client';

/**
 * 연속 폭죽 애니메이션 버튼
 */
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/shared/ui/button';

export function ContinuousConfetti() {
  const handleComplexAnimation = () => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      // 왼쪽에서 폭죽 발사
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });

      // 오른쪽에서 폭죽 발사
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return (
    <Button onClick={handleComplexAnimation}>
      5초 연속 폭죽 버튼
    </Button>
  );
}