# ANTIGRAVITY 專案架構指引

## 專案概述
- **名稱**: 工科技藝競賽公告網頁
- **技術棧**: Next.js 15 (App Router, React 19), Tailwind CSS v4, Framer Motion, Prisma ORM, PostgreSQL.
- **代理分工協作 (Swarm Protocol)**:
  - `@Frontend-Agent`: 負責首頁、公告列表、發布介面與 Framer Motion 動畫實作。
  - `@Backend-Agent`: 負責 Server Actions, NextAuth 驗證邏輯與 Prisma 查詢過濾。
  - `@QA-Agent`: 負責 Vitest 測試與 Playwright 端到端驗證。

## 目錄結構約定
- `/src/app`: Next.js 路由與頁面元件。
- `/src/components`: 共用的 React UI 元件 (如按鈕、輸入框、標籤選擇器)。
- `/src/actions`: Next.js Server Actions (後端邏輯)。
- `/src/lib`: 共用的工具函式庫 (如 prisma client 實例)。
- `/prisma`: 資料庫 Schema 與遷移腳本。
- `/public/uploads`: 存放使用者上傳的附件檔案。

## 執行邊界 (Always Do, Ask First, Never Do)
- **Always Do**: 嚴格遵守 TDD，每項 API/Action 都必須撰寫測試或進行完整驗證。撰寫 UI 時務必考慮 RWD 與親民視覺。
- **Ask First**: 更改資料庫結構或增刪 Prisma 模型前應先紀錄。
- **Never Do**: 不可將金鑰明碼寫入程式碼，一律透過 `.env` 處理。
