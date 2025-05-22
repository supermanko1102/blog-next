---
title: Webpack基礎知識
date: 2025-04-20
slug: webpack-basics
category: webpack
---

## Webpack 是什麼？

Webpack 是一個現代 JavaScript 應用程式的靜態模組打包工具（module bundler）。當 Webpack 處理應用程式時，它會在內部建立一個依賴圖（dependency graph），這個依賴圖對應著專案中所需的每個模組，然後將所有這些模組打包成一個或多個 bundle。

簡單來說，Webpack 的主要任務是：

- 將各種 JavaScript 模組及其依賴關係打包成瀏覽器可以直接運行的文件
- 處理和轉換各種資源文件（如 CSS、圖片、字體等）
- 優化打包結果，提升應用程式的性能

Webpack 使開發者能夠採用模組化的方式開發前端應用，同時解決了瀏覽器相容性、資源管理、程式碼優化等諸多問題。

## 為什麼需要 Webpack？

現代前端開發面臨著許多挑戰，Webpack 的出現正是為了解決這些問題：

### 1. 模組化管理

在沒有打包工具之前，JavaScript 缺乏原生的模組系統。開發者要麼將所有代碼放在一個文件中，要麼通過多個 `<script>` 標籤引入多個文件，這會導致：

- 全局變量衝突
- 依賴關係不明確
- 維護困難
- 載入順序問題

Webpack 允許使用現代模組語法（如 ES Modules、CommonJS），使代碼更加模組化和可維護。

### 2. 資源處理

現代網頁不僅包含 JavaScript，還包括 CSS、圖片、字體等多種資源。傳統上，這些資源需要分別處理：

- 手動將 SCSS/LESS 編譯為 CSS
- 手動優化和壓縮圖片
- 手動管理字體文件

Webpack 將這些資源視為模組，通過 loader 系統統一處理，極大地簡化了工作流程。

### 3. 性能優化

網頁性能是使用者體驗的重要因素，但手動優化非常繁瑣：

- 壓縮和混淆 JavaScript
- 合併文件以減少 HTTP 請求
- 實現代碼分割和按需載入

Webpack 內建了這些優化功能，幫助開發者輕鬆實現性能優化。

### 4. 開發體驗提升

Webpack 提供了開發服務器、熱模組替換（HMR）等功能，使開發過程更加高效：

- 即時編譯和自動刷新
- 源碼映射（Source Maps）便於調試
- 代碼變更時只更新改變的部分

## 模組化開發的意義與前端發展歷史

### JavaScript 模組化的演進

#### 1. 全局變量階段（早期）

最初，JavaScript 程式碼都是通過全局變量進行共享：

```javascript
// math.js
var mathUtils = {
  add: function (a, b) {
    return a + b;
  },
};

// app.js
console.log(mathUtils.add(2, 3)); // 使用全局變量 mathUtils
```

這種方式容易導致命名衝突，並且難以管理依賴關係。

#### 2. 命名空間模式

為了減少全局變量，開發者開始使用命名空間模式：

```javascript
var MyApp = MyApp || {};
MyApp.math = {
  add: function (a, b) {
    return a + b;
  },
};

console.log(MyApp.math.add(2, 3));
```

這減少了衝突，但仍無法有效處理依賴關係。

#### 3. 立即執行函數表達式（IIFE）

IIFE 允許創建私有作用域，避免污染全局環境：

```javascript
var Module = (function () {
  var privateVar = "private";

  return {
    publicMethod: function () {
      console.log(privateVar);
    },
  };
})();
```

#### 4. CommonJS

Node.js 採用 CommonJS 規範，引入了 `require` 和 `module.exports` 概念：

```javascript
// math.js
module.exports = {
  add: function (a, b) {
    return a + b;
  },
};

// app.js
const math = require("./math");
console.log(math.add(2, 3));
```

CommonJS 的問題是它是同步載入的，不適合瀏覽器環境。

#### 5. AMD（Asynchronous Module Definition）

RequireJS 等工具實現了 AMD 規範，支援異步載入模組：

```javascript
define(["./math"], function (math) {
  console.log(math.add(2, 3));
});
```

#### 6. ES Modules（ESM）

ECMAScript 2015 引入了官方模組語法：

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from "./math";
console.log(add(2, 3));
```

ES Modules 成為現代前端標準，但舊版瀏覽器不支援。Webpack 可以將 ES Modules 轉換為兼容性更好的格式。

### 模組化的意義

模組化開發帶來諸多好處：

1. **封裝性**：隱藏內部實現，只暴露必要接口
2. **可重用性**：模組可在不同專案中複用
3. **可維護性**：分離關注點，專注於單一功能
4. **可測試性**：獨立模組易於單元測試
5. **依賴管理**：明確的依賴關係，避免「意外」工作

## Webpack 與其他構建工具的比較

前端生態中有多種構建工具，各有優缺點：

### Webpack 優勢

- **強大的功能**：支援幾乎所有前端構建需求
- **豐富的生態**：大量的 loader 和 plugin
- **靈活的配置**：可高度自定義
- **社區活躍**：大量文檔和幫助資源
- **代碼分割**：強大的代碼分割能力

### Webpack 劣勢

- **配置複雜**：學習曲線較陡
- **構建速度**：大型項目中速度較慢
- **內存佔用**：處理大型專案時佔用較多資源

### 其他工具比較

#### Rollup

- 優勢：更好的 Tree Shaking，生成更小的包，適合庫開發
- 劣勢：對應用開發支持不如 Webpack 全面

#### Parcel

- 優勢：零配置，非常簡單易用
- 劣勢：定制性較差，對複雜專案支持不足

#### Vite

- 優勢：開發環境使用原生 ES 模組，啟動速度極快
- 劣勢：相較 Webpack 生態較小，某些特定場景支持不足

#### Esbuild / SWC

- 優勢：基於 Go/Rust 實現，性能極高
- 劣勢：功能較為基礎，通常作為其他工具的底層引擎

### 選擇建議

- **小型項目或快速原型**：Parcel 或 Vite
- **庫或框架開發**：Rollup
- **複雜應用或需要精確控制**：Webpack
- **極端性能需求**：Esbuild 或基於 SWC 的解決方案

## Webpack 的核心概念

Webpack 的工作原理圍繞著幾個核心概念：

### 1. Entry（入口）

入口指定 Webpack 從哪個模組開始建立依賴圖。默認值是 `./src/index.js`，但可以通過配置指定多個入口：

```javascript
module.exports = {
  entry: "./src/app.js"
  // 或者多入口
  entry: {
    main: "./src/app.js",
    vendor: "./src/vendor.js"
  }
};
```

### 2. Output（輸出）

輸出告訴 Webpack 在哪裡輸出打包結果，以及如何命名：

```javascript
const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    // 或使用佔位符
    // filename: "[name].[contenthash].js"
  },
};
```

### 3. Loaders（載入器）

Webpack 原生只能處理 JavaScript 和 JSON 文件。Loaders 允許 Webpack 處理其他類型的文件，並將它們轉換為有效模組：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
};
```

常見的 loaders：

- `babel-loader`: 將 ES6+ 轉換為 ES5
- `css-loader`: 解析 CSS 文件及其依賴
- `style-loader`: 將 CSS 注入到 DOM
- `file-loader`: 處理文件導入
- `url-loader`: 將檔案轉換為 base64 URL

### 4. Plugins（插件）

Plugins 用於執行更廣泛的任務，比如打包優化、資源管理、環境變數注入等：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
};
```

常見的 plugins：

- `HtmlWebpackPlugin`: 生成 HTML 文件並自動注入打包結果
- `MiniCssExtractPlugin`: 將 CSS 提取到單獨文件
- `CleanWebpackPlugin`: 打包前清理輸出目錄
- `DefinePlugin`: 定義環境變數
- `CopyWebpackPlugin`: 複製文件或目錄

### 5. Mode（模式）

Mode 指示 Webpack 使用相應的內置優化：

```javascript
module.exports = {
  mode: "development", // 或 "production", "none"
};
```

- `development`: 友好的錯誤訊息、快速的增量編譯
- `production`: 代碼壓縮、優化等生產環境特性
- `none`: 無預設優化

### 6. Resolve（解析）

Resolve 配置 Webpack 如何解析模組：

```javascript
module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
};
```

## 總結

Webpack 是現代前端開發中不可或缺的構建工具，它解決了模組管理、資源處理和性能優化等關鍵問題。通過理解 JavaScript 模組化的歷史演進，以及 Webpack 的核心概念，我們可以更好地掌握這個強大工具。

在下一章，我們將學習如何安裝 Webpack 並創建基本配置，開始實踐使用 Webpack 進行前端構建。
