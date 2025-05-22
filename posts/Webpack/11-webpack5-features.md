---
title: Webpack 5新特性
date: 2025-05-03
slug: webpack5-features
category: webpack
---

## Webpack 5 主要變化

Webpack 5 於 2020 年 10 月正式發布，帶來了許多重大改進和新特性，專注於以下幾個方面：

### 性能提升

Webpack 5 對打包和構建過程進行了大量優化，包括持久化緩存、改進的樹搖功能和更好的長期緩存等。

### 改進的代碼生成

新的代碼分割算法和模塊輸出格式，使生成的代碼更小，執行效率更高。

### 全新的 API

引入了模組聯邦（Module Federation）等全新功能，使微前端架構更易實現。

### 淘汰舊功能

移除了一些已棄用的功能和選項，例如 Node.js Polyfill。

### 主要版本變更

- **Node.js 支持**：最低支持 Node.js 10.13.0 (LTS)
- **構建性能**：持久化緩存提高了重複構建的速度
- **命名 Chunk IDs**：改進了長期緩存
- **移除 ExtractTextPlugin**：完全轉向 MiniCssExtractPlugin
- **移除 NodeJS 核心模塊的自動 polyfill**：減小包體積

## 持久化緩存

Webpack 5 引入了持久化緩存機制，顯著提高二次構建的速度。

### 基本用法

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: "filesystem", // 啟用文件系統緩存
    buildDependencies: {
      config: [__filename], // 當配置文件變更時重建緩存
    },
  },
};
```

### 進階配置選項

```javascript
module.exports = {
  cache: {
    type: "filesystem",
    version: "1.0", // 緩存版本，變更會使緩存失效
    cacheDirectory: path.resolve(__dirname, ".temp_cache"), // 自定義緩存目錄
    name: "my-cache", // 緩存名稱
    buildDependencies: {
      config: [__filename], // 構建依賴
      tsconfig: [path.resolve(__dirname, "tsconfig.json")], // 當 tsconfig 變更時重建緩存
    },
    store: "pack", // 緩存儲存格式：'pack' 或 'idle'
    profile: true, // 啟用緩存性能分析
    idleTimeout: 60000, // 閒置超時（毫秒）
    maxAge: 5184000000, // 緩存最大保存時間（毫秒，默認2周）
  },
};
```

### 緩存效果

持久化緩存可以將構建時間從數分鐘減少到數秒，尤其對大型項目效果顯著。例如，在一個包含數千個模塊的項目中：

- 首次構建：2 分 30 秒
- 使用持久化緩存後的第二次構建：15 秒

## 模組聯邦（Module Federation）

模組聯邦是 Webpack 5 最令人興奮的新特性之一，它允許多個獨立構建的應用共享模塊，實現了真正的微前端架構。

### 基本概念

- **Host**：消費遠程模塊的應用
- **Remote**：暴露模塊的應用
- **共享模塊**：多個應用間共享的模塊，如 React、Vue 等

### 配置示例

**Remote 應用配置**:

```javascript
// webpack.config.js (遠程應用)
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  // 其他配置...
  plugins: [
    new ModuleFederationPlugin({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button.js",
        "./Header": "./src/components/Header.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^17.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^17.0.0" },
      },
    }),
  ],
};
```

**Host 應用配置**:

```javascript
// webpack.config.js (主應用)
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  // 其他配置...
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        remote_app: "remote_app@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^17.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^17.0.0" },
      },
    }),
  ],
};
```

### 在 Host 應用中使用遠程模塊

```javascript
// Host 應用中使用 Remote 組件
import React, { Suspense } from "react";

// 使用動態導入 Remote 組件
const RemoteButton = React.lazy(() => import("remote_app/Button"));

const App = () => (
  <div>
    <h1>Host Application</h1>
    <Suspense fallback={<div>Loading Button...</div>}>
      <RemoteButton />
    </Suspense>
  </div>
);

export default App;
```

### 模組聯邦的好處

1. **獨立部署**：各應用可以獨立開發、構建和部署
2. **實時共享**：無需重新構建或部署即可使用更新的模塊
3. **版本控制**：可以指定模塊的版本要求
4. **減少重複代碼**：共享庫只需加載一次

### 實際應用場景

- 多團隊協作的大型應用
- 微前端架構
- 組件庫與主應用分離
- 插件化架構

## 資源模組（Asset Modules）

Webpack 5 引入了內置的資源模塊類型，無需配置額外的 loader 即可處理資源文件。

### 資源模塊類型

1. **asset/resource**：生成單獨的文件並導出 URL（類似 file-loader）
2. **asset/inline**：導出資源的 Data URI（類似 url-loader）
3. **asset/source**：導出資源源碼（類似 raw-loader）
4. **asset**：在導出 Data URI 和單獨文件之間自動選擇（類似於帶有大小限制的 url-loader）

### 配置示例

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      // 圖片：輸出單獨文件
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      // SVG：內聯為 Data URI
      {
        test: /\.svg$/i,
        type: "asset/inline",
      },
      // 文本文件：導入源碼
      {
        test: /\.txt$/i,
        type: "asset/source",
      },
      // 小圖片使用 Data URI，大圖片輸出文件
      {
        test: /\.(png|jpg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8KB 以下使用 Data URI
          },
        },
      },
    ],
  },
  // 自定義輸出文件名
  output: {
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
```

### 在代碼中使用

```javascript
// 導入資源
import imgUrl from "./image.png"; // asset/resource: URL
import svgIcon from "./icon.svg"; // asset/inline: Data URI
import textContent from "./file.txt"; // asset/source: 文本內容

// 使用資源
const img = document.createElement("img");
img.src = imgUrl;
document.body.appendChild(img);

const svgContainer = document.createElement("div");
svgContainer.innerHTML = svgIcon;
document.body.appendChild(svgContainer);

console.log(textContent); // 輸出文本內容
```

### 資源模組的優勢

1. **簡化配置**：不需要安裝和配置多個 loader
2. **統一 API**：所有資源類型使用相同的配置模式
3. **更好的性能**：內置實現比第三方 loader 更高效
4. **更好的 Tree Shaking**：資源模塊與 ES 模塊系統整合得更好

## Node.js 支持改進

Webpack 5 對 Node.js 內置模塊的處理進行了顯著改變，提高了打包效率和兼容性。

### 移除自動 polyfill

Webpack 4 會自動為 Node.js 核心模塊（如 path, fs 等）提供 polyfill，即使應用可能不需要這些模塊。Webpack 5 移除了這一行為：

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      // 明確指定需要 polyfill 的模塊
      path: require.resolve("path-browserify"),
      fs: false, // 顯式禁用 fs 模塊
    },
  },
};
```

### 支持 package.exports

支持 Node.js 的 package.exports 字段，提供更精確的模塊導出控制：

```json
// package.json
{
  "name": "my-library",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

## Tree Shaking 改進

Webpack 5 對 Tree Shaking 功能進行了多項改進，實現了更精確的無用代碼檢測和移除。

### 內部模塊 Tree Shaking

Webpack 5 可以分析和優化模塊內部的未使用導出：

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

// index.js - 只有 add 會被包含在產出中
import { add } from "./math";
console.log(add(1, 2));
```

### 嵌套 Tree Shaking

改進對嵌套依賴的 Tree Shaking 能力：

```javascript
// nested.js
export const nested = {
  foo: () => "foo",
  bar: () => "bar",
};

// index.js - 只有 nested.foo 會被包含
import { nested } from "./nested";
console.log(nested.foo());
```

### CommonJS Tree Shaking

有限支持 CommonJS 模塊的 Tree Shaking：

```javascript
// utils.js (CommonJS)
exports.a = 1;
exports.b = 2;

// index.js
const { a } = require("./utils");
console.log(a);
```

## Optimization（優化）選項的改進

Webpack 5 提供了更多優化選項，幫助減小打包體積和提高應用性能。

### 改進的代碼生成算法

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    // 改進的模塊 ID
    moduleIds: "deterministic",
    // 改進的 Chunk ID
    chunkIds: "deterministic",
    // 提取運行時代碼
    runtimeChunk: "single",
  },
};
```

### 改進的 SplitChunksPlugin

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      minSize: 20000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

## 更友好的開發體驗

Webpack 5 改進了開發體驗，提供更清晰的錯誤報告和更好的調試工具。

### 命名 Chunk ID

使用更有意義的 Chunk 命名方式，便於調試：

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    chunkIds: "named", // 開發模式下，對 chunk 使用有意義的名稱
  },
};
```

### 改進的控制台輸出

Webpack 5 控制台輸出更為清晰和有用，包括：

- 彩色和格式化的輸出
- 更詳細的編譯統計信息
- 更清晰的錯誤和警告信息
- 更好的進度報告

### 更好的 Stats 數據

```javascript
// webpack.config.js
module.exports = {
  stats: {
    preset: "detailed",
    modules: false, // 隱藏模塊詳情
    chunks: false, // 隱藏 chunk 詳情
    assets: true, // 顯示資源詳情
    errorDetails: true, // 顯示錯誤詳情
  },
};
```

## 總結

Webpack 5 通過引入持久化緩存、模組聯邦、資源模塊等重要特性，大大提升了前端應用的開發效率和運行性能。同時，對 Tree Shaking、代碼生成和優化選項的改進，使打包結果更加精簡高效。

作為前端開發者，建議盡快升級到 Webpack 5，以充分利用這些新特性和改進。在遷移過程中，需要注意一些破壞性變更，特別是 Node.js 核心模塊的 polyfill 變更，但總體而言，遷移成本相對較低，帶來的收益卻非常顯著。
