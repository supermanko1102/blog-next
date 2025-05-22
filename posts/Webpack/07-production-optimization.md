---
title: Webpack生產環境優化
date: 2025-04-28
slug: webpack-production-optimization
category: webpack
---

## 生產環境與開發環境的區別

開發環境和生產環境需要不同的 Webpack 配置，因為它們各自有不同的目標：

- **開發環境**：注重開發體驗，需要快速的編譯速度、熱更新、便於調試的源碼映射等功能。
- **生產環境**：注重最終用戶體驗，需要代碼壓縮、體積優化、性能提升等功能。

### 區分配置的方式

1. **使用環境變量**：

```javascript
// webpack.config.js
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  // 其他配置
};
```

2. **使用多個配置文件**：
   - webpack.common.js (公共配置)
   - webpack.dev.js (開發配置)
   - webpack.prod.js (生產配置)

結合 `webpack-merge` 使用：

```javascript
// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  // 生產環境特有配置
});
```

## 代碼分割（Code Splitting）

代碼分割允許將應用程序拆分成多個小塊，實現按需加載或並行加載，從而減少初始加載時間。

### 幾種代碼分割方法

1. **入口點分割**：通過配置多個 entry 點：

```javascript
module.exports = {
  entry: {
    main: "./src/index.js",
    vendor: "./src/vendor.js",
  },
};
```

2. **防止重複**：使用 SplitChunksPlugin 提取共享模塊：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
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

3. **動態導入**：使用 ES 模塊的動態導入特性：

```javascript
// 動態導入示例
import(/* webpackChunkName: "lodash" */ "lodash").then(({ default: _ }) => {
  console.log(_.join(["Hello", "webpack"], " "));
});
```

## 樹搖（Tree Shaking）

樹搖是一種優化技術，用於移除未使用的代碼（死代碼）。Webpack 在生產模式下默認啟用該功能。

### 啟用樹搖的條件

1. 使用 ES 模塊語法（import/export）
2. 在 package.json 中設置 `"sideEffects"` 屬性
3. 使用生產模式或者手動啟用相關優化

```javascript
// package.json
{
  "sideEffects": false, // 或者提供一個不應該被樹搖的文件數組
}

// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true
  }
};
```

### 註意事項

- CSS 文件和 polyfills 通常有副作用，應該在 `sideEffects` 數組中排除
- 確保你的代碼是可樹搖的（避免間接依賴和副作用）

## 懶加載（Lazy Loading）

懶加載是一種按需加載模塊的技術，可以顯著提高應用程序的初始加載性能。

### 實現方式

1. **使用動態導入**：

```javascript
// 路由懶加載示例
const UserProfile = () =>
  import(/* webpackChunkName: "profile" */ "./pages/UserProfile");

// 事件觸發的懶加載
button.addEventListener("click", () => {
  import(/* webpackChunkName: "editor" */ "./editor").then((module) => {
    const editor = module.default;
    editor.initialize();
  });
});
```

2. **React 中的懶加載**：

```javascript
import React, { Suspense, lazy } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 預加載與預獲取

```html
<!-- 預獲取：瀏覽器空閒時獲取 -->
<link rel="prefetch" href="chunk.js" />

<!-- 預加載：立即開始加載 -->
<link rel="preload" href="chunk.js" />
```

在 Webpack 中配置：

```javascript
import(/* webpackPrefetch: true */ "./path/to/module");
import(/* webpackPreload: true */ "./path/to/module");
```

## 壓縮與最小化

壓縮和最小化是減小生產環境中資源體積的關鍵技術。

### JavaScript 壓縮

Webpack 5 默認在生產模式使用 TerserPlugin：

```javascript
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console
            pure_funcs: ["console.log"], // 移除特定函數
          },
          mangle: true,
          output: {
            comments: false, // 移除註釋
          },
        },
        extractComments: false,
      }),
    ],
  },
};
```

### CSS 壓縮

使用 CssMinimizerPlugin：

```javascript
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
};
```

### HTML 壓縮

使用 HtmlWebpackPlugin 的 minify 選項：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],
};
```

## 生產環境的其他優化

### 1. 提取 CSS 到獨立文件

使用 MiniCssExtractPlugin 將 CSS 提取到單獨的文件中：

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 替代 style-loader
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
};
```

### 2. 為靜態資源添加哈希

為了實現長期緩存，對輸出文件名添加內容哈希：

```javascript
module.exports = {
  output: {
    filename: "[name].[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),
  ],
};
```

### 3. 使用 contenthash 而非 hash

- **hash**：構建相關，整個構建改變則 hash 改變
- **chunkhash**：塊相關，塊內容改變則 chunkhash 改變
- **contenthash**：文件內容相關，更精確的緩存控制

## 總結

生產環境的優化是 Webpack 的重要使用場景。通過代碼分割、樹搖、懶加載和資源壓縮等技術，我們可以顯著減小打包體積，提高加載速度，改善用戶體驗。

在實際工作中，需要針對不同項目的具體情況選擇適合的優化策略。有時候，過度優化可能會帶來維護困難，因此需要在性能和可維護性之間找到平衡點。
