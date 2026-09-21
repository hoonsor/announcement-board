/**
 * 「最後更新」時間戳記：以本模組被載入的當下（即 `next build` 執行靜態頁面渲染的當下，
 * 也就是實際推送並部署到 Vercel 的那次建置時間）為準，自動產生「日期＋24 小時制時間」，
 * 不再需要於 content/*.md 中手動填寫「最後更新：」欄位。
 *
 * 由於本模組只會在建置階段被 import 一次，之後產生的靜態 HTML 會固定使用這個值，
 * 不會隨使用者瀏覽器的當下時間而變動。
 */
function formatDeployTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  // Intl 在 hour12:false 時，午夜有時會輸出 "24"，統一轉回 "00"。
  const hour = get("hour") === "24" ? "00" : get("hour");

  return `${get("year")}-${get("month")}-${get("day")} ${hour}:${get("minute")}`;
}

export const DEPLOY_TIMESTAMP = formatDeployTimestamp(new Date());
