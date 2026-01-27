import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // FSD (Feature-Sliced Design) 아키텍처 경계 규칙
  {
    plugins: {
      boundaries,
    },
    settings: {
      // FSD 레이어 정의 (mode: "folder"로 폴더 단위 매칭)
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**", mode: "folder" },
        { type: "widgets", pattern: "src/widgets/*", mode: "folder" },
        { type: "features", pattern: "src/features/**", mode: "folder" },
        { type: "entities", pattern: "src/entities/*", mode: "folder" },
        { type: "shared", pattern: "src/shared/**", mode: "folder" },
        // 인프라 레이어 (모든 레이어에서 접근 가능)
        { type: "i18n", pattern: "src/i18n/**", mode: "file" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"],
    },
    rules: {
      // FSD 레이어 간 의존성 규칙
      "boundaries/element-types": [
        "error",
        {
          // 기본: 모든 레이어 간 import 금지
          default: "disallow",
          rules: [
            // app → 모든 하위 레이어 + i18n 허용
            {
              from: "app",
              allow: ["widgets", "features", "entities", "shared", "i18n"],
            },
            // widgets → widgets(같은 레이어), features, entities, shared, i18n 허용 (app 금지)
            {
              from: "widgets",
              allow: ["widgets", "features", "entities", "shared", "i18n"],
            },
            // features → entities, shared, i18n 허용 (app, widgets 금지)
            {
              from: "features",
              allow: ["entities", "shared", "i18n"],
            },
            // entities → shared, i18n 허용
            {
              from: "entities",
              allow: ["shared", "i18n"],
            },
            // shared → 자기 자신 + i18n 허용 (모든 상위 레이어 import 불가)
            {
              from: "shared",
              allow: ["shared", "i18n"],
            },
            // i18n → shared만 허용 (순환 의존성 방지)
            {
              from: "i18n",
              allow: ["shared"],
            },
          ],
        },
      ],
      // 정의되지 않은 요소 import 시 경고
      "boundaries/no-unknown": "warn",
    },
  },
]);

export default eslintConfig;
