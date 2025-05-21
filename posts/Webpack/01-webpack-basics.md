---
title: Webpack資源處理
date: 2024-04-22
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

## 處理圖片和字體

Webpack 可以通過不同的方式處理圖片、字體等資源。

### 在 Webpack 4 中處理資源

在 Webpack 4 中，我們使用 `file-loader` 和 `url-loader`：

```bash
npm install --save-dev file-loader url-loader
```

更新配置：

```javascript
module.exports = {
  // ... 其他配置
  module: {
    rules: [
      // ... 其他規則
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // 小於 8kb 的圖片會被轉為 base64
              name: "images/[name].[hash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:7].[ext]",
            },
          },
        ],
      },
    ],
  },
};
```

## 使用 file-loader 和 url-loader

`file-loader` 和 `url-loader` 是 Webpack 4 中處理靜態資源的主要工具。

### file-loader

`file-loader` 將文件發送到輸出目錄，並返回（相對）URL。

**主要用途**：處理字體、PDF、視頻等需要保留為獨立文件的資源。

**配置示例**：

```javascript
{
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[contenthash].[ext]',
        outputPath: 'fonts/'
      }
    }
  ]
}
```

**重要選項**：

- `name`: 設定輸出文件的名稱模板
- `outputPath`: 設定文件輸出目錄
- `publicPath`: 覆蓋 output.publicPath

### url-loader

`url-loader` 類似於 `file-loader`，但可以將小於指定大小的文件轉換為 Data URLs。

**主要用途**：處理小圖片，轉為 base64 編碼嵌入代碼，減少 HTTP 請求。

**配置示例**：

```javascript
{
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192, // 8kb
        name: '[name].[contenthash].[ext]',
        outputPath: 'images/'
      }
    }
  ]
}
```

**重要選項**：

- `limit`: 文件大小超過限制時，將使用 `file-loader` 處理
- `fallback`: 可以指定超過限制時使用的 loader

### 使用場景選擇

- 小圖片、圖標：使用 `url-loader` 轉為 base64
- 大圖片：使用 `file-loader` 保持為獨立文件
- 字體文件：通常使用 `file-loader`

## 使用 Asset Modules（Webpack 5）

Webpack 5 引入了內置的 Asset Modules，可以替代 `file-loader`、`url-loader` 和 `raw-loader`。

### 四種資源模組類型

1. `asset/resource` - 發送一個單獨的文件並導出 URL（類似 `file-loader`）
2. `asset/inline` - 導出資源的 Data URL（類似 `url-loader`）
3. `asset/source` - 導出資源的源代碼（類似 `raw-loader`）
4. `asset` - 自動選擇，類似於 `url-loader` 的 limit 功能

### 更新 Webpack 5 配置

```javascript
module.exports = {
  // ... 其他配置
  output: {
    // ... 其他輸出配置
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  module: {
    rules: [
      // 圖片處理
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      // 字體處理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
};
```

### Asset Modules 的優勢

1. **內置支援**：不需要安裝額外的 loader
2. **配置簡化**：語法更簡潔清晰
3. **性能優化**：Webpack 5 的資源處理效率更高
4. **更好的緩存**：更精細的緩存控制

## 總結

在本章中，我們學習了如何使用 Webpack 處理各種資源類型：

1. 使用 Babel 處理現代 JavaScript 代碼
2. 處理 CSS 及其預處理器（SCSS/LESS）
3. 處理圖片和字體等靜態資源
4. 對比了 Webpack 4 的 file-loader/url-loader 和 Webpack 5 的 Asset Modules

通過合理配置這些資源處理方式，我們可以使前端開發更加高效，同時優化最終的打包結果。

在下一章中，我們將深入探討 Webpack 的 Loader 系統，學習更多關於 Loader 的工作原理和自定義 Loader 的知識。
