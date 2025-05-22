---
title: Webpack開發環境配置
date: 2025-04-27
slug: webpack-development-environment
category: webpack
---

## 使用 webpack-dev-server

Webpack-dev-server 是一個基於 Express.js 的開發伺服器，它提供了快速的開發環境，具有即時重新載入（live reloading）功能，大大提升了開發效率。

### 安裝

首先需要安裝 webpack-dev-server：

```bash
npm install --save-dev webpack-dev-server
```

### 基本配置

在 `webpack.config.js` 中添加 devServer 配置：

```javascript
const path = require("path");

module.exports = {
  // ... 其他配置
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true, // 啟用 gzip 壓縮
    port: 3000, // 開發伺服器端口
    open: true, // 自動打開瀏覽器
    hot: true, // 啟用熱模組替換
    historyApiFallback: true, // 支持 HTML5 History API
  },
};
```

### 添加 NPM 腳本

在 `package.json` 中添加啟動腳本：

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

### 常用配置選項

#### static

設置提供靜態文件的目錄：

```javascript
static: {
  directory: path.join(__dirname, "public"),
  publicPath: "/assets",
  watch: true,
}
```

#### devMiddleware

控制 webpack-dev-middleware 的行為：

```javascript
devMiddleware: {
  publicPath: "/assets/",
  writeToDisk: true, // 將文件寫入磁盤
}
```

#### headers

向所有響應添加自定義標頭：

```javascript
headers: {
  "X-Custom-Header": "yes",
  "Access-Control-Allow-Origin": "*",
}
```

#### https

啟用 HTTPS：

```javascript
https: true,
// 或
https: {
  key: fs.readFileSync("path/to/server.key"),
  cert: fs.readFileSync("path/to/server.crt"),
  ca: fs.readFileSync("path/to/ca.pem"),
}
```

## 熱模組替換（HMR）

熱模組替換（Hot Module Replacement，HMR）是 webpack-dev-server 的一個強大功能，它允許在應用運行時替換、添加或刪除模組，無需完全重新載入頁面。

### HMR 的工作原理

1. **應用運行時**：webpack-dev-server 創建一個 WebSocket 連接，監聽文件變更
2. **文件變更時**：只重新編譯變更的模組
3. **傳輸更新**：通過 WebSocket 將更新信息發送到瀏覽器
4. **應用更新**：HMR runtime 用新模組替換舊模組，而不刷新整個頁面

### 配置 HMR

在 webpack 配置中啟用 HMR：

```javascript
const webpack = require("webpack");

module.exports = {
  // ... 其他配置
  devServer: {
    hot: true, // 啟用 HMR
  },
  plugins: [
    // ... 其他插件
    new webpack.HotModuleReplacementPlugin(), // 在 webpack 5 中，使用 devServer.hot: true 時可省略此插件
  ],
};
```

### 在代碼中處理模組熱替換

#### React 應用中使用 HMR

搭配 `react-refresh-webpack-plugin` 使用：

```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  // ... 其他配置
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
              plugins: ["react-refresh/babel"].filter(Boolean),
            },
          },
        ],
      },
    ],
  },
};
```

#### Vue 應用中使用 HMR

Vue Loader 已經內置了 HMR 支持：

```javascript
// webpack.config.js
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // ... 其他配置
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

#### 普通 JavaScript 模組中使用 HMR

```javascript
// index.js
import { createApp } from "./app";

let app = createApp();
document.body.appendChild(app);

if (module.hot) {
  module.hot.accept("./app", () => {
    // 當 ./app 模組更新時執行
    const { createApp } = require("./app");
    const newApp = createApp();
    document.body.replaceChild(newApp, app);
    app = newApp;
  });
}
```

### HMR 的限制和最佳實踐

- 並非所有類型的更新都可以熱替換（例如全局變量的更改）
- 對於 CSS 和圖片等靜態資源，HMR 通常可以直接工作
- 對於 React、Vue 等框架，使用專門的 HMR 工具
- 複雜的更新邏輯可能需要手動實現 `module.hot.accept`
- 應該只在開發環境中啟用 HMR

## Source Maps 配置

Source Maps 是一種映射編譯、壓縮或混淆後的代碼到原始源代碼的技術，可以幫助開發者在瀏覽器中直接調試原始代碼。

### 在 Webpack 中啟用 Source Maps

通過 `devtool` 選項設置 Source Maps 類型：

```javascript
module.exports = {
  // ... 其他配置
  devtool: "source-map", // 產生完整的 source map
};
```

### 常用 Source Maps 類型

Webpack 提供多種 Source Maps 類型，根據需求平衡構建速度和調試體驗：

```javascript

| 類型                           | 描述                                                   | 構建速度 | 重構建速度 | 品質 | 生產環境適用 |
| ------------------------------ | ------------------------------------------------------ | -------- | ---------- | ---- | ------------ |
| `eval`                         | 每個模組使用 eval() 執行，通過 //# sourceURL 添加引用  | +++      | +++        | +    | ❌           |
| `eval-source-map`              | 每個模組使用 eval() 執行，並生成 Source Maps          | --       | +          | ++   | ❌           |
| `cheap-eval-source-map`        | 類似 eval-source-map，不包含列映射，只映射到轉譯後代碼   | +        | ++         | +    | ❌           |
| `cheap-module-eval-source-map` | 類似 cheap-eval-source-map，但映射到原始代碼          | -        | +          | ++   | ❌           |
| `source-map`                   | 生成完整的 Source Maps 文件                         | --       | --         | +++  | ✓            |
| `hidden-source-map`            | 與 source-map 相同，但不在 bundle 中添加引用          | --       | --         | +++  | ✓            |
| `nosources-source-map`         | 沒有源代碼內容的 Source Map，但保留行號映射            | --       | --         | ++   | ✓            |
```

### 常見的環境配置建議

**開發環境推薦**：

- `eval-source-map`：提供好的調試體驗和合理的構建速度
- `cheap-module-eval-source-map`：在大型項目中可提高性能

```javascript
// 開發環境
module.exports = {
  devtool: "eval-source-map",
};
```

**生產環境推薦**：

- `source-map`：完整的映射，但會生成單獨的映射文件
- `hidden-source-map`：只生成 Source Map，不引用它（可用於錯誤報告工具）
- `nosources-source-map`：保護源代碼，但仍提供堆疊追蹤

```javascript
// 生產環境
module.exports = {
  devtool: process.env.GENERATE_SOURCEMAP === "true" ? "source-map" : false,
};
```

### 針對特定 Loader 的 Source Maps 配置

有些 loader 需要特定配置來生成正確的 Source Maps：

```javascript
module.exports = {
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            // 啟用 Babel Source Maps
            sourceMaps: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true, // 啟用 CSS Source Maps
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // 啟用 SASS Source Maps
            },
          },
        ],
      },
    ],
  },
};
```

## 代理 API 請求

在開發過程中，前端項目通常需要與後端 API 進行通信。由於瀏覽器的同源策略限制，開發環境的前端應用無法直接訪問不同源的 API。Webpack Dev Server 提供了強大的代理功能來解決這個問題。

### 基本代理配置

在 `webpack.config.js` 中配置代理：

```javascript
module.exports = {
  // ... 其他配置
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 目標 API 伺服器
        pathRewrite: { "^/api": "" }, // 路徑重寫
        changeOrigin: true, // 修改請求頭中的 host 和 origin
        secure: false, // 允許無效或自簽名證書（https）
      },
    },
  },
};
```

這個配置會將 `/api/users` 這樣的請求代理到 `http://localhost:8080/users`。

### 多個代理目標

可以配置多個不同路徑的代理：

```javascript
devServer: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      pathRewrite: { "^/api": "" },
    },
    "/auth": {
      target: "http://localhost:8081",
      pathRewrite: { "^/auth": "/authentication" },
    },
  },
}
```

### 使用函數過濾請求

用函數決定哪些請求需要代理：

```javascript
devServer: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      bypass: function(req, res, proxyOptions) {
        // 不代理靜態文件請求
        if (req.url.includes(".html") || req.url.includes(".css")) {
          return req.url;
        }
        // 不代理 /api/mock 路徑的請求
        if (req.url.startsWith("/api/mock")) {
          return false;
        }
      },
    },
  },
}
```

### 代理 WebSocket

配置 WebSocket 代理：

```javascript
devServer: {
  proxy: {
    "/socket": {
      target: "ws://localhost:8080",
      ws: true, // 啟用 WebSocket 代理
    },
  },
}
```

### 使用中間件自定義代理行為

使用第三方中間件，如 http-proxy-middleware：

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");

devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // 使用自定義中間件
    middlewares.unshift(
      createProxyMiddleware("/api-special", {
        target: "http://localhost:8000",
        pathRewrite: { "^/api-special": "/special" },
        onProxyRes: function(proxyRes, req, res) {
          // 修改響應頭
          proxyRes.headers["x-added"] = "yes";
        },
      })
    );
    return middlewares;
  },
}
```

### 模擬請求響應

結合 `setupMiddlewares` 功能來模擬 API 響應：

```javascript
devServer: {
  setupMiddlewares: (middlewares, devServer) => {
    // 添加模擬 API
    middlewares.unshift((req, res, next) => {
      if (req.url === "/api/mock/users") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ users: [{ id: 1, name: "Test User" }] }));
        return;
      }
      next();
    });
    return middlewares;
  },
}
```

### 代理錯誤處理

處理代理過程中可能出現的錯誤：

```javascript
devServer: {
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      onError: (err, req, res) => {
        console.error("代理錯誤:", err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("代理請求失敗，後端可能未啟動");
      },
    },
  },
}
```

## 環境變量設置

在 Webpack 項目中，環境變量可用於控制構建過程、切換配置、條件性包含功能等，是開發環境管理的重要工具。

### 使用 Webpack 內置的 DefinePlugin

Webpack 的 DefinePlugin 允許創建可在編譯時替換的全局常量：

```javascript
const webpack = require("webpack");

module.exports = {
  // ... 其他配置
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.API_URL": JSON.stringify(
        process.env.API_URL || "http://localhost:8080"
      ),
      PRODUCTION: process.env.NODE_ENV === "production",
      VERSION: JSON.stringify("1.0.0"),
    }),
  ],
};
```

> **重要**：DefinePlugin 進行的是直接文本替換，所以字符串值需要使用 `JSON.stringify()`。

### 使用 .env 文件管理環境變量

使用 dotenv 庫可以從 .env 文件中載入環境變量：

```bash
npm install --save-dev dotenv
```

創建不同的環境文件：

```
# .env.development
API_URL=http://localhost:8080
FEATURE_FLAG_NEW_UI=true

# .env.production
API_URL=https://api.example.com
FEATURE_FLAG_NEW_UI=false
```

在 webpack 配置中使用：

```javascript
const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");

module.exports = (env) => {
  // 載入對應環境的 .env 文件
  const envPath = `.env.${env.NODE_ENV || "development"}`;
  const fileEnv =
    dotenv.config({ path: path.resolve(process.cwd(), envPath) }).parsed || {};

  // 合併所有環境變量
  const envVars = Object.keys(fileEnv).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(fileEnv[key]);
    return prev;
  }, {});

  return {
    // ... 其他配置
    plugins: [new webpack.DefinePlugin(envVars)],
  };
};
```

### 使用 dotenv-webpack 插件

dotenv-webpack 插件簡化了 .env 文件的使用：

```bash
npm install --save-dev dotenv-webpack
```

```javascript
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {
  return {
    // ... 其他配置
    plugins: [
      new Dotenv({
        path: `./.env.${env.NODE_ENV || "development"}`, // 載入哪個 .env 文件
        safe: true, // 載入 .env.example 並驗證變量存在
        systemvars: true, // 載入所有系統變量
        defaults: false, // 不添加默認值
      }),
    ],
  };
};
```

### 使用 cross-env 跨平台設置環境變量

cross-env 解決了跨平台設置環境變量的問題：

```bash
npm install --save-dev cross-env
```

在 package.json 中配置腳本：

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack",
    "build:staging": "cross-env NODE_ENV=staging API_URL=https://staging-api.example.com webpack"
  }
}
```

### 在代碼中使用環境變量

定義好的環境變量可以在代碼中直接使用：

```javascript
// 在 React 組件中
function App() {
  console.log("當前環境:", process.env.NODE_ENV);
  console.log("API URL:", process.env.API_URL);

  // 條件性渲染特性
  if (process.env.FEATURE_FLAG_NEW_UI === "true") {
    return <NewUI />;
  }
  return <OldUI />;
}
```

### 環境變量和模式（mode）

Webpack 的 mode 選項會自動設置 `process.env.NODE_ENV`：

```javascript
module.exports = {
  mode: "development", // 自動設置 process.env.NODE_ENV = "development"
  // ... 其他配置
};
```

也可以通過命令行設置：

```bash
webpack --mode=production
```

### 最佳實踐

1. **敏感資訊安全**：

   - 不要將敏感資訊（如 API 密鑰）存儲在代碼庫中
   - 使用 .env.local（加入 .gitignore）存儲本地開發敏感資訊
   - 生產環境使用 CI/CD 系統的環境變量機制

2. **環境變量命名**：

   - 使用統一的前綴區分不同服務或功能
   - 遵循全大寫加下劃線的命名慣例（如 `API_URL`、`REACT_APP_FEATURE_X`）

3. **類型安全**：
   - 使用 TypeScript 時，定義環境變量的類型聲明文件：

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    API_URL: string;
    FEATURE_FLAG_NEW_UI: string;
  }
}
```

通過合理配置環境變量，可以實現同一套代碼在不同環境中的靈活部署和功能控制。
