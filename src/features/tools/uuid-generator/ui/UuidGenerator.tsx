"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useUuidStore } from "../model/useUuidStore";
import { UuidDisplay } from "./UuidDisplay";
import { UuidOptions } from "./UuidOptions";
import { BulkUuidList } from "./BulkUuidList";
import { UuidHistory } from "./UuidHistory";

export function UuidGenerator() {
  const generate = useUuidStore((state) => state.generate);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>UUID 생성기</CardTitle>
            <CardDescription>
              고유한 UUID(Universally Unique Identifier)를 생성합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UuidDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>옵션</CardTitle>
            <CardDescription>UUID 생성 옵션을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <UuidOptions />
            <div className="mt-6">
              <Button onClick={generate} className="w-full">
                새 UUID 생성
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>벌크 생성</CardTitle>
          <CardDescription>
            여러 개의 UUID를 한 번에 생성합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulkUuidList />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>히스토리</CardTitle>
          <CardDescription>
            최근 생성한 UUID 목록입니다 (최대 50개)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UuidHistory />
        </CardContent>
      </Card>
    </div>
  );
}
