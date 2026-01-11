import { Metadata } from "next";
import { JwtDecoder } from "@/features/tools/jwt-decoder";

export const metadata: Metadata = {
  title: "JWT Decoder | Toolbox",
  description:
    "JWT(JSON Web Token) 토큰을 디코드하여 Header, Payload를 확인하고 유효성을 검증합니다.",
};

export default function JwtDecoderPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">JWT Decoder</h1>
        <p className="text-muted-foreground mt-2">
          JWT 토큰을 디코드하여 Header, Payload, Signature를 확인하고
          만료 시간 등 유효성을 검증합니다.
        </p>
      </div>
      <JwtDecoder />
    </div>
  );
}
