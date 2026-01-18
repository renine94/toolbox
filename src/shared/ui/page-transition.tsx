"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { pageTransition } from "@/shared/lib/animations";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 페이지 콘텐츠 래퍼 - 더 풍부한 애니메이션
interface PageContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageContent({ children, className = "", delay = 0 }: PageContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 도구 페이지 전용 래퍼
interface ToolPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ToolPageWrapper({ children, className = "" }: ToolPageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </motion.main>
  );
}

// 섹션 진입 애니메이션
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
