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
      // ==highlight==
      nodes.push(
        <mark
          key={key}
          className="rounded bg-accent-200/70 px-1 py-0.5 text-foreground dark:bg-accent-400/30 dark:text-foreground"
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
