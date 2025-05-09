---
title: Webpack Plugins：擴展打包功能
date: 2023-05-22
slug: plugins
category: webpack
---

## Plugin 是什麼？

Webpack Plugin 是 Webpack 生態系統中的重要組成部分，它們用於執行範圍更廣的任務，從打包優化和壓縮，到重新定義環境中的變數。Plugin 能夠 "hook" 到 Webpack 的整個生命週期中的事件，在打包過程的關鍵時刻執行自定義的功能。

## Plugins vs Loaders

- **Loaders**：用於轉換某些類型的模組，操作單個文件（在打包前或打包時）
- **Plugins**：能夠執行更廣泛的任務，例如打包優化、資源管理和注入環境變數，影響整個打包過程

## 常用的 Plugins

### 1. HtmlWebpackPlugin

這個插件會為你生成一個 HTML 文件，並自動將生成的所有 bundle 引入到這個 HTML 文件中。

```bash
npm install html-webpack-plugin --save-dev
```

配置：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...其他配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "我的 Webpack 專案",
      template: "./src/index.html",
    }),
  ],
};
```

### 2. MiniCssExtractPlugin

這個插件將 CSS 提取到單獨的文件中，而不是內聯在 JavaScript 中。這在生產環境中特別有用。

```bash
npm install mini-css-extract-plugin --save-dev
```

配置：

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...其他配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
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

### 3. CleanWebpackPlugin

這個插件在每次構建前清理 `/dist` 文件夾，確保生成的文件都是最新的。

```bash
npm install clean-webpack-plugin --save-dev
```

配置：

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // ...其他配置
  plugins: [new CleanWebpackPlugin()],
};
```

### 4. DefinePlugin

這是 Webpack 內置的插件，允許在編譯時創建全局常量，非常適合設定不同環境的配置。

```javascript
const webpack = require("webpack");

module.exports = {
  // ...其他配置
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      DEBUG: process.env.NODE_ENV === "development",
    }),
  ],
};
```

### 5. CopyWebpackPlugin

用於將單個文件或整個目錄復制到構建目錄。

```bash
npm install copy-webpack-plugin --save-dev
```

配置：

```javascript
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // ...其他配置
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "source", to: "dest" },
        { from: "other", to: "public" },
      ],
    }),
  ],
};
```

## 開發自定義 Plugin

如果內建或社區的 Plugin 不能滿足你的需求，你可以開發自己的 Plugin。Webpack Plugin 是一個具有 `apply` 方法的 JavaScript 類：

```javascript
class MyWebpackPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    // 在這裡訪問 Webpack compiler 的事件鉤子
    compiler.hooks.emit.tapAsync("MyWebpackPlugin", (compilation, callback) => {
      console.log("這是一個自定義插件示例!");
      console.log("這裡的資源列表:", Object.keys(compilation.assets));

      // 創建新資源
      compilation.assets["fileList.txt"] = {
        source: function () {
          return Object.keys(compilation.assets).join("\n");
        },
        size: function () {
          return Object.keys(compilation.assets).join("\n").length;
        },
      };

      callback();
    });
  }
}

module.exports = MyWebpackPlugin;
```

## 心得總結

在我從零開始學習 Webpack 的過程中，Plugins 是我最喜歡的功能之一。雖然配置起來有時候會比較複雜，但是它們提供的功能非常強大，可以極大地提升開發效率和最終產品的質量。

我發現，合理使用 Plugins 是優化 Webpack 打包過程的關鍵。例如，使用 MiniCssExtractPlugin 和 TerserPlugin 可以顯著減小打包後的文件體積，而 HtmlWebpackPlugin 則大大簡化了 HTML 文件的管理。

對於初學者來說，建議先從常用的插件開始學習，理解它們的作用和配置方式。隨著對 Webpack 理解的加深，你可以嘗試更多高級插件，甚至開發自己的插件來滿足特定需求。

在下一篇文章中，我將分享如何配置 Webpack 開發服務器，實現熱模塊替換（HMR），讓前端開發更加高效和愉快。
