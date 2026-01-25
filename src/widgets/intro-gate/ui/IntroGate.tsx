"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  shouldReduceMotion,
  shouldShowIntro,
  markIntroAsShown,
  INTRO_DURATION,
  FADEOUT_DURATION,
} from "../lib/intro-animations";

interface IntroGateProps {
  children: ReactNode;
}

export function IntroGate({ children }: IntroGateProps) {
  const t = useTranslations("introGate");
  const [showIntro, setShowIntro] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 인트로 종료 핸들러
  const handleDismiss = useCallback(() => {
    if (isExiting) return;

    setIsExiting(true);
    markIntroAsShown();

    // 페이드아웃 후 완전히 제거
    setTimeout(() => {
      setShowIntro(false);
    }, FADEOUT_DURATION);
  }, [isExiting]);

  // 마운트 시 인트로 표시 여부 결정
  useEffect(() => {
    setMounted(true);

    // 애니메이션 감소 선호 시 즉시 스킵
    if (shouldReduceMotion()) {
      markIntroAsShown();
      return;
    }

    // sessionStorage 체크
    if (shouldShowIntro()) {
      setShowIntro(true);
    }
  }, []);

  // 스크롤 잠금
  useEffect(() => {
    if (showIntro && !isExiting) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntro, isExiting]);

  // 자동 종료 타이머
  useEffect(() => {
    if (!showIntro || isExiting) return;

    const timer = setTimeout(handleDismiss, INTRO_DURATION);
    return () => clearTimeout(timer);
  }, [showIntro, isExiting, handleDismiss]);

  // 키보드 이벤트 (ESC로 스킵)
  useEffect(() => {
    if (!showIntro || isExiting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showIntro, isExiting, handleDismiss]);

  // SSR에서 hydration mismatch 방지
  if (!mounted) {
    return <>{children}</>;
  }

  // 인트로 미표시 - children만 렌더링
  if (!showIntro) {
    return <>{children}</>;
  }

  // 인트로 표시 중 - children은 숨기고 인트로만 표시
  return (
    <>
      {/* 인트로 오버레이 - 완전 불투명 배경 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("ariaLabel")}
        onClick={handleDismiss}
        className={`
          fixed inset-0 z-[100] flex flex-col items-center justify-center
          bg-background
          cursor-pointer select-none
          transition-opacity duration-500
          ${isExiting ? "opacity-0" : "opacity-100"}
        `}
      >
        {/* 배경 그라디언트 효과 (장식용) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 상단 그라디언트 */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          {/* 하단 그라디언트 */}
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div
          className={`
            relative z-10 flex flex-col items-center gap-6
            transition-all duration-700 ease-out
            ${isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
        >
          {/* 로고 */}
          <div className="relative">
            {/* 글로우 효과 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"
                style={{ animationDuration: "2s" }}
              />
            </div>

            {/* 로고 아이콘 */}
            <div className="relative text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
              🧰
            </div>
          </div>

          {/* 브랜드명 */}
          <h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 dark:from-violet-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: "200% 100%",
              animation: "gradient-x 3s ease infinite",
            }}
          >
            ToolBox
          </h1>

          {/* 태그라인 */}
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-md px-4">
            {t("tagline")}
          </p>
        </div>

        {/* 스킵 힌트 */}
        <div
          className={`
            absolute bottom-8 left-0 right-0 flex justify-center
            transition-opacity duration-500 delay-1000
            ${isExiting ? "opacity-0" : "opacity-100"}
          `}
        >
          <p className="text-sm text-muted-foreground/60 animate-pulse">
            {t("skipHint")}
          </p>
        </div>
      </div>

      {/* 그라디언트 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
}
