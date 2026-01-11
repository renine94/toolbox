"use client";

import { JwtInput } from "./JwtInput";
import { JwtDisplay } from "./JwtDisplay";

export function JwtDecoder() {
  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-4">
        <JwtInput />
      </div>
      <div>
        <JwtDisplay />
      </div>
    </div>
  );
}
