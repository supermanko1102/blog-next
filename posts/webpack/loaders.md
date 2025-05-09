---
title: Webpack Loaders：處理各種資源類型
date: 2023-05-15
slug: loaders
category: webpack
---

## Loader 是什麼？

在 Webpack 中，Loader 是用來處理不同類型文件的轉換器。Webpack 本身只能理解 JavaScript 和 JSON 文件，而 Loader 讓 Webpack 能夠處理其他類型的文件，並將它們轉換為有效的模組，以便在應用程式中使用。

## 為什麼需要 Loader？

在現代前端專案中，我們不只處理 JavaScript 文件，還會處理：

- 樣式文件（CSS、SASS、LESS）
- 圖片和字體文件
- HTML 模板
- TypeScript、JSX 等需要編譯的格式

Loader 讓我們能夠將這些不同類型的文件統一在 Webpack 的生態系統中管理。

## 常用的 Loader

### 1. 樣式加載器

處理 CSS 需要兩個 loader：`style-loader` 和 `css-loader`。

```bash
npm install style-loader css-loader --save-dev
```

配置 webpack.config.js：

```javascript
module.exports = {
  // ...其他配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

這樣配置後，我們就可以在 JavaScript 文件中直接導入 CSS：

```javascript
import "./style.css";
```

### 2. 處理 SASS/LESS

對於預處理器，我們需要額外的 loader：

```bash
# 對於 SASS
npm install sass-loader sass --save-dev

# 對於 LESS
npm install less-loader less --save-dev
```

配置：

```javascript
// SASS 配置
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

// LESS 配置
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```

### 3. 圖片和文件加載器

處理圖片和其他文件：

```javascript
{
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: 'asset/resource'
}

{
  test: /\.(woff|woff2|eot|ttf|otf)$/i,
  type: 'asset/resource'
}
```

在 Webpack 5 中，我們可以使用內置的 Asset Modules 來處理這些文件，無需安裝額外的 loader。

### 4. 處理 JavaScript/TypeScript

處理現代 JavaScript 和 TypeScript 需要 babel-loader 或 ts-loader：

```bash
# 處理 JavaScript
npm install babel-loader @babel/core @babel/preset-env --save-dev

# 處理 TypeScript
npm install ts-loader typescript --save-dev
```

配置：

```javascript
// Babel 配置
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
}

// TypeScript 配置
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```

## Loader 執行順序

Loader 的執行順序是從右到左（或從下到上）的。例如在 `['style-loader', 'css-loader', 'sass-loader']` 這個配置中，執行順序是：

1. `sass-loader` 將 SASS 轉換為 CSS
2. `css-loader` 解析 CSS 中的 `@import` 和 `url()`
3. `style-loader` 將 CSS 注入到 DOM 中

## 心得總結

剛開始接觸 Webpack 的 Loader 時，我感到有些困惑，特別是對於不同 Loader 的組合和執行順序。但當我了解了每個 Loader 的職責和工作原理後，就能更加靈活地配置它們。

Loader 是 Webpack 最強大的功能之一，它讓我們能夠將不同類型的資源統一管理，實現真正的模組化開發。通過合理配置 Loader，我們可以顯著提高開發效率，並使項目結構更加清晰。

在下一篇文章中，我將介紹 Webpack 的 Plugins 系統，它能夠進一步擴展 Webpack 的功能，執行更複雜的打包任務。
