<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — 14-工科技藝競賽公告網頁

所有 AI 共用的專案說明書。進度與交接看 `PROJECT_STATUS.md`。
> 本檔由 38 號額度接力排程在 2026-11-04 依程式與文件補建，標「建議（未確認）」的內容要倬確認。

## 這是什麼
115 年全國工科技藝競賽服務組對外公告網站，詳見 `README.md`。內容與程式分離：文字改 `content/`，不用改元件。

## 技術棧
Next.js 16（App Router）、TypeScript、Tailwind CSS v4、Framer Motion、lucide-react；部署 Vercel。

## 目錄
| 路徑 | 內容 |
|---|---|
| `content/` | 公告內容（home、site、checklists、清運點、changelog） |
| `scripts/sync-content.mjs` | 把 content 同步進網站資料 |
| `src/` | 頁面與元件 |
| `public/` | 地圖等靜態檔 |

## 指令
```powershell
npm install
npm run dev            # http://localhost:3000
npm run sync-content   # 改完 content/ 後執行
npm run build
```

## 規則（Always／Ask／Never）
- **Always**：改程式前先 commit 快照或開 feature branch；收工更新 `PROJECT_STATUS.md` 的「下一步」與交接紀錄；文件、註解、commit 用繁體中文（Conventional Commits）。
- **Ask**：合併 main、deploy、對外發布、寄信發訊息、改系統設定、刪除資料（刪檔一律移到 `_trash/`）。
- **Never**：force push 或改寫歷史；把 `.env` 明文、金鑰、`.env.keys` 放進 git；讀取或顯示解密後的 `.env` 與 `DOTENV_PRIVATE_KEY`；把人事或公文資料送到雲端 AI（需先在本機去識別化）。
