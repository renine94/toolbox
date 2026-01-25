// 지원 언어
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'kotlin',
  'swift',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'sql',
  'bash',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// 언어별 표시 이름
export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  swift: 'Swift',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  sql: 'SQL',
  bash: 'Bash',
};

// 테마
export const THEMES = [
  'github-dark',
  'github-dark-dimmed',
  'dracula',
  'monokai',
  'vs-dark',
  'atom-one-dark',
  'nord',
  'tokyo-night',
] as const;

export type Theme = (typeof THEMES)[number];

// 테마 표시 이름
export const THEME_LABELS: Record<Theme, string> = {
  'github-dark': 'GitHub Dark',
  'github-dark-dimmed': 'GitHub Dark Dimmed',
  dracula: 'Dracula',
  monokai: 'Monokai',
  'vs-dark': 'VS Code Dark',
  'atom-one-dark': 'Atom One Dark',
  nord: 'Nord',
  'tokyo-night': 'Tokyo Night',
};

// 커서 스타일
export const CURSOR_STYLES = ['block', 'line', 'underscore'] as const;

export type CursorStyle = (typeof CURSOR_STYLES)[number];

// 창 스타일
export const WINDOW_STYLES = ['macos', 'windows', 'none'] as const;

export type WindowStyle = (typeof WINDOW_STYLES)[number];

// GIF 화질 설정
export const GIF_QUALITY_PRESETS = ['high', 'balanced', 'fast'] as const;

export type GifQualityPreset = (typeof GIF_QUALITY_PRESETS)[number];

// 화질 프리셋 설정값
export const GIF_QUALITY_CONFIG: Record<GifQualityPreset, { quality: number; dither: boolean; label: string }> = {
  high: { quality: 1, dither: true, label: '최고 화질' },
  balanced: { quality: 5, dither: true, label: '균형' },
  fast: { quality: 10, dither: false, label: '빠른 생성' },
};

// 설정 인터페이스
export interface TypingGifSettings {
  language: SupportedLanguage;
  theme: Theme;
  typingSpeed: number; // ms per character (20-200)
  cursorStyle: CursorStyle;
  windowStyle: WindowStyle;
  fontSize: number; // 12-20
  gifWidth: number; // 400-1000
  showLineNumbers: boolean;
  cursorBlinkSpeed: number; // ms (400-800)
  gifQuality: GifQualityPreset; // 화질 프리셋
}

// 기본 설정
export const DEFAULT_SETTINGS: TypingGifSettings = {
  language: 'javascript',
  theme: 'github-dark',
  typingSpeed: 50,
  cursorStyle: 'line',
  windowStyle: 'macos',
  fontSize: 14,
  gifWidth: 600,
  showLineNumbers: true,
  cursorBlinkSpeed: 530,
  gifQuality: 'high', // 기본값: 최고 화질
};

// 애니메이션 상태
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';

// GIF 생성 상태
export type GifGenerationState = 'idle' | 'generating' | 'completed' | 'error';

// 기본 코드 템플릿
export const DEFAULT_CODE_TEMPLATES: Record<SupportedLanguage, string> = {
  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  typescript: `interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,

  python: `def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib[:n]

print(fibonacci(10))`,

  go: `package main

import "fmt"

func main() {
    message := "Hello, Go!"
    fmt.Println(message)
}`,

  rust: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}`,

  java: `public class Main {
    public static void main(String[] args) {
        String message = "Hello, Java!";
        System.out.println(message);
    }
}`,

  kotlin: `fun main() {
    val items = listOf("Apple", "Banana", "Cherry")
    items.forEach { println(it) }
}`,

  swift: `struct Person {
    let name: String
    let age: Int
}

let person = Person(name: "John", age: 30)
print("Hello, \\(person.name)!")`,

  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5};
    for (int n : nums) {
        std::cout << n << " ";
    }
    return 0;
}`,

  csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, C#!");
    }
}`,

  php: `<?php
$greeting = "Hello, PHP!";
echo $greeting;

$numbers = [1, 2, 3, 4, 5];
foreach ($numbers as $num) {
    echo $num . " ";
}`,

  ruby: `class Person
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def greet
    "Hello, #{@name}!"
  end
end

person = Person.new("Ruby")
puts person.greet`,

  sql: `SELECT
    u.name,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;`,

  bash: `#!/bin/bash

echo "Hello, Bash!"

for i in {1..5}; do
    echo "Number: $i"
done`,
};
