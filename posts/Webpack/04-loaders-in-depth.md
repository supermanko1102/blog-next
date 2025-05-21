---
title: Webpack Loader深入理解
date: 2024-05-23
slug: webpack-loaders-in-depth
category: webpack
---

## Loader 的工作原理

Webpack 的核心功能是處理 JavaScript 模組，但在現代前端開發中，我們需要處理各種類型的資源，如 CSS、圖片、字體等。這就是 Loader 發揮作用的地方。

### Loader 是什麼？

Loader 是一種轉換器，用於將某種格式的文件轉換為 Webpack 可以處理的模組。

在技術上，**Loader 本質上是一個函數**，它接收源文件的內容作為參數，返回轉換後的結果：

```javascript
module.exports = function (source) {
  // 對 source 進行轉換...
  return transformedSource;
};
```

### Webpack 如何使用 Loader？

Webpack 在構建過程中會遇到不同類型的文件，處理流程如下：

1. **解析依賴**：Webpack 從入口文件開始，識別 `import`/`require` 語句
2. **匹配規則**：檢查文件路徑是否匹配 `module.rules` 中的 `test` 配置
3. **應用 Loader**：如果匹配成功，按照配置使用對應的 Loader 處理文件
4. **獲取結果**：Loader 處理完成後，Webpack 獲取轉換結果
5. **繼續處理**：將處理後的內容視為 JavaScript 模組，繼續解析其中的依賴

### Loader 的執行環境

Loader 在 Node.js 環境中執行，可以使用任何 Node.js API。Webpack 通過 `this` 上下文向 Loader 提供各種方法和屬性：

- `this.context`：當前處理文件的所在目錄
- `this.resource`：當前處理文件的完整路徑
- `this.resourceQuery`：文件的查詢參數
- `this.callback`：返回多個結果的函數
- `this.async`：告訴 Webpack 這個 Loader 將異步處理

### Loader 與 Webpack 的接口

Loader 可以通過多種方式與 Webpack 交互：

**1. 返回 JavaScript 代碼**

最簡單的 Loader 直接返回轉換後的 JavaScript 代碼：

```javascript
module.exports = function (source) {
  return `export default ${JSON.stringify(source)}`;
};
```

**2. 使用 `this.callback()`**

當需要返回多個結果時，使用 `this.callback()`：

```javascript
module.exports = function (source, sourceMap) {
  // 錯誤、源碼、sourcemap、AST...
  this.callback(null, source, sourceMap);
  return; // 使用 callback 後必須返回 undefined
};
```

**3. 使用 `this.async()`**

對於異步處理，使用 `this.async()`：

```javascript
module.exports = function (source) {
  const callback = this.async();

  someAsyncOperation(source, function (err, result) {
    if (err) return callback(err);
    callback(null, result);
  });
};
```

## 常用 Loader 介紹

### babel-loader

`babel-loader` 是最常用的 JavaScript 轉換工具，它使用 Babel 將 ES6+ 代碼轉換為向後兼容的 JavaScript。

**安裝**:

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

**配置**:

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-proposal-class-properties"],
        },
      },
    },
  ];
}
```

**特性**:

- 支援最新的 JavaScript 語法
- 可配置目標瀏覽器環境
- 可通過 `.babelrc` 或 `babel.config.js` 進行複雜配置

### css-loader

`css-loader` 解析 CSS 文件中的 `@import` 和 `url()` 表達式，將它們視為 `import/require()`。

**安裝**:

```bash
npm install --save-dev css-loader
```

**配置**:

```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}
```

**特性**:

- 解析 `@import` 和 `url()`
- 支援 CSS Modules
- 可以啟用或禁用源碼映射

### style-loader

`style-loader` 將 CSS 注入到 DOM 中，通常與 `css-loader` 一起使用。

**安裝**:

```bash
npm install --save-dev style-loader
```

**配置**:

```javascript
{
  test: /\.css$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        injectType: 'styleTag' // 或 'singletonStyleTag', 'lazyStyleTag' 等
      }
    },
    'css-loader'
  ]
}
```

**特性**:

- 動態注入 CSS 到 DOM
- 支援 HMR（熱模組替換）
- 可選擇不同的注入方式

### vue-loader

`vue-loader` 用於處理 Vue 單文件組件（`.vue` 文件）。

**安裝**:

```bash
npm install --save-dev vue-loader vue-template-compiler
```

**配置**:

```javascript
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
```

**特性**:

- 支援 Vue 單文件組件
- 支援熱重載
- 預處理器支援（如 SCSS、TypeScript）

### file-loader 和 url-loader

這兩個 loader 用於處理文件資源，在上一章已經詳細介紹過。

### ts-loader

`ts-loader` 用於將 TypeScript 轉換為 JavaScript。

**安裝**:

```bash
npm install --save-dev typescript ts-loader
```

**配置**:

```javascript
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

**特性**:

- TypeScript 編譯
- 類型檢查整合
- 可與 Babel 配合使用

### 其他常用 loader

- `sass-loader`：處理 SASS/SCSS 文件
- `less-loader`：處理 LESS 文件
- `postcss-loader`：使用 PostCSS 處理 CSS
- `html-loader`：處理 HTML 文件
- `raw-loader`：將文件作為字符串導入
- `json-loader`：處理 JSON 文件（現在內置在 Webpack 中）

## Loader 的鏈式調用

當一個資源需要多個轉換步驟時，可以使用 loader 鏈。在 Webpack 中，**loader 的執行順序是從右到左、從下到上**。

### 執行順序示例

以處理 SCSS 文件為例：

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader',   // 第三步：將 CSS 注入到 DOM
    'css-loader',     // 第二步：解析 CSS 和依賴
    'sass-loader'     // 第一步：將 SCSS 轉換為 CSS
  ]
}
```

執行順序為：`sass-loader` → `css-loader` → `style-loader`。

### 鏈中的數據傳遞

每個 loader 處理完成後，將結果傳給下一個 loader：

1. `sass-loader` 將 SCSS 轉換為普通 CSS
2. `css-loader` 解析 CSS 代碼，處理 `@import` 和 `url()`
3. `style-loader` 將 CSS 注入到 DOM 中

### 傳遞選項給 loader

可以通過兩種方式傳遞選項：

**1. 通過查詢參數（舊方式）**:

```javascript
{
  test: /\.css$/,
  use: 'css-loader?modules=true&importLoaders=1'
}
```

**2. 通過物件形式（推薦）**:

```javascript
{
  test: /\.css$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1
      }
    }
  ]
}
```

### 內聯 loader

也可以在 `import` 語句中直接使用 loader：

```javascript
import styles from "!style-loader!css-loader!./styles.css";
```

但不推薦這種方式，因為它混合了業務邏輯和構建邏輯。

## 編寫自定義 Loader

有時候，現有的 loader 無法滿足特定需求，這時可以編寫自定義 loader。

### Loader 的基本結構

一個最簡單的 loader 如下：

```javascript
// my-loader.js
module.exports = function (source) {
  // 對源碼進行處理
  const result = source.replace(/hello/g, "hi");

  // 返回處理後的結果
  return result;
};
```

### 使用 Loader API

Webpack 提供了豐富的 API 供 loader 使用：

```javascript
module.exports = function (source) {
  // 開啟 loader 緩存
  this.cacheable && this.cacheable();

  // 獲取選項
  const options = this.getOptions() || {};

  // 生成異步回調
  const callback = this.async();

  // 資源路徑
  const resourcePath = this.resourcePath;

  // 處理後異步返回
  processSourceAsync(source, options, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
```

### 實例：創建一個簡單的 Banner Loader

這個 loader 會在文件頂部添加一條注釋，用於聲明版權等信息：

```javascript
// banner-loader.js
const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");

const schema = {
  type: "object",
  properties: {
    text: {
      type: "string",
    },
  },
  additionalProperties: false,
};

module.exports = function (source) {
  this.cacheable();

  const options = this.getOptions();
  validateOptions(schema, options, "Banner Loader");

  const banner = options.text ? `/*! ${options.text} */\n` : "";

  return banner + source;
};
```

### 在 Webpack 中使用自定義 loader

配置方式如下：

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: path.resolve("./loaders/banner-loader"),
          options: {
            text: "Copyright © 2024",
          },
        },
      ],
    },
  ];
}
```

### 開發和測試技巧

1. **使用 `npm link`**：便於本地開發和測試
2. **獨立模組**：將 loader 作為獨立 npm 包開發
3. **最小職責**：每個 loader 只做一件事
4. **無狀態**：避免在 loader 中保存狀態

## Loader 配置技巧與優化

配置得當的 loader 可以大大提升 Webpack 的性能和開發體驗。

### 1. 縮小處理範圍

使用 `include` 和 `exclude` 限制 loader 的應用範圍：

```javascript
{
  test: /\.js$/,
  include: path.resolve(__dirname, 'src'),
  exclude: /node_modules/,
  use: 'babel-loader'
}
```

這樣可以避免對不必要的文件（如 `node_modules`）進行處理，提高編譯速度。

### 2. 模塊緩存

使用 `cache-loader` 緩存 loader 處理結果：

```bash
npm install --save-dev cache-loader
```

```javascript
{
  test: /\.js$/,
  use: [
    'cache-loader',
    'babel-loader'
  ]
}
```

### 3. 並行處理

使用 `thread-loader` 實現多線程處理：

```bash
npm install --save-dev thread-loader
```

```javascript
{
  test: /\.js$/,
  use: [
    'thread-loader',
    'babel-loader'
  ]
}
```

**注意**：`thread-loader` 會產生額外的開銷，只適合耗時較長的操作。對於小型專案，使用多線程可能反而會降低性能。

### 4. 單獨提取 CSS

在生產環境使用 `MiniCssExtractPlugin` 提取 CSS：

```bash
npm install --save-dev mini-css-extract-plugin
```

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ... 其他配置
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
    ],
  },
};
```

這樣可以將 CSS 提取到單獨的文件中，有利於瀏覽器緩存和並行加載。

### 5. 加載器特定選項優化

**babel-loader**:

```javascript
{
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,  // 啟用緩存
    cacheCompression: false,  // 禁用緩存壓縮
    compact: true  // 緊湊輸出
  }
}
```

**css-loader**:

```javascript
{
  loader: 'css-loader',
  options: {
    importLoaders: 2,  // 確保 @import 的文件也經過處理
    modules: {
      localIdentName: '[name]__[local]--[hash:base64:5]'  // 自定義 CSS Modules 名稱
    }
  }
}
```

**sass-loader**:

```javascript
{
  loader: 'sass-loader',
  options: {
    sassOptions: {
      outputStyle: 'compressed',  // 生產環境壓縮
      includePaths: [path.resolve(__dirname, 'node_modules')]  // 添加搜索路徑
    }
  }
}
```

**url-loader**:

```javascript
{
  loader: 'url-loader',
  options: {
    limit: 4096,  // 設置合理的轉換大小限制
    fallback: 'file-loader',  // 超出限制使用 file-loader
    quality: 85  // 如果適用，控制圖片質量
  }
}
```

### 6. 條件加載 loader

可以根據環境動態決定使用哪些 loader：

```javascript
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    process.env.NODE_ENV === 'production'
      ? MiniCssExtractPlugin.loader
      : 'style-loader',
    {
      loader: 'css-loader',
      options: cssOptions
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-flexbugs-fixes',
            'postcss-preset-env',
            'autoprefixer'
          ]
        }
      }
    }
  ];

  if (preProcessor) {
    loaders.push({
      loader: preProcessor
    });
  }

  return loaders;
};

// 使用方式
{
  test: /\.css$/,
  use: getStyleLoaders({ importLoaders: 1 })
},
{
  test: /\.scss$/,
  use: getStyleLoaders({ importLoaders: 3 }, 'sass-loader')
}
```

### 7. 最佳實踐

- **保持最新**：定期更新 loader 版本
- **專注職責**：一個 loader 專注做一件事
- **使用預設**：盡可能使用 loader 的預設配置
- **持久緩存**：配置合適的緩存機制
- **實測性能**：使用 `speed-measure-webpack-plugin` 測量每個 loader 的性能
- **避免重複轉換**：確保文件只被必要的 loader 處理
- **精簡配置**：只配置真正需要的選項，避免不必要的配置
- **使用解析別名**：利用 Webpack 的 `resolve.alias` 減少路徑解析時間

## 總結

Webpack loader 是一個強大的系統，它使 Webpack 能夠處理各種類型的文件。本章我們深入了解了 loader 的工作原理、常用 loader、鏈式調用、自定義 loader 開發以及配置技巧與優化。

通過合理配置和使用 loader，我們能夠創建高效、靈活的前端構建流程，處理從 JavaScript 到各種資源文件的所有轉換需求。loader 的強大在於它的可組合性和可擴展性，使 Webpack 能夠適應幾乎所有前端開發場景。

在實際開發中，選擇合適的 loader
