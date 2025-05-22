---
title: Webpack實際案例與最佳實踐
date: 2025-05-05
slug: webpack-case-studies-best-practices
category: webpack
---

## 從零構建一個完整的應用

以下將展示如何從零開始使用 Webpack 構建一個現代的 React 應用，綜合運用前面所學的各種技術。

### 項目初始化

首先，創建項目目錄並初始化 package.json：

```bash
mkdir webpack-react-app
cd webpack-react-app
npm init -y
```

### 安裝核心依賴

```bash
# Webpack 核心
npm install webpack webpack-cli webpack-dev-server --save-dev

# React 相關
npm install react react-dom react-router-dom

# 轉譯相關
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader --save-dev

# 樣式相關
npm install css-loader style-loader sass sass-loader postcss postcss-loader autoprefixer --save-dev

# 資源處理
npm install file-loader url-loader html-webpack-plugin mini-css-extract-plugin --save-dev

# 優化相關
npm install terser-webpack-plugin css-minimizer-webpack-plugin --save-dev

# 工具類
npm install dotenv cross-env --save-dev
```

### 創建目錄結構

```
webpack-react-app/
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   └── App.js
│   ├── styles/
│   │   └── main.scss
│   └── index.js
├── public/
│   └── index.html
├── webpack/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── .babelrc
├── .env
├── .gitignore
├── package.json
└── README.md
```

### 配置 Babel

```json
// .babelrc
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ],
  "plugins": []
}
```

### 基礎 Webpack 配置

```javascript
// webpack/webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@components": path.resolve(__dirname, "../src/components"),
      "@styles": path.resolve(__dirname, "../src/styles"),
      "@assets": path.resolve(__dirname, "../src/assets"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10KB 以下使用 Data URL
          },
        },
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      favicon: path.resolve(__dirname, "../src/assets/favicon.ico"),
      inject: true,
    }),
  ],
};
```

### 開發環境配置

```javascript
// webpack/webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: path.resolve(__dirname, "../dist"),
    hot: true,
    open: true,
    port: 3000,
    compress: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["react-refresh/babel"],
            },
          },
        ],
      },
    ],
  },
});
```

### 生產環境配置

```javascript
// webpack/webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/[name].[contenthash].js",
    chunkFilename: "js/[name].[contenthash].chunk.js",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      name: false,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].chunk.css",
    }),
    ...(process.env.ANALYZE === "true"
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "bundle-report.html",
            openAnalyzer: false,
          }),
        ]
      : []),
  ],
});
```

### 創建 React 應用

```jsx
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "@components/App";
import "@styles/main.scss";

ReactDOM.render(<App />, document.getElementById("root"));
```

```jsx
// src/components/App.js
import React from "react";
import logo from "@assets/logo.png";

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>Welcome to React with Webpack</h1>
        <p>
          Edit <code>src/components/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
};

export default App;
```

```scss
// src/styles/main.scss
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  text-align: center;

  &-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }

  &-logo {
    height: 40vmin;
    pointer-events: none;
  }
}
```

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 配置 package.json 腳本

```json
{
  "scripts": {
    "start": "webpack serve --config webpack/webpack.dev.js",
    "build": "webpack --config webpack/webpack.prod.js",
    "analyze": "cross-env ANALYZE=true npm run build"
  }
}
```

### 運行項目

```bash
# 啟動開發服務器
npm start

# 構建生產版本
npm run build

# 分析生產包
npm run analyze
```

## 常見問題與解決方案

在使用 Webpack 的過程中，開發者可能會遇到各種問題。以下是一些常見問題及其解決方案。

### 打包速度慢

#### 問題症狀

項目規模增長後，每次構建需要幾分鐘甚至更長時間。

#### 解決方案

1. **使用 thread-loader 開啟多線程編譯**

```javascript
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
              workers: 4, // 指定工作線程數量
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
};
```

2. **採用持久化緩存**

```javascript
module.exports = {
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".temp_cache"),
  },
};
```

3. **減少解析範圍**

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

### 打包體積過大

#### 問題症狀

生產環境打包後的 JavaScript 文件體積超過了 1MB，影響頁面加載速度。

#### 解決方案

1. **啟用代碼分割**

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      maxInitialRequests: 30,
      minSize: 20000,
    },
  },
};
```

2. **使用動態導入**

```javascript
// 使用動態導入
const LazyComponent = React.lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

3. **Bundle 分析優化**

```bash
npm run analyze
```

通過分析報告，找出體積較大的模塊並優化，例如替換大型依賴庫：

```javascript
// 替換 moment.js
// npm uninstall moment
// npm install date-fns
import { format } from "date-fns";
const formattedDate = format(new Date(), "yyyy-MM-dd");
```

### 開發環境熱更新不生效

#### 問題症狀

修改代碼後，瀏覽器不會自動更新，或者更新後狀態丟失。

#### 解決方案

1. **檢查 webpack-dev-server 配置**

```javascript
module.exports = {
  devServer: {
    hot: true,
    client: {
      overlay: true,
      progress: true,
    },
  },
};
```

2. **使用 React Fast Refresh**

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

```javascript
// webpack.dev.js
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  plugins: [new ReactRefreshWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["react-refresh/babel"],
            },
          },
        ],
      },
    ],
  },
};
```

### 靜態資源處理問題

#### 問題症狀

圖片或字體等靜態資源無法正確加載，或者在生產環境下路徑錯誤。

#### 解決方案

1. **配置資源模塊**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 小於 4KB 的圖片轉為 Data URL
          },
        },
        generator: {
          filename: "assets/images/[name].[hash:8][ext]",
        },
      },
    ],
  },
};
```

2. **設置正確的 publicPath**

```javascript
module.exports = {
  output: {
    publicPath: "/", // 或 "./" 或 CDN 路徑
  },
};
```

3. **使用 copy-webpack-plugin 複製靜態資源**

```javascript
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public/robots.txt", to: "" },
        { from: "public/static", to: "static" },
      ],
    }),
  ],
};
```

## Webpack 最佳實踐

### 目錄結構

推薦的 Webpack 項目目錄結構：

```
project/
├── src/                 # 源代碼目錄
│   ├── assets/         # 靜態資源
│   ├── components/     # 組件
│   ├── pages/          # 頁面
│   ├── utils/          # 工具函數
│   ├── styles/         # 全局樣式
│   └── index.js        # 主入口
├── public/              # 靜態文件目錄
│   ├── index.html      # HTML 模板
│   └── favicon.ico     # 站點圖標
├── webpack/             # Webpack 配置
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── tests/               # 測試
├── .babelrc             # Babel 配置
├── .eslintrc            # ESLint 配置
├── .prettierrc          # Prettier 配置
├── package.json
└── README.md
```

### 按環境區分配置

使用不同環境的配置文件：

```javascript
// webpack/webpack.common.js - 共享配置
const common = {
  /* ... */
};

// webpack/webpack.dev.js - 開發環境
const { merge } = require("webpack-merge");
module.exports = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  // 其他開發環境配置...
});

// webpack/webpack.prod.js - 生產環境
module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  // 其他生產環境配置...
});
```

### 使用 DotEnv 管理環境變量

```bash
npm install --save-dev dotenv
```

```javascript
// webpack.config.js
const Dotenv = require("dotenv-webpack");

module.exports = {
  plugins: [
    new Dotenv({
      path: `.env.${process.env.NODE_ENV}`, // 載入對應環境的 .env 文件
    }),
  ],
};
```

```
# .env.development
API_URL=http://localhost:3001/api

# .env.production
API_URL=https://api.example.com
```

### 優化 Loader 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"), // 使用 include 而非 exclude
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 啟用 babel 緩存
            },
          },
        ],
      },
    ],
  },
};
```

### 使用 externals 減小打包體積

```javascript
module.exports = {
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
```

```html
<script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
```

### 打包分析與優化

使用分析工具找出可優化點：

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    process.env.ANALYZE === "true" &&
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "bundle-report.html",
      }),
  ].filter(Boolean),
};
```

### 利用持久化緩存

```javascript
module.exports = {
  output: {
    filename: "[name].[contenthash].js", // 使用內容哈希
  },
  optimization: {
    moduleIds: "deterministic", // 確定性模塊 ID
    runtimeChunk: "single", // 提取運行時代碼
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

## 總結

本章通過一個完整的案例，展示了如何從零開始使用 Webpack 構建現代前端應用。我們學習了項目結構組織、環境配置分離、常見問題的解決方法和最佳實踐。

Webpack 作為一個功能強大的模塊打包工具，已經成為前端開發不可或缺的一部分。掌握 Webpack 的配置和優化技巧，可以大幅提升開發效率和應用性能，為用戶提供更好的體驗。

隨著前端技術的不斷發展，Webpack 也在持續更新和進化。作為開發者，我們應該保持學習的態度，跟進新的特性和最佳實踐，以便更好地應對不斷變化的前端開發需求。
