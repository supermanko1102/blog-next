---
title: Webpack與前端框架整合
date: 2025-04-30
slug: webpack-framework-integration
category: webpack
---

## 與 React 整合

React 是目前最流行的前端框架之一，Webpack 可以幫助我們設置高效的 React 開發環境。

### 基本設置

首先，安裝 React 相關依賴：

```bash
npm install react react-dom
npm install --save-dev @babel/preset-react
```

配置 Babel 以支援 JSX 語法：

```javascript
// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
```

更新 Webpack 配置：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
```

### 配置 React 熱模塊替換（HMR）

React 熱模塊替換允許在不刷新整個頁面的情況下更新 React 組件：

```bash
npm install --save-dev react-refresh @pmmmwh/react-refresh-webpack-plugin
```

更新 Webpack 配置：

```javascript
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["react-refresh/babel"],
          },
        },
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    hot: true,
  },
};
```

### 配置 React 路由

使用 React Router 進行前端路由管理時，需要配置 Webpack 開發服務器以正確處理客戶端路由：

```javascript
module.exports = {
  // 其他配置...
  devServer: {
    historyApiFallback: true, // 所有 404 響應都會被重定向到 index.html
    hot: true,
  },
};
```

### 設置 CSS 模塊（CSS Modules）

React 項目中通常使用 CSS 模塊來避免樣式衝突：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
    ],
  },
};
```

在 React 組件中使用：

```javascript
import React from "react";
import styles from "./Button.module.css";

function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}

export default Button;
```

## 與 Vue 整合

Vue 是另一個流行的前端框架，Webpack 也可以輕鬆與其整合。

### 基本設置

首先，安裝 Vue 相關依賴：

```bash
npm install vue
npm install --save-dev vue-loader vue-template-compiler
```

配置 Webpack：

```javascript
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: [".js", ".vue"],
  },
};
```

### 配置 Vue 路由

使用 Vue Router 時，需要進行類似於 React Router 的配置：

```javascript
module.exports = {
  // 其他配置...
  devServer: {
    historyApiFallback: true,
  },
};
```

### 使用 Vue 單文件組件（SFC）

Vue 的一大特色是單文件組件，可在同一個文件中包含模板、腳本和樣式：

```vue
<!-- Button.vue -->
<template>
  <button class="button" @click="handleClick">
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Click me",
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

## 與 Angular 整合

Angular 是 Google 開發的前端框架，與 Webpack 整合需要特定的配置。

### 基本設置

通常 Angular 使用自己的 CLI 工具，但也可以手動配置 Webpack：

```bash
npm install @angular/core @angular/common @angular/compiler @angular/platform-browser @angular/platform-browser-dynamic rxjs zone.js
npm install --save-dev @ngtools/webpack typescript
```

配置 Webpack：

```javascript
const { AngularWebpackPlugin } = require("@ngtools/webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "@ngtools/webpack",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new AngularWebpackPlugin({
      tsconfig: "tsconfig.json",
      entryModule: "src/app/app.module#AppModule",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};
```

## 與 TypeScript 整合

TypeScript 是 JavaScript 的超集，為程式碼添加了類型系統，可以與任何前端框架結合使用。

### 基本設置

安裝 TypeScript 和相關依賴：

```bash
npm install --save-dev typescript ts-loader
```

創建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "outDir": "./dist",
    "jsx": "react"
  },
  "include": ["src"]
}
```

配置 Webpack：

```javascript
module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
```

### 與 React 和 TypeScript 整合

React 和 TypeScript 的組合非常流行：

```bash
npm install --save-dev @types/react @types/react-dom
```

示例 React + TypeScript 組件：

```tsx
import React, { useState } from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      style={{ fontWeight: clicked ? "bold" : "normal" }}
    >
      {text}
    </button>
  );
};

export default Button;
```

### 與 Vue 和 TypeScript 整合

Vue 3 對 TypeScript 的支持有了很大改進：

```bash
npm install --save-dev @vue/compiler-sfc
```

示例 Vue + TypeScript 組件：

```vue
<template>
  <button @click="handleClick" :class="{ clicked }">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const clicked = ref(false);

    const handleClick = () => {
      clicked.value = true;
      emit("click");
    };

    return {
      clicked,
      handleClick,
    };
  },
});
</script>
```

## 整合 CSS 框架與預處理器

在前端開發中，CSS 框架和預處理器的使用非常普遍，Webpack 提供了良好的支持。

### 使用 Sass/SCSS

```bash
npm install --save-dev sass sass-loader
```

配置 Webpack：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

### 使用 Less

```bash
npm install --save-dev less less-loader
```

配置 Webpack：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
```

### 使用 PostCSS

PostCSS 是一個強大的 CSS 處理工具，可以通過插件系統實現各種功能：

```bash
npm install --save-dev postcss postcss-loader postcss-preset-env
```

配置 Webpack：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
        ],
      },
    ],
  },
};
```

### 整合 Bootstrap

Bootstrap 是最流行的 CSS 框架之一：

```bash
npm install bootstrap
npm install --save-dev sass sass-loader
```

在 SCSS 文件中自定義 Bootstrap：

```scss
// 自定義變量
$primary: #0074d9;
$danger: #ff4136;

// 導入 Bootstrap
@import "~bootstrap/scss/bootstrap";
```

配置 Webpack：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

### 整合 Tailwind CSS

Tailwind CSS 是一個功能類優先的 CSS 框架：

```bash
npm install tailwindcss
npm install --save-dev postcss postcss-loader
```

創建 `tailwind.config.js`：

```javascript
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

配置 PostCSS（`postcss.config.js`）：

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

在 CSS 文件中導入 Tailwind：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 總結

Webpack 的靈活性使其能夠與各種前端框架和工具無縫整合。無論你選擇 React、Vue、Angular 還是其他框架，Webpack 都能提供一致的模塊打包和資源處理能力。通過整合 TypeScript、CSS 預處理器和各種 CSS 框架，可以構建出功能豐富、開發體驗良好的現代前端應用。

在選擇和配置這些整合時，應當考慮團隊的技術栈、項目需求和維護成本。通常，使用官方推薦的工具鏈（如 Create React App、Vue CLI）可以避免許多配置上的麻煩，但了解底層的 Webpack 配置仍然重要，這有助於解決特殊需求和優化構建過程。
