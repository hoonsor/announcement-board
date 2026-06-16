# 專案名稱：工科技藝競賽公告網頁 (v0.1.5)

## GitHub 倉庫網址
[https://github.com/hoonsor/announcement-board](https://github.com/hoonsor/announcement-board)

## Vercel 部署網址
[https://announcement-board-jet.vercel.app](https://announcement-board-jet.vercel.app)

## 專案程式功能概述
這是一個供高中使用的專案活動公告網站。各任務編組擁有專屬帳號可登入系統，能發布公告、上傳附件檔案，並支援使用多個標籤以及進階邏輯（AND、OR、NOT）來快速篩選公告。介面設計親民且具備微動畫效果。

## 版本歷程及功能改變紀錄
| 版本 | 日期 | 類型 | 描述 |
|---|---|---|---|
| v0.1.5 | 2026-06-16 | feat | 實作 Phase 5 視覺優化與自動化測試，引入 Vitest 並編寫 Server Actions 權限單元測試，優化全域 transition 與 Scrollbar 樣式 |
| v0.1.4 | 2026-06-16 | feat | 實作 Phase 4 進階標籤篩選與選取器重構，新增實時標籤搜尋勾選 UI，優化過濾微動畫與一鍵 Reset 重置按鈕 |
| v0.1.3 | 2026-06-16 | feat | 實作 Phase 3 富文本編輯器與附件上傳，健全編輯模式下刪除現有附件功能，並修復公告詳情頁刪除漏洞 |
| v0.1.2 | 2026-06-16 | feat | 實作 Phase 2 權限與身分驗證，頁面重導向保護與防呆跳轉，修復刪除按鈕權限漏洞 |
| v0.1.1 | 2026-06-16 | feat | 啟動 PostgreSQL 容器，完成 Prisma 連線測試與 Seed 資料匯入，完成 Phase 1 基礎建設 |

## 目前專案進度
- [x] Phase 1: 專案基礎建設與架構
  - [x] 初始化 Next.js 專案
  - [x] 配置 Tailwind CSS 與基礎 Design Tokens
  - [x] 建立 docker-compose.yml (PostgreSQL)
  - [x] 設定 Prisma Schema
  - [x] 建立 PROJECT_STATUS.md 與 ANTIGRAVITY.md
- [x] Phase 2: 權限與身分驗證系統
- [x] Phase 3: 公告管理與檔案上傳
- [x] Phase 4: 進階標籤篩選系統
- [x] Phase 5: 視覺優化與自動化測試

## 歷次修訂紀錄
無
