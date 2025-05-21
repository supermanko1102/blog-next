---
title: Webpack資源處理
date: 2024-05-22
slug: webpack-asset-handling
category: webpack
---

## 處理 JavaScript 文件

在現代前端開發中，我們經常使用 ES6+ 的語法，但由於瀏覽器支援度的問題，需要將這些現代語法轉換為兼容性更好的 ES5 代碼。Webpack 可以通過 Babel 等工具幫助我們完成這一轉換過程。

### 安裝 Babel 相關套件

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

- `babel-loader`: Webpack 與 Babel 的橋接模組
- `@babel/core`: Babel 的核心套件
- `@babel/preset-env`: 智能預設，根據目標環境自動決定需要的轉換和 polyfills

### 配置 Webpack 使用 Babel

在 `webpack.config.js` 中新增以下配置：

```javascript
module.exports = {
  // ... 其他配置
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

### 創建 Babel 配置文件

為了更好地管理 Babel 配置，我們可以創建一個單獨的 `.babelrc` 文件：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

要使用 `useBuiltIns: "usage"`，需要安裝 `core-js`：

```bash
npm install --save core-js@3
```

### 支援 React JSX

如果你的專案使用 React，還需要安裝相應的 Babel 預設：

```bash
npm install --save-dev @babel/preset-react
```

然後更新 `.babelrc`：

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

## 處理 CSS/SCSS/LESS

Webpack 本身只能處理 JavaScript，但通過 loader 可以處理各種 CSS 文件。

### 處理純 CSS

首先安裝必要的 loader：

```bash
npm install --save-dev style-loader css-loader
```

- `css-loader`: 解析 CSS 文件，處理 `@import` 和 `url()`
- `style-loader`: 將 CSS 注入到 DOM 中的 `<style>` 標籤

在 `webpack.config.js` 中增加配置：

```javascript
module.exports = {
  // ... 其他配置
  module: {
    rules: [
      // ... 其他規則
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

注意 loader 的順序是從右到左執行的，先用 `css-loader` 處理，再用 `style-loader` 注入。

### 處理 SCSS/SASS

對於 SCSS/SASS，需要額外的處理器：

```bash
npm install --save-dev sass-loader sass
```

然後更新配置：

```javascript
{
  test: /\.s[ac]ss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
}
```

### 處理 LESS

類似地，處理 LESS 需要：

```bash
npm install --save-dev less-loader less
```

配置如下：

```javascript
{
  test: /\.less$/,
  use: [
    'style-loader',
    'css-loader',
    'less-loader'
  ]
}
```

### 使用 PostCSS

PostCSS 是一個強大的 CSS 處理工具，可以自動添加 CSS 前綴等：

```bash
npm install --save-dev postcss-loader postcss autoprefixer
```

創建 `postcss.config.js`：

```javascript
module.exports = {
  plugins: [require("autoprefixer")],
};
```

更新 Webpack 配置：

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader'
  ]
}
```

### 提取 CSS 到單獨文件

在生產環境中，最好將 CSS 提取到單獨的文件：

```bash
npm install --save-dev mini-css-extract-plugin
```

更新配置：

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

## 處理靜態資源（圖片和字體）

### 使用 Asset Modules (Webpack 5)

Webpack 5 引入了內置的 Asset Modules，可以處理靜態資源，不再需要配置額外的 loader（如舊版本的 file-loader 和 url-loader）。

#### 四種資源模組類型

1. `asset/resource` - 發送一個單獨的文件並導出 URL
2. `asset/inline` - 導出資源的 Data URL (base64)
3. `asset/source` - 導出資源的源代碼
4. `asset` - 自動選擇：小文件使用 Data URL，大文件使用單獨文件

#### 配置靜態資源處理

```javascript
module.exports = {
  // 全局資源文件名配置
  output: {
    // ... 其他輸出配置
    assetModuleFilename: "assets/[name].[hash][ext][query]",
  },
  module: {
    rules: [
      // 圖片處理
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb，小於該大小的圖片轉為 Data URL
          },
        },
        generator: {
          filename: "images/[name].[hash:8][ext]", // 覆蓋 assetModuleFilename
        },
      },

      // 字體處理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource", // 始終生成單獨文件
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },

      // 處理純文本文件
      {
        test: /\.txt$/i,
        type: "asset/source", // 導出源代碼文本
      },
    ],
  },
};
```

#### 指定資源模組類型

以下是幾種不同資源類型的使用示例：

**1. 總是生成文件** (類似於 file-loader)：

```javascript
{
  test: /\.(png|jpg|gif)$/i,
  type: "asset/resource"
}
```

**2. 總是轉為 Data URL** (類似於 url-loader 且 limit 為 Infinity)：

```javascript
{
  test: /\.(png|jpg|gif)$/i,
  type: "asset/inline"
}
```

**3. 導出資源源代碼** (類似於 raw-loader)：

```javascript
{
  test: /\.txt$/i,
  type: "asset/source"
}
```

**4. 自動選擇** (類似於 url-loader 帶 limit)：

```javascript
{
  test: /\.(png|jpg|gif)$/i,
  type: "asset",
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024 // 4kb
    }
  }
}
```

#### 自定義輸出路徑

你可以使用 `generator.filename` 來自定義輸出路徑和文件名模板：

```javascript
{
  test: /\.(png|jpg|gif)$/i,
  type: "asset/resource",
  generator: {
    filename: 'static/[name].[hash:8][ext]'
  }
}
```

可用的模板字符串包括：

- `[name]`: 原始文件名（不含擴展名）
- `[ext]`: 原始文件擴展名
- `[hash]`: 文件內容的哈希值
- `[query]`: 查詢參數

### 從 Webpack 4 遷移

> 注意：如果你正在開發全新的 Webpack 5 專案，可以直接使用上述 Asset Modules 功能，跳過此部分。

在 Webpack 4 中，處理靜態資源通常使用 `file-loader` 和 `url-loader`。Webpack 5 提供了內置的替代方案：

| Webpack 4 Loader | Webpack 5 Asset Module |
| ---------------- | ---------------------- |
| file-loader      | asset/resource         |
| url-loader       | asset 或 asset/inline  |
| raw-loader       | asset/source           |

如果你需要從 Webpack 4 項目遷移，可以參考以下對應關係：

```javascript
// Webpack 4
{
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'images/[name].[hash:7].[ext]'
      }
    }
  ]
}

// Webpack 5 等效配置
{
  test: /\.(png|jpg|gif)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8192
    }
  },
  generator: {
    filename: 'images/[name].[hash:7][ext]'
  }
}
```

## 完整的 Webpack 5 配置示例

以下是一個包含常見資源處理的完整 Webpack 5 配置示例：

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 判斷是否為生產環境
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  // 入口
  entry: "./src/index.js",

  // 輸出
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name].[hash:8][ext][query]",
    clean: true, // 每次構建前清理dist文件夾
  },

  // 模式
  mode: isProduction ? "production" : "development",

  // 開發工具
  devtool: isProduction ? "source-map" : "eval-source-map",

  // 開發服務器
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
  },

  // 插件
  plugins: [
    // 生成HTML
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
          }
        : false,
    }),

    // 提取CSS（僅生產環境）
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: "styles/[name].[contenthash].css",
          }),
        ]
      : []),
  ],

  // 模組處理
  module: {
    rules: [
      // JavaScript處理
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            cacheDirectory: true,
          },
        },
      },

      // CSS處理
      {
        test: /\.css$/i,
        use: [
          // 開發環境用style-loader，生產環境提取CSS
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: true, // 自動檢測CSS模塊
                localIdentName: isProduction
                  ? "[hash:base64]"
                  : "[name]__[local]--[hash:base64:5]",
              },
            },
          },
          "postcss-loader", // 自動添加前綴等
        ],
      },

      // SCSS處理
      {
        test: /\.scss$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },

      // 圖片處理
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: "images/[name].[hash:8][ext]",
        },
      },

      // 字體處理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash:8][ext]",
        },
      },
    ],
  },

  // 優化
  optimization: {
    minimizer: [
      // 在生產環境中使用CSS壓縮
      `...`,
      new CssMinimizerPlugin(),
    ],
    // 代碼分割
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },

  // 解析
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
```

此配置包含了：

1. 根據環境變量區分開發和生產模式
2. JavaScript 處理（含 React 支持）
3. CSS/SCSS 處理（含模塊化支持）
4. 靜態資源處理（使用 Asset Modules）
5. 開發服務器配置
6. 優化配置

## 總結

在本章中，我們學習了如何使用 Webpack 5 處理各種資源類型：

1. 使用 Babel 處理現代 JavaScript 代碼
2. 處理 CSS 及其預處理器（SCSS/LESS）
3. 使用 Asset Modules 處理圖片和字體等靜態資源
4. 根據開發/生產環境進行不同的優化配置

Webpack 5 的 Asset Modules 功能大大簡化了靜態資源的處理流程，不再需要配置額外的 loader，使配置更加簡潔明了。通過本章的學習，你應該能夠為各種前端專案設置合適的 Webpack 資源處理配置。

在下一章中，我們將深入探討 Webpack 的 Loader 系統，學習更多關於 Loader 的工作原理和自定義 Loader 的知識。
