# Webpack 學習筆記部落格

這是一個使用 Next.js 構建的部落格，主要用於記錄 webpack 學習過程。這個部落格使用 Next.js 的 App Router 結構，支援 Markdown 文件作為內容源，部署在 GitHub Pages 上。

## 開始使用

首先，安裝相依套件：

```bash
npm install
```

然後，運行開發伺服器：

```bash
npm run dev
```

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000) 查看結果。

## 添加新文章

在 `posts` 目錄中創建新的 Markdown 文件。文件開頭必須包含以下格式的前置資料：

```markdown
title: 文章標題
date: YYYY-MM-DD
slug: unique-slug-for-url

---

文章內容...
```

例如：

```markdown
title: Webpack 的 Entry 與 Output
date: 2023-05-08
slug: entry-output

---

Webpack 中的 `entry` 是打包的起點，而 `output` 則是設定輸出檔案的位置。
```

## 部署到 GitHub Pages

1. 在 `package.json` 中更新 `homepage` 欄位，將 `YOURUSERNAME` 替換為你的 GitHub 使用者名稱。

2. 運行以下命令部署到 GitHub Pages：

```bash
npm run deploy
```

## 專案結構

- `/app` - Next.js App Router 頁面
- `/posts` - Markdown 格式的部落格文章
- `/lib` - 輔助函數
- `/public` - 靜態資源

## 技術棧

- Next.js
- TypeScript
- Tailwind CSS
- remark (Markdown 處理)
- gray-matter (YAML 前置資料解析)
