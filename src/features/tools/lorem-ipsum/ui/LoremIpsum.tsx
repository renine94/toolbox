"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useLoremIpsumStore } from "../model/useLoremIpsumStore";
import { GeneratorOptions } from "./GeneratorOptions";
import { OutputPanel } from "./OutputPanel";

export function LoremIpsum() {
  const generate = useLoremIpsumStore((state) => state.generate);

  // 초기 렌더링 시 자동 생성
  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      {/* 옵션 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>옵션</CardTitle>
          <CardDescription>
            생성할 텍스트의 형식과 양을 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GeneratorOptions />
        </CardContent>
      </Card>

      {/* 출력 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>Lorem Ipsum</CardTitle>
          <CardDescription>생성된 더미 텍스트</CardDescription>
        </CardHeader>
        <CardContent>
          <OutputPanel />
        </CardContent>
      </Card>
    </div>
  );
}
