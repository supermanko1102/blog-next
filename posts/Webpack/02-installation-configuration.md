---
title: Webpack安裝與配置
date: 2024-04-21
slug: webpack-installation-configuration
category: webpack
---

## 安裝 Node.js 和 npm

在開始使用 Webpack 之前，我們需要先安裝 Node.js 和 npm（Node Package Manager）。Node.js 是一個 JavaScript 運行環境，而 npm 是 Node.js 的套件管理工具，我們將使用它來安裝 Webpack 及其相關套件。

### 安裝 Node.js

1. 前往 [Node.js 官方網站](https://nodejs.org/)
2. 下載並安裝 LTS（長期支援）版本，這是較穩定的版本
3. 安裝過程中，保持默認設置即可

### 確認安裝成功

安裝完成後，打開終端機（Terminal）並輸入以下命令確認 Node.js 和 npm 已正確安裝：

```bash
node -v
npm -v
```

這兩個命令會分別顯示 Node.js 和 npm 的版本號。如果能夠看到版本號，表示安裝成功。

### npm 基本使用

npm 是 Node.js 的套件管理工具，以下是一些基本指令：

- `npm init`：初始化新專案，創建 package.json 文件
- `npm install <套件名>`：安裝指定套件
- `npm install --save-dev <套件名>`：安裝開發依賴套件
- `npm install -g <套件名>`：全局安裝套件
- `npm run <腳本名>`：運行 package.json 中定義的腳本

## 建立新專案並安裝 Webpack

現在我們已經安裝了 Node.js 和 npm，接下來讓我們建立一個新專案並安裝 Webpack。

### 步驟 1：建立專案資料夾

```bash
mkdir webpack-demo
cd webpack-demo
```

### 步驟 2：初始化專案

```bash
npm init -y
```

此命令會創建一個基本的 package.json 文件，`-y` 表示接受所有默認配置。

### 步驟 3：安裝 Webpack 和 Webpack CLI

```bash
npm install --save-dev webpack webpack-cli
```

這裡我們使用 `--save-dev` 參數，因為 Webpack 是一個開發工具，只在開發過程中使用，不需要包含在生產環境中。

## 基本 webpack.config.js 配置

Webpack 可以在沒有配置文件的情況下運行，但為了充分利用其功能，我們通常會創建一個配置文件。

### 創建 webpack.config.js

在專案根目錄下創建 `webpack.config.js` 文件：

```javascript
const path = require("path");

module.exports = {
  // 入口文件
  entry: "./src/index.js",

  // 輸出配置
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  // 模式：development 或 production
  mode: "development",
};
```

### 配置詳解

1. **entry**：指定打包的入口文件。Webpack 從這個文件開始，找出所有依賴，然後打包。
2. **output**：定義打包後的文件如何輸出。
   - `filename`：輸出文件名
   - `path`：輸出目錄的絕對路徑
3. **mode**：設定模式
   - `development`：開發模式，提供更好的調試體驗
   - `production`：生產模式，自動優化打包結果

### 創建源文件

現在我們需要創建源文件結構：

```bash
mkdir src
touch src/index.js
```

在 `src/index.js` 中添加一些簡單的代碼：

```javascript
console.log("Hello, Webpack!");
```

## 運行第一個 Webpack 打包命令

現在讓我們使用 Webpack 進行第一次打包。

### 使用命令行打包

有兩種方法可以運行 Webpack：

**方法一：使用 npx**

```bash
npx webpack
```

**方法二：使用 node_modules 中的 webpack**

```bash
./node_modules/.bin/webpack
```

### 打包結果

成功打包後，Webpack 會在 `dist` 目錄下生成 `bundle.js` 文件。你可以創建一個 HTML 文件來測試打包結果：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Webpack Demo</title>
  </head>
  <body>
    <h1>Hello Webpack</h1>
    <script src="dist/bundle.js"></script>
  </body>
</html>
```

## 配置 package.json 中的 scripts

為了更方便地運行 Webpack 命令，我們可以在 package.json 中配置腳本。

### 編輯 package.json

打開 package.json 文件，找到 `"scripts"` 部分並修改為：

```json
"scripts": {
  "build": "webpack --mode production",
  "dev": "webpack --mode development",
  "watch": "webpack --watch --mode development"
}
```

### 腳本詳解

- `build`：以生產模式打包，會進行代碼壓縮和優化
- `dev`：以開發模式打包，便於調試
- `watch`：以開發模式打包，並監視文件變化，自動重新打包

### 使用腳本

現在可以使用以下命令來運行 Webpack：

```bash
npm run dev    # 開發模式打包
npm run build  # 生產模式打包
npm run watch  # 監視模式打包
```

## 總結

在本章中，我們學習了如何安裝 Node.js 和 npm，並使用它們來設置 Webpack 環境。我們創建了一個基本的 Webpack 配置文件，並了解了如何通過命令行或 npm 腳本運行 Webpack。這為我們後續學習更複雜的 Webpack 功能奠定了基礎。

在下一章中，我們將學習如何使用 Webpack 處理各種資源，如 CSS、圖片和字體等。
