# 115年全國工科技藝競賽 服務組公告網

本網站提供本校辦理「115年全國工科技藝競賽」期間，服務組對外公告之各項注意事項與檢核表單，並附有競賽期間清運點互動地圖，協助校內各工作組、各競賽職種、協辦單位及外派聯絡人快速掌握應配合之工作內容。

## 功能總覽

- **上方選單**：各工作組注意事項／各競賽職種（校內）注意事項／協辦單位注意事項／外派聯絡人注意事項／競賽期間清運點
- **注意事項頁面**：所有條列項目皆為可勾選之核取方塊，任何使用者都能勾選／取消勾選；勾選狀態會保存在使用者瀏覽器（`localStorage`），並可點擊頁面右上角的印表機圖示，將該頁列印成紙本檢核表單（列印版會依目前勾選狀態顯示打勾記號）
- **競賽期間清運點**：互動式校園地圖（依提供之校園配置圖重新繪製、美化），地圖上以紅圈標示清運點，滑鼠移到紅圈上會有放大提示動畫，點按後會以浮動視窗顯示該地點的清運時段、處理方式、負責單位與注意事項，可點右上角叉叉關閉
- 首頁彙整五大公告專區、服務組工作內容說明與活動期程重點，並提供響應式版面（手機／平板／桌機皆可正常瀏覽）

> 內容為服務組草擬之範本，各單位請依實際辦理狀況與大會最新公告調整文字、聯絡窗口與清運點位置。

## 技術棧

- [Next.js 16](https://nextjs.org)（App Router）+ TypeScript
- Tailwind CSS v4
- Framer Motion（互動動畫）／lucide-react（圖示）

## 本機開發

需要 Node.js 20 以上版本。

```bash
npm install
npm run dev
```

開啟 http://localhost:3000 即可預覽。

其他指令：

```bash
npm run build   # 正式建置
npm run start   # 以正式建置版本啟動伺服器
npm run lint    # 程式碼檢查
```

## 部署到 GitHub

1. 於 GitHub 建立一個新的空白 repository（不要勾選自動產生 README / .gitignore）。
2. 在本專案資料夾內執行：

   ```bash
   git init
   git add .
   git commit -m "init: 115年全國工科技藝競賽服務組公告網"
   git branch -M main
   git remote add origin <你的 GitHub repository 網址>
   git push -u origin main
   ```

## 部署到 Vercel

**方式一：透過 Vercel 網站（建議）**

1. 前往 [vercel.com](https://vercel.com) 並以 GitHub 帳號登入。
2. 點選「Add New → Project」，選擇剛剛推送的 GitHub repository。
3. Framework Preset 會自動偵測為 **Next.js**，無需額外設定，直接點「Deploy」。
4. 部署完成後，Vercel 會提供一組 `*.vercel.app` 網址，之後每次 `git push` 到 `main` 分支都會自動重新部署。

**方式二：透過 Vercel CLI**

```bash
npm i -g vercel
vercel        # 依提示登入並建立專案（預覽環境）
vercel --prod # 正式上線
```

## 內容調整指南

**大部分文字內容都已整理成 `content/` 資料夾下的 Markdown 檔案，不需要碰程式碼即可修改。**

編輯流程：

1. 打開 `content/` 內對應的 `.md` 檔案，直接修改文字內容（詳見 `content/README.md` 的說明）。
2. 存檔後，請 Claude 幫忙同步（或自行執行 `npm run sync-content`）。
3. 執行 `npm run build` 確認網站正常，即完成更新。

| 想調整的內容 | 對應的 Markdown 檔案 |
| --- | --- |
| 各工作組注意事項 檢核清單文字 | `content/checklists/work-groups.md` |
| 各競賽職種（校內）注意事項 檢核清單文字 | `content/checklists/competition-categories.md` |
| 協辦單位注意事項 檢核清單文字 | `content/checklists/co-organizers.md` |
| 外派聯絡人注意事項 檢核清單文字 | `content/checklists/liaisons.md` |
| 競賽期間清運點（頁面文字、統計卡、各清運點時段／聯絡方式／注意事項） | `content/waste-collection-points.md` |
| 上方選單項目文字、網站品牌名稱、頁尾文字 | `content/site.md` |
| 首頁文字內容（主視覺、快速導覽、工作內容、期程、列印提醒） | `content/home.md` |

執行 `npm run sync-content` 後，以上 Markdown 內容會自動轉換為 `src/data/*.ts`、`src/lib/nav.ts` 等程式內部使用的資料檔（這些檔案上方會標註「自動產生，請勿手動編輯」，如需調整內容請改在對應的 `.md` 檔案進行）。

以下內容仍需直接修改程式碼（較少變動，或涉及版面／視覺設計）：

| 想調整的內容 | 檔案位置 |
| --- | --- |
| 校園地圖建築配置（位置、名稱、顏色） | `src/components/CampusMap.tsx` 內的 `buildings` 陣列 |
| 清運點在地圖上的座標位置、代號、標示顏色 | `content/waste-collection-points.md`（座標／代號／顏色欄位，建議請 Claude 協助調整） |
| 網站標題／說明（SEO metadata） | `src/app/layout.tsx` |
| 網站配色（主色、輔色） | `src/app/globals.css` 內的 CSS 變數（`--color-primary-*`、`--color-accent-*`） |

## 授權與致謝

本專案由服務組建置，供本校辦理「115年全國工科技藝競賽」活動期間對內外公告使用。
