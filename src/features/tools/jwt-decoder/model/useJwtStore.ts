import { create } from "zustand";
import type { DecodedJwt, JwtValidation } from "./types";
import { decodeJwt, validateJwt } from "../lib/jwt-utils";

interface JwtState {
  token: string;
  decoded: DecodedJwt | null;
  validation: JwtValidation | null;
  error: string | null;

  setToken: (token: string) => void;
  decode: () => void;
  clear: () => void;
  loadExample: (type: "valid" | "expired") => void;
}

export const useJwtStore = create<JwtState>((set, get) => ({
  token: "",
  decoded: null,
  validation: null,
  error: null,

  setToken: (token) => {
    set({ token });
    const { decode } = get();
    decode();
  },

  decode: () => {
    const { token } = get();

    if (!token.trim()) {
      set({ decoded: null, validation: null, error: null });
      return;
    }

    const validation = validateJwt(token);
    const decoded = decodeJwt(token);

    if (decoded) {
      set({ decoded, validation, error: null });
    } else {
      set({
        decoded: null,
        validation,
        error: "JWT 디코딩에 실패했습니다",
      });
    }
  },

  clear: () => {
    set({
      token: "",
      decoded: null,
      validation: null,
      error: null,
    });
  },

  loadExample: (type) => {
    const examples = {
      valid:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      expired:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyLCJpYXQiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ",
    };

    const { setToken } = get();
    setToken(examples[type]);
  },
}));
