import type { ReactNode } from "react";

/**
 * 極簡的行內 Markdown 解析器，支援 content/*.md 中會用到的幾種行內格式：
 *   [連結文字](https://...)   連結
 *   **粗體文字**              粗體
 *   <u>底線文字</u>           底線
 *   ==高亮文字==              高亮／螢光標示
 * 這些標記可以互相巢狀（例如 **<u>粗體加底線</u>**），解析時會遞迴處理內層文字。
 * 其餘純文字原樣輸出，不會被誤判。
 */
const INLINE_PATTERN_SOURCE =
  "\\[([^\\]]+)\\]\\(([^)\\s]+)\\)|\\*\\*([\\s\\S]+?)\\*\\*|<u>([\\s\\S]+?)<\\/u>|==([\\s\\S]+?)==";

/**
 * 比照 Obsidian 的燈號螢光標示習慣：==文字== 如果一開頭是色圈燈號表情符號，
 * 高亮底色就換成對應的顏色，燈號本身仍會跟著文字一起顯示；沒有燈號則維持
 * 預設的 accent 色（跟之前的行為一樣）。
 */
const HIGHLIGHT_TONE_CLASSES: Record<string, string> = {
  "🔴": "bg-red-200/70 dark:bg-red-400/30",
  "🟠": "bg-orange-200/70 dark:bg-orange-400/30",
  "🟡": "bg-yellow-200/70 dark:bg-yellow-400/30",
  "🟢": "bg-green-200/70 dark:bg-green-400/30",
  "🔵": "bg-blue-200/70 dark:bg-blue-400/30",
  "🟣": "bg-purple-200/70 dark:bg-purple-400/30",
  "🟤": "bg-amber-800/25 dark:bg-amber-700/35",
  "⚫": "bg-neutral-400/45 dark:bg-neutral-500/45",
  "⚪": "bg-neutral-200/80 ring-1 ring-inset ring-neutral-300/70 dark:bg-neutral-600/40 dark:ring-neutral-500/60",
};
const DEFAULT_HIGHLIGHT_TONE = "bg-accent-200/70 dark:bg-accent-400/30";

function highlightToneClass(innerText: string): string {
  for (const [emoji, cls] of Object.entries(HIGHLIGHT_TONE_CLASSES)) {
    if (innerText.startsWith(emoji)) return cls;
  }
  return DEFAULT_HIGHLIGHT_TONE;
}

function parseInline(text: string, keyPrefix: string, depth = 0): ReactNode[] {
  if (!text) return [];
  // 巢狀格式最多處理 4 層，避免不正常輸入造成無窮遞迴
  if (depth > 4) return [text];

  const re = new RegExp(INLINE_PATTERN_SOURCE, "g");
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${i++}`;

    if (match[1] !== undefined) {
      // [text](url)
      nodes.push(
        <a
          key={key}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary-700 underline decoration-primary-300 decoration-2 underline-offset-2 transition-colors hover:text-primary-900 dark:text-accent-300 dark:decoration-accent-400/60 dark:hover:text-accent-200"
        >
          {parseInline(match[1], key, depth + 1)}
        </a>
      );
    } else if (match[3] !== undefined) {
      // **bold**
      nodes.push(
        <strong key={key} className="font-bold text-foreground">
          {parseInline(match[3], key, depth + 1)}
        </strong>
      );
    } else if (match[4] !== undefined) {
      // <u>underline</u>
      nodes.push(
        <u key={key} className="underline decoration-2 underline-offset-2">
          {parseInline(match[4], key, depth + 1)}
        </u>
      );
    } else if (match[5] !== undefined) {
      // ==highlight==（開頭有色圈燈號時換成對應顏色）
      nodes.push(
        <mark
          key={key}
          className={`rounded px-1 py-0.5 text-foreground dark:text-foreground ${highlightToneClass(match[5])}`}
        >
          {parseInline(match[5], key, depth + 1)}
        </mark>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function RichText({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  if (!text) return null;
  return <Tag className={className}>{parseInline(text, "rt")}</Tag>;
}
