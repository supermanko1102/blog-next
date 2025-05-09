---
title: Webpack Dev Server：提升開發效率的利器
date: 2023-05-29
slug: dev-server
category: webpack
---

## 什麼是 Webpack Dev Server？

Webpack Dev Server 是一個輕量級的開發伺服器，它使用 Express.js 作為後端，提供了開發過程中的許多便利功能。它最大的優勢是提供了「實時重載」（Live Reloading）和「熱模組替換」（Hot Module Replacement, HMR）的能力，大幅提升了前端開發的效率。

## 為什麼需要 Dev Server？

在傳統的開發流程中，每次修改代碼後都需要手動打包並重新整理瀏覽器，這個過程非常繁瑣且浪費時間。而 Webpack Dev Server 可以幫我們解決這個問題：

1. 自動打包：檔案變更後自動重新打包
2. 自動重載：改變後自動重新整理頁面
3. 熱模組替換：在不重新整理頁面的情況下，替換更新的模組
4. 提供開發用伺服器：無需配置額外的靜態文件伺服器

## 安裝與基本配置

首先，安裝 webpack-dev-server：

```bash
npm install webpack-dev-server --save-dev
```

在 webpack.config.js 中配置：

```javascript
module.exports = {
  // ...其他配置

  devServer: {
    static: "./dist",
    port: 8080,
    open: true, // 自動打開瀏覽器
    hot: true, // 啟用 HMR
    compress: true, // 啟用 gzip 壓縮
  },
};
```

在 package.json 中添加啟動命令：

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

## 實時重載 vs 熱模組替換

**實時重載 (Live Reloading)**：
當檔案變更時，整個頁面會重新載入。這是最基本的功能，不需要額外配置。

**熱模組替換 (HMR)**：
只替換變更的模組，保留應用程式狀態。例如，修改 CSS 時只更新樣式，而不會重新整理整個頁面。

啟用 HMR 需要在配置中設置 `hot: true`，並在入口檔案中添加：

```javascript
if (module.hot) {
  module.hot.accept();
}
```

## 進階配置選項

### 1. 代理 API 請求

解決跨域問題，將 API 請求代理到另一個服務器：

```javascript
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    }
  }
}
```

### 2. 設置 HTTPS

為本地開發環境啟用 HTTPS：

```javascript
devServer: {
  https: true;
}
```

如果需要自定義證書：

```javascript
const fs = require('fs');
const path = require('path');

devServer: {
  https: {
    key: fs.readFileSync(path.resolve(__dirname, 'cert/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert/server.crt')),
    ca: fs.readFileSync(path.resolve(__dirname, 'cert/ca.pem')),
  }
}
```

### 3. 設置 History API Fallback

對於單頁應用 (SPA)，配置歷史記錄 API 後備：

```javascript
devServer: {
  historyApiFallback: true;
}
```

更複雜的重寫規則：

```javascript
devServer: {
  historyApiFallback: {
    rewrites: [
      { from: /^\/$/, to: "/index.html" },
      { from: /^\/subpage/, to: "/subpage.html" },
      { from: /./, to: "/404.html" },
    ];
  }
}
```

## 使用中的技巧與心得

在我使用 Webpack Dev Server 的過程中，有一些技巧和心得可以分享：

1. **合理配置 watchOptions**：在大型專案中，可以通過 `watchOptions` 配置來優化文件監視性能

```javascript
devServer: {
  watchOptions: {
    poll: 1000, // 每秒檢查一次變動
    ignored: /node_modules/, // 忽略 node_modules
    aggregateTimeout: 300 // 等待 300ms 再執行，避免頻繁重建
  }
}
```

2. **利用 overlay 顯示錯誤**：在瀏覽器中直接顯示編譯錯誤

```javascript
devServer: {
  client: {
    overlay: true;
  }
}
```

3. **結合 source map**：開發環境使用適當的 source map 便於調試

```javascript
devtool: "eval-source-map"; // 開發環境推薦
```

## 心得總結

Webpack Dev Server 極大地改善了我的前端開發工作流程。在我學習和使用 Webpack 的過程中，Dev Server 是最能直接感受到提升的部分。熱模組替換功能特別有用，它讓我可以即時看到修改的效果，同時保留應用程式的狀態，節省了大量測試時間。

對於初學者，我建議從基本配置開始，理解實時重載和熱模組替換的區別。隨著專案的複雜度增加，可以逐步添加代理、HTTPS 等進階功能。

合理配置 Webpack Dev Server 是提高前端開發效率的關鍵因素之一。這個工具的學習成本較低，但帶來的收益卻非常顯著，絕對值得每一位前端開發者投入時間學習。
