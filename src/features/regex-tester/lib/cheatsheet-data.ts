export interface CheatsheetCategory {
  title: string;
  items: CheatsheetItem[];
}

export interface CheatsheetItem {
  pattern: string;
  description: string;
  example?: string;
}

export const SYNTAX_GUIDE: CheatsheetCategory[] = [
  {
    title: "메타문자",
    items: [
      { pattern: ".", description: "줄바꿈 제외 모든 문자", example: "a.c → abc, aXc" },
      { pattern: "\\d", description: "숫자 [0-9]", example: "\\d+ → 123" },
      { pattern: "\\D", description: "숫자가 아닌 문자", example: "\\D+ → abc" },
      { pattern: "\\w", description: "단어 문자 [a-zA-Z0-9_]", example: "\\w+ → hello_123" },
      { pattern: "\\W", description: "단어 문자가 아닌 문자", example: "\\W+ → @#$" },
      { pattern: "\\s", description: "공백 문자", example: "a\\sb → a b" },
      { pattern: "\\S", description: "공백이 아닌 문자", example: "\\S+ → hello" },
    ],
  },
  {
    title: "앵커",
    items: [
      { pattern: "^", description: "문자열/줄의 시작", example: "^Hello" },
      { pattern: "$", description: "문자열/줄의 끝", example: "world$" },
      { pattern: "\\b", description: "단어 경계", example: "\\bword\\b" },
      { pattern: "\\B", description: "단어 경계가 아닌 곳", example: "\\Bword" },
    ],
  },
  {
    title: "수량자",
    items: [
      { pattern: "*", description: "0회 이상", example: "ab*c → ac, abc, abbc" },
      { pattern: "+", description: "1회 이상", example: "ab+c → abc, abbc" },
      { pattern: "?", description: "0회 또는 1회", example: "ab?c → ac, abc" },
      { pattern: "{n}", description: "정확히 n회", example: "a{3} → aaa" },
      { pattern: "{n,}", description: "n회 이상", example: "a{2,} → aa, aaa" },
      { pattern: "{n,m}", description: "n회 이상 m회 이하", example: "a{2,4} → aa, aaa, aaaa" },
    ],
  },
  {
    title: "그룹 & 참조",
    items: [
      { pattern: "(abc)", description: "캡처 그룹", example: "(\\d+)-(\\d+)" },
      { pattern: "(?:abc)", description: "비캡처 그룹", example: "(?:https?://)" },
      { pattern: "(?<name>abc)", description: "명명된 캡처 그룹", example: "(?<year>\\d{4})" },
      { pattern: "\\1", description: "역참조", example: "(\\w+)\\s+\\1 → hello hello" },
      { pattern: "(a|b)", description: "OR 연산", example: "(cat|dog)" },
    ],
  },
  {
    title: "문자 클래스",
    items: [
      { pattern: "[abc]", description: "a, b, c 중 하나", example: "[aeiou]" },
      { pattern: "[^abc]", description: "a, b, c 제외", example: "[^0-9]" },
      { pattern: "[a-z]", description: "a부터 z까지", example: "[a-zA-Z]" },
      { pattern: "[0-9]", description: "0부터 9까지", example: "[0-9]+" },
    ],
  },
  {
    title: "전방탐색 & 후방탐색",
    items: [
      { pattern: "(?=abc)", description: "긍정 전방탐색", example: "\\d+(?=원)" },
      { pattern: "(?!abc)", description: "부정 전방탐색", example: "\\d+(?!%)" },
      { pattern: "(?<=abc)", description: "긍정 후방탐색", example: "(?<=\\$)\\d+" },
      { pattern: "(?<!abc)", description: "부정 후방탐색", example: "(?<!\\$)\\d+" },
    ],
  },
];

export interface PatternExample {
  name: string;
  pattern: string;
  description: string;
  testText: string;
}

export const COMMON_PATTERNS: PatternExample[] = [
  {
    name: "이메일",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    description: "이메일 주소 매칭",
    testText: "연락처: user@example.com, admin@test.co.kr",
  },
  {
    name: "URL",
    pattern: "https?://[\\w.-]+(?:/[\\w./-]*)?",
    description: "HTTP/HTTPS URL 매칭",
    testText: "사이트: https://www.example.com/path/to/page",
  },
  {
    name: "전화번호 (한국)",
    pattern: "0\\d{1,2}-\\d{3,4}-\\d{4}",
    description: "한국 전화번호 형식",
    testText: "전화: 02-123-4567, 010-1234-5678",
  },
  {
    name: "휴대전화 (한국)",
    pattern: "01[016789]-\\d{3,4}-\\d{4}",
    description: "한국 휴대전화 번호",
    testText: "연락처: 010-1234-5678, 011-123-4567",
  },
  {
    name: "날짜 (YYYY-MM-DD)",
    pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
    description: "ISO 날짜 형식",
    testText: "생일: 1990-01-15, 오늘: 2024-03-20",
  },
  {
    name: "시간 (HH:MM)",
    pattern: "(?:[01]\\d|2[0-3]):[0-5]\\d",
    description: "24시간 형식 시간",
    testText: "시작: 09:30, 종료: 18:00, 심야: 23:59",
  },
  {
    name: "IPv4 주소",
    pattern: "(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)){3}",
    description: "IPv4 주소 형식",
    testText: "서버: 192.168.0.1, DNS: 8.8.8.8",
  },
  {
    name: "16진수 색상코드",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}",
    description: "HEX 색상 코드",
    testText: "색상: #fff, #FF5733, #123abc",
  },
  {
    name: "한글만",
    pattern: "[가-힣]+",
    description: "한글 문자만 매칭",
    testText: "Hello 안녕하세요 World 반갑습니다",
  },
  {
    name: "영문만",
    pattern: "[a-zA-Z]+",
    description: "영문 알파벳만 매칭",
    testText: "Hello 안녕하세요 World 반갑습니다",
  },
  {
    name: "숫자만",
    pattern: "\\d+",
    description: "숫자만 매칭",
    testText: "가격: 10000원, 수량: 5개, 합계: 50000",
  },
  {
    name: "HTML 태그",
    pattern: "<[^>]+>",
    description: "HTML 태그 매칭",
    testText: "<div class='test'><p>Hello</p></div>",
  },
];
