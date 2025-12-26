import { markdownToHtml } from "./markdown-utils";

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadMarkdown(
  content: string,
  filename: string
): Promise<void> {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${filename}.md`);
}

export async function downloadHtml(
  content: string,
  filename: string
): Promise<void> {
  const html = markdownToHtml(content);
  const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #1a1a1a;
      --muted: #6b7280;
      --border: #e5e7eb;
      --code-bg: #f3f4f6;
      --link: #2563eb;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #1a1a1a;
        --text: #f3f4f6;
        --muted: #9ca3af;
        --border: #374151;
        --code-bg: #374151;
        --link: #60a5fa;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.7;
      color: var(--text);
      background: var(--bg);
    }
    h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; }
    h1 { font-size: 2em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    p { margin: 1em 0; }
    a { color: var(--link); text-decoration: none; }
    a:hover { text-decoration: underline; }
    pre {
      background: var(--code-bg);
      padding: 1rem;
      overflow-x: auto;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
    }
    code {
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }
    :not(pre) > code {
      background: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
    }
    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 4px solid var(--link);
      background: var(--code-bg);
      color: var(--muted);
    }
    img { max-width: 100%; border-radius: 0.5rem; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid var(--border); padding: 0.5rem; text-align: left; }
    th { background: var(--code-bg); font-weight: 600; }
    hr { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
    ul, ol { padding-left: 1.5em; }
    li { margin: 0.25em 0; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, `${filename}.html`);
}

export async function downloadPdf(
  content: string,
  filename: string
): Promise<void> {
  try {
    const html2pdf = (await import("html2pdf.js")).default;
    const html = markdownToHtml(content);

    const element = document.createElement("div");
    element.innerHTML = html;
    element.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
      max-width: 800px;
      line-height: 1.7;
      color: #1a1a1a;
    `;

    // Apply basic styles to elements
    element.querySelectorAll("h1").forEach((el) => {
      (el as HTMLElement).style.cssText = "font-size: 2em; font-weight: 600; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; margin-top: 1em;";
    });
    element.querySelectorAll("h2").forEach((el) => {
      (el as HTMLElement).style.cssText = "font-size: 1.5em; font-weight: 600; margin-top: 1em;";
    });
    element.querySelectorAll("h3").forEach((el) => {
      (el as HTMLElement).style.cssText = "font-size: 1.25em; font-weight: 600; margin-top: 1em;";
    });
    element.querySelectorAll("pre").forEach((el) => {
      (el as HTMLElement).style.cssText = "background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;";
    });
    element.querySelectorAll("code").forEach((el) => {
      (el as HTMLElement).style.cssText = "font-family: 'Consolas', monospace; font-size: 0.9em;";
    });
    element.querySelectorAll("blockquote").forEach((el) => {
      (el as HTMLElement).style.cssText = "border-left: 4px solid #2563eb; padding-left: 1rem; color: #6b7280; background: #f3f4f6; padding: 0.5rem 1rem;";
    });

    await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `${filename}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  } catch (error) {
    console.error("PDF export failed:", error);
    throw new Error("PDF 내보내기에 실패했습니다");
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

export async function copyHtmlToClipboard(markdown: string): Promise<boolean> {
  const html = markdownToHtml(markdown);
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([markdown], { type: "text/plain" }),
      }),
    ]);
    return true;
  } catch {
    return copyToClipboard(html);
  }
}
