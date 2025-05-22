---
title: Webpack高級配置
date: 2025-04-29
slug: webpack-advanced-configuration
category: webpack
---

## 多頁面應用配置

隨著項目規模的擴大，單頁面應用（SPA）可能無法滿足所有需求，這時候我們可能需要考慮多頁面應用（MPA）的配置。

### 基本配置方法

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  // 定義多個入口
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
    contact: "./src/contact.js",
  },

  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    // 為每個入口創建一個 HTML 文件
    new HtmlWebpackPlugin({
      template: "./src/templates/home.html",
      filename: "home.html",
      chunks: ["home"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/about.html",
      filename: "about.html",
      chunks: ["about"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/contact.html",
      filename: "contact.html",
      chunks: ["contact"],
    }),
  ],
};
```

### 自動化多頁面配置

對於大型多頁面應用，手動配置每個頁面會變得繁瑣，我們可以使用代碼自動生成配置：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

// 讀取 pages 目錄下的所有頁面
const pagesDir = path.resolve(__dirname, "src/pages");
const pages = fs.readdirSync(pagesDir);

// 生成入口配置
const entry = {};
// 生成 HTML 插件配置
const htmlPlugins = [];

pages.forEach((page) => {
  const name = page.split(".")[0];
  entry[name] = `./src/pages/${page}`;

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      template: "./src/templates/template.html",
      filename: `${name}.html`,
      chunks: [name],
    })
  );
});

module.exports = {
  entry,
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [...htmlPlugins],
};
```

### 共享公共代碼

對於多頁面應用，可以使用 SplitChunksPlugin 提取共用的代碼：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
        },
      },
    },
  },
};
```

## 環境變量與模式

在不同環境（開發、測試、生產）中，我們可能需要不同的配置值，Webpack 提供了多種方式處理這種情況。

### 使用 DefinePlugin

DefinePlugin 允許在編譯時創建全局常量，這對於設置環境變量非常有用：

```javascript
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("1.2.3"),
    }),
  ],
};
```

在代碼中使用這些常量：

```javascript
if (process.env.NODE_ENV === "development") {
  console.log("Debug info");
}

if (PRODUCTION) {
  console.log(`Running in production mode, version ${VERSION}`);
}
```

### 使用 .env 文件

結合 `dotenv` 包和 DefinePlugin，我們可以從 .env 文件加載環境變量：

```javascript
const webpack = require("webpack");
const dotenv = require("dotenv");

// 載入 .env 文件
const env = dotenv.config().parsed;

// 轉換為 webpack 定義格式
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  plugins: [new webpack.DefinePlugin(envKeys)],
};
```

### 使用環境特定的配置文件

另一種方法是為每個環境創建專用的配置文件：

```
webpack.common.js    # 公共配置
webpack.dev.js       # 開發配置
webpack.prod.js      # 生產配置
webpack.test.js      # 測試配置
```

然後使用 `webpack-merge` 合併配置：

```javascript
// webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
  },
});
```

## 自定義解析規則

Webpack 的 `resolve` 選項允許自定義模塊解析規則，這對於簡化導入路徑和處理特殊情況非常有用。

### 解析擴展名

自動解析指定擴展名，這樣在導入時可以省略擴展名：

```javascript
module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
};
```

使用時：

```javascript
import Component from "./Component"; // 無需 ./Component.jsx
```

### 設置別名

為常用目錄設置別名，簡化導入路徑：

```javascript
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
};
```

在代碼中使用：

```javascript
import Button from "@components/Button";
import { formatDate } from "@utils/date";
import "@styles/main.css";
```

### 模塊解析優先級

指定模塊查找的優先順序：

```javascript
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
};
```

### 自定義解析插件

對於更複雜的解析需求，可以使用 resolve 插件：

```javascript
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = {
  resolve: {
    plugins: [
      // 允許將目錄作為模塊導入（將自動查找 index 文件）
      new DirectoryNamedWebpackPlugin(),
    ],
  },
};
```

## 外部依賴（Externals）

對於某些庫，我們不希望將它們打包到最終的輸出文件中，而是從外部獲取這些依賴。比如通過 CDN 加載的庫。

### 基本用法

```javascript
module.exports = {
  externals: {
    jquery: "jQuery",
    react: "React",
    "react-dom": "ReactDOM",
  },
};
```

這告訴 Webpack 不要打包這些模塊，而在運行時從全局變量獲取它們。

然後在 HTML 中通過 CDN 引入這些庫：

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
```

### 更複雜的配置

對於更複雜的情況，externals 可以使用函數或正則表達式：

```javascript
module.exports = {
  externals: [
    // 排除所有 node_modules 中的模塊
    function ({ context, request }, callback) {
      if (/^(jquery|\$)$/i.test(request)) {
        // jQuery 導出為全局變量 jQuery 和 $
        return callback(null, "jQuery");
      }
      if (/^lodash/.test(request)) {
        // Lodash 導出為全局變量 _
        return callback(null, "_");
      }
      callback();
    },
  ],
};
```

## 模塊聯邦（Module Federation）

Webpack 5 引入的模塊聯邦允許多個獨立構建的應用共享模塊，這是一種實現微前端架構的強大方式。

### 配置 Host 應用

```javascript
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        remote_app: "remote_app@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^17.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^17.0.0",
        },
      },
    }),
  ],
};
```

### 配置 Remote 應用

```javascript
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
        "./ProductList": "./src/components/ProductList",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^17.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^17.0.0",
        },
      },
    }),
  ],
};
```

### 在 Host 應用中使用 Remote 組件

```javascript
import React, { Suspense } from "react";

// 動態加載 Remote 組件
const RemoteButton = React.lazy(() => import("remote_app/Button"));

function App() {
  return (
    <div>
      <h1>Host Application</h1>
      <Suspense fallback={<div>Loading Button...</div>}>
        <RemoteButton />
      </Suspense>
    </div>
  );
}
```

## 總結

在本章中，我們探討了 Webpack 的多種高級配置選項，包括多頁面應用配置、環境變量處理、自定義解析規則、外部依賴以及模塊聯邦。這些高級特性使 Webpack 能夠適應各種複雜的前端開發場景，為開發者提供了更大的靈活性和功能性。

通過掌握這些高級配置，你可以更好地定制你的 Webpack 構建過程，以滿足特定項目的需求，無論是小型單頁應用還是大型多頁企業級應用。
