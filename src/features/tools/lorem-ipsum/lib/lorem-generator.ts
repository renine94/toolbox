import { LoremIpsumConfig } from "../model/types";

// Lorem Ipsum 표준 단어 풀
const LOREM_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

// 전통적인 첫 문장
const FIRST_SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

// 첫 글자 대문자
function capitalizeFirst(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// 랜덤 단어 선택
function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

// 랜덤 단어 N개 생성
export function generateWords(count: number): string[] {
  return Array.from({ length: count }, () => getRandomWord());
}

// 문장 생성 (5-15 단어)
export function generateSentence(): string {
  const wordCount = Math.floor(Math.random() * 11) + 5;
  const words = generateWords(wordCount);
  words[0] = capitalizeFirst(words[0]);
  return words.join(" ") + ".";
}

// 문단 생성 (4-8 문장)
export function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 5) + 4;
  const sentences = Array.from({ length: sentenceCount }, () =>
    generateSentence()
  );
  return sentences.join(" ");
}

// 메인 생성 함수
export function generateLoremIpsum(config: LoremIpsumConfig): string {
  const { mode, count, startWithLoremIpsum, includeHtml } = config;

  let result: string;

  switch (mode) {
    case "words": {
      const words = generateWords(count);
      if (startWithLoremIpsum) {
        result = "Lorem ipsum " + words.join(" ");
      } else {
        result = words.join(" ");
      }
      break;
    }

    case "sentences": {
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLoremIpsum && sentences.length > 0) {
        sentences[0] = FIRST_SENTENCE;
      }
      result = sentences.join(" ");
      break;
    }

    case "paragraphs":
    default: {
      const paragraphs = Array.from({ length: count }, () =>
        generateParagraph()
      );
      if (startWithLoremIpsum && paragraphs.length > 0) {
        const firstPara = paragraphs[0];
        const firstDotIndex = firstPara.indexOf(".");
        if (firstDotIndex !== -1) {
          const restOfPara = firstPara.substring(firstDotIndex + 2);
          paragraphs[0] = FIRST_SENTENCE + " " + restOfPara;
        } else {
          paragraphs[0] = FIRST_SENTENCE;
        }
      }

      if (includeHtml) {
        result = paragraphs.map((p) => `<p>${p}</p>`).join("\n\n");
      } else {
        result = paragraphs.join("\n\n");
      }
      break;
    }
  }

  return result;
}
