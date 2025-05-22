---
title: Webpack Plugin系統
date: 2025-04-26
slug: webpack-plugin-system
category: webpack
---

## Plugin 的工作原理

Webpack Plugin 系統是基於事件驅動架構的強大擴展機制。Plugin 能夠介入 Webpack 的編譯流程中的各個階段，執行特定的任務。

### 鉤子（Hooks）機制

Webpack 使用 [Tapable](https://github.com/webpack/tapable) 庫來實現鉤子系統。這個系統允許插件在構建過程的特定時刻「掛鉤」自定義功能：

- **同步鉤子（SyncHooks）**：按順序執行，上一個完成後才會執行下一個
- **異步鉤子（AsyncHooks）**：支持異步操作，如 AsyncParallelHook 和 AsyncSeriesHook
- **瀑布流鉤子（Waterfall Hooks）**：每個插件都能修改上一個插件傳遞的數據

### 事件驅動架構

Webpack 的編譯過程被劃分為多個階段，每個階段都暴露了特定的鉤子：

1. **初始化階段**：environment、afterEnvironment
2. **編譯配置階段**：entryOption、afterPlugins、afterResolvers
3. **編譯階段**：beforeRun、run、normalModuleFactory、contextModuleFactory
4. **構建模組階段**：beforeCompile、compile、thisCompilation、compilation
5. **優化階段**：optimize、afterOptimize
6. **輸出階段**：afterCompile、shouldEmit、emit、afterEmit、done

Plugin 可以訂閱這些事件，當 Webpack 運行到對應階段時，相關的插件方法將被調用。

```javascript
// 插件基本結構
class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // 在輸出資產到輸出目錄之前執行某些操作
      console.log("資源即將寫入磁盤!");
      callback();
    });
  }
}
```

## 常用 Plugin 介紹

### HtmlWebpackPlugin

這是最常用的插件之一，用於自動生成 HTML 文件並注入打包後的資源。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      chunks: ["main"],
    }),
  ],
};
```

主要功能：

- 自動創建 HTML 文件或使用模板
- 自動注入打包後的 JS、CSS 文件
- 支持多頁面應用
- 可配置壓縮選項

### CleanWebpackPlugin

用於在每次構建前清理輸出目錄。

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

### MiniCssExtractPlugin

將 CSS 提取到單獨的文件中。

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```

### CopyWebpackPlugin

用於複製靜態資源到輸出目錄。

```javascript
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "" }],
    }),
  ],
};
```

### DefinePlugin

Webpack 內置插件，用於在編譯時創建全局常量。

```javascript
const { DefinePlugin } = require("webpack");

module.exports = {
  plugins: [
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      API_URL: JSON.stringify("https://api.example.com"),
    }),
  ],
};
```

## Plugin 的配置和使用

在 Webpack 中配置和使用插件的基本步驟：

### 1. 安裝插件

```bash
npm install --save-dev html-webpack-plugin clean-webpack-plugin
```

### 2. 引入插件

在 `webpack.config.js` 文件中引入需要的插件：

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
```

### 3. 配置插件

在 Webpack 配置的 `plugins` 屬性中實例化並配置插件：

```javascript
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "我的應用",
      template: "./src/index.html",
    }),
    // 更多插件...
  ],
};
```

### 4. 插件執行順序

插件在 `plugins` 數組中的順序決定了它們的執行順序，有些插件可能依賴於其他插件的輸出，所以順序很重要。

### 5. 環境特定的插件配置

可以根據不同的環境配置不同的插件：

```javascript
const commonPlugins = [new HtmlWebpackPlugin({ template: "./src/index.html" })];

const developmentPlugins = [new webpack.HotModuleReplacementPlugin()];

const productionPlugins = [
  new MiniCssExtractPlugin(),
  new CssMinimizerPlugin(),
];

module.exports = (env) => {
  return {
    mode: env.production ? "production" : "development",
    plugins: [
      ...commonPlugins,
      ...(env.production ? productionPlugins : developmentPlugins),
    ],
  };
};
```

## 編寫自定義 Plugin

創建自定義 Plugin 可以擴展 Webpack 以滿足專案特定需求。插件基本上是一個帶有 `apply` 方法的 JavaScript 類。

### 基本結構

```javascript
class MyCustomPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    // 訪問 compiler 鉤子並使用 tap、tapAsync 或 tapPromise 方法註冊回調
    compiler.hooks.done.tap("MyCustomPlugin", (stats) => {
      console.log("構建完成!");
      console.log("使用的選項:", this.options);
    });
  }
}

module.exports = MyCustomPlugin;
```

### 實際案例：生成構建報告插件

下面是一個更實用的例子，創建一個插件來生成構建資產的報告：

```javascript
class BuildReportPlugin {
  constructor(options = {}) {
    this.filename = options.filename || "build-report.json";
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "BuildReportPlugin",
      (compilation, callback) => {
        // 創建資產報告
        const report = {
          buildTime: new Date().toISOString(),
          assets: Object.keys(compilation.assets).map((filename) => ({
            name: filename,
            size: compilation.assets[filename].size(),
            chunks: [],
          })),
        };

        // 為每個資產收集 chunk 信息
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            const asset = report.assets.find((a) => a.name === filename);
            if (asset) {
              asset.chunks.push(chunk.id);
            }
          });
        });

        // 將報告加入到編譯資產中
        compilation.assets[this.filename] = {
          source: () => JSON.stringify(report, null, 2),
          size: () => JSON.stringify(report, null, 2).length,
        };

        callback();
      }
    );
  }
}

module.exports = BuildReportPlugin;
```

使用：

```javascript
const BuildReportPlugin = require("./plugins/BuildReportPlugin");

module.exports = {
  // ... 其他配置
  plugins: [new BuildReportPlugin({ filename: "report.json" })],
};
```

### 調試自定義插件

開發自定義插件時，可以使用以下方法調試：

1. 使用 `console.log` 輸出調試信息
2. 在 Node.js 啟動時加入 `--inspect` 標誌以啟用調試器
3. 使用 VS Code 的調試功能設置斷點

## Plugin 配置技巧與優化

### 1. 優化打包速度

使用 DLL 插件預先打包不常變更的依賴：

```javascript
const webpack = require("webpack");
const path = require("path");

// DLL 配置文件 webpack.dll.config.js
module.exports = {
  mode: "production",
  entry: {
    vendors: ["react", "react-dom", "redux", "react-redux"],
  },
  output: {
    path: path.join(__dirname, "dist/dll"),
    filename: "[name].dll.js",
    library: "[name]_dll",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_dll",
      path: path.join(__dirname, "dist/dll", "[name].manifest.json"),
    }),
  ],
};

// 主 webpack 配置
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require("./dist/dll/vendors.manifest.json"),
    }),
  ],
};
```

### 2. 分析打包結果

使用 `webpack-bundle-analyzer` 來視覺化打包結果：

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
    }),
  ],
};
```

### 3. 條件性使用插件

根據環境變量或命令行參數有條件地使用插件：

```javascript
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  const plugins = [new HtmlWebpackPlugin(), new CleanWebpackPlugin()];

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin());
    plugins.push(new CompressionPlugin());
  } else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    // ... 其他配置
    plugins,
  };
};
```

### 4. 共享公共配置

使用 `webpack-merge` 來組織和共享不同環境的配置：

```javascript
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

// 開發配置
const devConfig = {
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

// 生產配置
const prodConfig = {
  plugins: [new MiniCssExtractPlugin(), new CompressionPlugin()],
};

module.exports = (env) => {
  if (env.production) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
};
```

### 5. 優化插件執行順序

某些插件需要特定的執行順序才能正常工作，例如 `MiniCssExtractPlugin` 應該在 CSS 處理相關的插件之前配置：

```javascript
module.exports = {
  plugins: [
    new MiniCssExtractPlugin(), // 先提取 CSS
    new OptimizeCSSAssetsPlugin(), // 然後壓縮 CSS
    new HtmlWebpackPlugin(), // 最後生成 HTML 並注入資源
  ],
};
```

通過合理配置和使用插件，可以顯著提升 Webpack 的構建效率和輸出質量，使開發流程更加順暢。
