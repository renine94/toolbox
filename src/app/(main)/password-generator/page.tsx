import { Metadata } from "next";
import { PasswordGenerator } from "@/features/tools/password-generator";

export const metadata: Metadata = {
  title: "Password Generator | Toolbox",
  description:
    "안전한 랜덤 비밀번호를 생성합니다. 길이, 문자 유형, 특수문자 등 다양한 옵션을 설정할 수 있습니다.",
};

export default function PasswordGeneratorPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Password Generator</h1>
        <p className="text-muted-foreground mt-2">
          안전한 랜덤 비밀번호를 생성합니다. 길이, 문자 유형 등 다양한 옵션을
          설정할 수 있습니다.
        </p>
      </div>
      <PasswordGenerator />
    </div>
  );
}
