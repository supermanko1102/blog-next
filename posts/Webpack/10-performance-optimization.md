---
title: Webpack性能優化
date: 2025-05-02
slug: webpack-performance-optimization
category: webpack
---

## 打包速度優化

在大型項目中，Webpack 的打包速度可能會變得緩慢，影響開發效率。以下是一些提升打包速度的方法：

### 使用最新版本的 Webpack

確保使用最新版本的 Webpack，因為每個新版本通常都會帶來性能改進。

```bash
npm install webpack webpack-cli --save-dev
```

### 使用 cache 緩存

Webpack 5 內置了持久化緩存，可以顯著提高重複構建的速度：

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: "filesystem", // 使用文件系統緩存
    buildDependencies: {
      config: [__filename], // 當配置文件變更時，重建緩存
    },
  },
};
```

### 使用 thread-loader 或 parallel-webpack

對於 CPU 密集型任務（如 babel 轉譯或 TypeScript 編譯），可以使用多線程處理：

```bash
npm install thread-loader --save-dev
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus().length - 1, // 使用 CPU 核心數量減 1
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
};
```

### 減少解析範圍

使用 `include` 或 `exclude` 限制 loader 處理的文件範圍：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"), // 只處理 src 目錄
        use: "babel-loader",
      },
    ],
  },
};
```

### 使用 DllPlugin 預編譯第三方庫

對於較少變動的依賴庫，使用 DllPlugin 進行預編譯：

```javascript
// webpack.dll.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "lodash"], // 指定第三方庫
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].dll.js",
    library: "[name]_library",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist", "[name]-manifest.json"),
      name: "[name]_library",
    }),
  ],
};
```

```javascript
// webpack.config.js
const webpack = require("webpack");

module.exports = {
  // 其他配置...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require("./dist/vendor-manifest.json"),
    }),
  ],
};
```

### 使用 esbuild-loader 替代 babel-loader

esbuild 是一個極快的 JavaScript 打包工具，其 loader 可以大幅提高轉譯速度：

```bash
npm install esbuild-loader --save-dev
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
        },
      },
    ],
  },
};
```

## 打包體積優化

減小打包體積不僅可以加快加載速度，還能節省帶寬和提高用戶體驗：

### 代碼分割 (Code Splitting)

使用 SplitChunksPlugin 提取公共模塊：

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all", // 對所有模塊進行分割
      minSize: 20000, // 生成 chunk 的最小體積
      maxSize: 0, // 不限制最大體積
      minChunks: 1, // 被引用的最少次數
      maxAsyncRequests: 30, // 按需加載時的最大並行請求數
      maxInitialRequests: 30, // 入口的最大並行請求數
      automaticNameDelimiter: "~", // 名稱分隔符
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name(module) {
            // 根據包名創建獨立的 chunk
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace("@", "")}`;
          },
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

### 使用 Tree Shaking

確保 Tree Shaking 生效，移除未使用的代碼：

```javascript
// package.json
{
  "sideEffects": false // 或提供有副作用的文件數組
}

// webpack.config.js
module.exports = {
  mode: "production",
  optimization: {
    usedExports: true
  }
};
```

### 壓縮 JavaScript, CSS 和 HTML

使用 Terser 和 CSS Minimizer：

```bash
npm install css-minimizer-webpack-plugin terser-webpack-plugin --save-dev
```

```javascript
// webpack.config.js
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 使用多進程並行運行
        terserOptions: {
          compress: {
            unused: true,
            drop_console: true, // 移除 console
          },
        },
        extractComments: false, // 不提取註釋
      }),
      new CssMinimizerPlugin(),
    ],
  },
};
```

### 圖片和靜態資源優化

使用適當的 loader 和插件優化圖片：

```bash
npm install image-webpack-loader --save-dev
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset", // Webpack 5 內置資源模塊類型
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb 以下使用 Data URL
          },
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 運行時性能優化

除了打包階段的優化，還需要考慮應用運行時的性能：

### 懶加載和動態導入

使用動態導入實現按需加載：

```javascript
// 普通導入
import { Chart } from "./chart";

// 改為懶加載
const Chart = () => import(/* webpackChunkName: "chart" */ "./chart");

// 在 React 中使用
import React, { Suspense, lazy } from "react";
const Chart = lazy(() => import("./Chart"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
}
```

### 預加載和預獲取

使用 Webpack 魔法註釋預獲取或預加載模塊：

```javascript
// 預加載：立即開始加載
import(/* webpackPreload: true */ "./critical-module");

// 預獲取：瀏覽器空閒時加載
import(/* webpackPrefetch: true */ "./future-module");
```

### 使用長期緩存

使用內容哈希確保文件內容改變才會改變文件名：

```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
  },
};
```

## 分析和監控工具

使用以下工具分析和監控 Webpack 打包結果，找出優化點：

### webpack-bundle-analyzer

直觀顯示打包後的文件構成和大小：

```bash
npm install webpack-bundle-analyzer --save-dev
```

```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
    }),
  ],
};
```

### speed-measure-webpack-plugin

測量各個插件和 loader 的執行時間：

```bash
npm install speed-measure-webpack-plugin --save-dev
```

```javascript
// webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

// 將你的配置包裹在 smp.wrap() 中
module.exports = smp.wrap({
  // 原始的 Webpack 配置
  entry: "./src/index.js",
  output: {
    // ...
  },
});
```

### webpack-dashboard

更友好的 Webpack 輸出界面：

```bash
npm install webpack-dashboard --save-dev
```

```javascript
// webpack.config.js
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  plugins: [new DashboardPlugin()],
};
```

## 實際優化案例

### 案例一：從 2MB 到 500KB

某個 React 應用優化過程：

1. 使用 Tree Shaking 和 Scope Hoisting
2. 使用 dynamic import 替代全量導入
3. 使用 React.lazy 和 Suspense 實現組件懶加載
4. 優化第三方庫，如使用 lodash-es 替代 lodash
5. 使用 webpack-bundle-analyzer 定位大型依賴

### 案例二：打包時間從 120 秒降到 20 秒

大型企業應用的構建優化：

1. 升級到 Webpack 5 並啟用持久化緩存
2. 使用 esbuild-loader 替代 babel-loader
3. 將常用第三方庫使用 DllPlugin 預編譯
4. 優化 resolve.modules 和 resolve.extensions 配置
5. 使用 thread-loader 進行多線程編譯

## 總結

Webpack 性能優化是一個持續的過程，涉及多個層面：打包速度、打包體積和運行時性能。通過合適的分析工具找出瓶頸，再針對性地應用相應的優化策略。記住，不必一次應用所有優化手段，而是根據項目實際情況選擇最有效的方法。

定期更新 Webpack 和相關依賴也是保持性能的重要一環，因為新版本通常會帶來性能改進和 bug 修復。最後，確保在開發環境和生產環境使用不同的優化策略，開發環境注重速度和開發體驗，而生產環境則應注重最終用戶體驗。
