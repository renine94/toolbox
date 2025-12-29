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
import { usePasswordStore } from "../model/usePasswordStore";
import { PasswordDisplay } from "./PasswordDisplay";
import { PasswordOptions } from "./PasswordOptions";
import { BulkPasswordList } from "./BulkPasswordList";

export function PasswordGenerator() {
  const generate = usePasswordStore((state) => state.generate);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>비밀번호</CardTitle>
            <CardDescription>
              안전한 랜덤 비밀번호를 생성합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>옵션</CardTitle>
            <CardDescription>비밀번호 생성 옵션을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordOptions />
            <div className="mt-6">
              <Button onClick={generate} className="w-full">
                새 비밀번호 생성
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>벌크 생성</CardTitle>
          <CardDescription>
            여러 개의 비밀번호를 한 번에 생성합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulkPasswordList />
        </CardContent>
      </Card>
    </div>
  );
}
