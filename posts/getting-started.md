---
title: Webpack 從零開始：新手入門指南
date: 2023-05-01
slug: getting-started
category: webpack
---

## Webpack 是什麼？

Webpack 是一個現代 JavaScript 應用程式的靜態模組打包工具。當 Webpack 處理應用程式時，它會在內部建立一個依賴圖，此依賴圖映射專案所需的每個模組，然後生成一個或多個 bundle。

## 為什麼要使用 Webpack？

在現代前端開發中，我們面臨以下挑戰：

- 管理大量 JavaScript 文件和依賴關係
- 處理不同格式的資源（CSS、圖片、字體等）
- 提高載入效率和性能
- 開發與生產環境的差異配置

Webpack 解決了這些問題，它讓我們能夠模組化開發，並高效地打包所有資源。

## 安裝與基本配置

首先，讓我們建立一個新專案並安裝 Webpack：

```bash
mkdir my-webpack-project
cd my-webpack-project
npm init -y
npm install webpack webpack-cli --save-dev
```

安裝完成後，我們可以在專案根目錄建立一個 `webpack.config.js` 文件：

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

這個配置檔告訴 Webpack：

1. 打包的入口點是 `./src/index.js`
2. 輸出的檔案應該放在 `./dist` 目錄下，命名為 `main.js`

## 創建簡單的應用程式

讓我們建立一個簡單的 `src/index.js` 檔案：

```javascript
function component() {
  const element = document.createElement("div");
  element.innerHTML = "你好，Webpack";
  return element;
}

document.body.appendChild(component());
```

接著，我們建立一個 `dist/index.html` 檔案：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Webpack 入門</title>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

## 運行 Webpack

在 `package.json` 中添加 script 命令：

```json
"scripts": {
  "build": "webpack"
}
```

執行：

```bash
npm run build
```

現在，打開 `dist/index.html`，你應該能看到 "你好，Webpack" 顯示在頁面上。

## 心得總結

剛開始使用 Webpack 時，配置可能會讓人感到困惑。但理解了其核心概念後，就會發現這是一個非常強大的工具。從零開始建立 Webpack 專案讓我更加了解模組打包的原理和流程，也讓我對前端構建工具有了更深入的認識。

最重要的是掌握 entry 和 output 的概念，這是 Webpack 最基本也是最核心的部分。在下一篇文章中，我將探討 Webpack 的 loader 系統，如何處理 CSS、圖片等非 JavaScript 資源。
