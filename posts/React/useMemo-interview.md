---
title: "useMemo 深入解析：面試必備指南"
date: "2025-05-01"
excerpt: "深入探討 React useMemo 的使用場景、優化策略、原理及常見面試問題"
---

# useMemo 深入解析：面試必備指南

## 什麼是 useMemo？

`useMemo` 是 React 提供的一個 Hook，它的主要功能是在依賴項未改變的情況下，記住（memoize）計算結果，避免在每次渲染時重複執行昂貴的計算操作。

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## 核心概念

### 1. 記憶化（Memoization）原理

`useMemo` 實現了計算結果的緩存機制：

- 首次渲染時，執行計算函數並存儲結果
- 後續渲染時，只有當依賴項改變才重新計算
- 不變時直接返回上次緩存的結果

### 2. 與 useCallback 的區別

```jsx
// useMemo 記憶計算結果
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback 記憶函數本身
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- `useMemo` 緩存計算結果（任何值）
- `useCallback` 緩存函數引用
- 在實現上，`useCallback(fn, deps)` 相當於 `useMemo(() => fn, deps)`

## 高級使用場景

### 1. 避免昂貴計算

```jsx
function SearchResults({ query, data }) {
  // 只有 query 或 data 改變時，才重新過濾
  const filteredResults = useMemo(() => {
    console.log("Filtering data...");
    return data.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, data]);

  return (
    <ul>
      {filteredResults.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
```

### 2. 避免子組件不必要的重新渲染

```jsx
function ParentComponent({ value1, value2 }) {
  // 只有 value1 改變時才重新創建 complexObject
  const complexObject = useMemo(() => {
    return {
      prop1: value1,
      nested: { prop2: "some value" },
    };
  }, [value1]);

  return <ChildComponent data={complexObject} />;
}
```

### 3. 突破 Referential Equality 的限制

```jsx
function DataGrid({ data, columns }) {
  // 避免每次渲染都創建新對象
  const processedColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      width: column.width || 100,
      sortable: column.sortable !== false,
    }));
  }, [columns]);

  return <Grid data={data} columns={processedColumns} />;
}
```

## 陷阱和優化策略

### 1. 過度優化問題

```jsx
// 不需要 useMemo 的情況
const value = useMemo(() => 2 + 2, []); // 計算太簡單，useMemo 本身開銷更大

// 需要 useMemo 的情況
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

### 2. 依賴項管理

```jsx
// 錯誤：漏掉依賴項
const value = useMemo(() => a * b * c, [a, b]); // 漏掉了 c

// 正確：包含所有依賴項
const value = useMemo(() => a * b * c, [a, b, c]);
```

### 3. useMemo 不是萬能藥

```jsx
function Component() {
  // 不要過度使用：不是所有計算都需要 useMemo
  const normalValue = calculateSimpleValue(); // 簡單計算不需要 useMemo

  const expensiveValue = useMemo(() => {
    return calculateVeryExpensiveValue();
  }, [dependency]);

  // ...
}
```

## 原理剖析

### 1. Fiber 架構下的實現

React 會在 Fiber 節點上維護一個「記憶化值」列表，每個 useMemo 對應一個條目，包含：

- 上次依賴項的值
- 上次計算的結果
- 當前依賴項的值

### 2. 依賴比較機制

React 使用 `Object.is` 算法比較依賴項：

- 引用類型只比較引用地址，不比較內部屬性
- 這就是為什麼依賴對象或數組時要特別小心

## 面試常見問題與答案

### 基本問題

**Q: useMemo 的主要作用是什麼？**

A: useMemo 主要用於優化性能，通過緩存計算結果，避免在組件重新渲染時重複執行昂貴的計算操作。

**Q: useMemo 和 useCallback 的區別？**

A: useMemo 緩存計算結果（可以是任何值），而 useCallback 專門用於緩存函數引用。實際上，useCallback(fn, deps) 相當於 useMemo(() => fn, deps)。

### 進階問題

**Q: 在什麼情況下應該使用 useMemo？**

A: 應該在以下情況使用 useMemo：

1. 執行昂貴的計算（如複雜數據處理、排序、過濾大數組等）
2. 創建傳遞給子組件的複雜對象，避免不必要的重新渲染
3. 依賴項變化不頻繁的計算

**Q: useMemo 如何影響渲染性能？**

A: useMemo 通過避免重複計算和保持引用穩定性來提高性能：

- 避免在每次渲染時執行昂貴計算
- 保持對象引用穩定，減少子組件的不必要渲染
- 但 useMemo 本身也有開銷，過度使用反而可能降低性能

**Q: 如何判斷某個計算是否需要 useMemo 優化？**

A: 可以通過以下方法判斷：

1. 測量計算操作的執行時間
2. 使用 React Profiler 分析渲染性能
3. 考慮計算的複雜度和執行頻率
4. 評估組件重新渲染的頻率和計算穩定性

### 專家級問題

**Q: useMemo 有什麼限制或潛在問題？**

A: 主要限制和問題包括：

1. 不保證一定會緩存結果（React 可能出於內存考慮丟棄某些緩存）
2. 依賴項管理難度大，容易遺漏或過度包含依賴
3. 過度使用會增加代碼複雜度並可能引入新的性能問題
4. 不適合有副作用的函數（應使用 useEffect）

**Q: 解釋一下 useMemo 在 React Fiber 架構中的工作原理？**

A: 在 Fiber 架構中，useMemo 的工作原理：

1. 初次渲染時，React 執行 useMemo 的計算函數並將結果與依賴項一起存儲在 Fiber 節點
2. 更新時，React 使用 Object.is 比較新舊依賴項
3. 如果依賴項相同，復用之前的計算結果
4. 如果依賴項變化，重新執行計算函數並更新存儲的結果
5. 這個過程是 React 協調過程的一部分，發生在 render 階段

**Q: 在自定義 Hook 中如何正確使用 useMemo？**

A: 在自定義 Hook 中正確使用 useMemo 的最佳實踐：

```jsx
function useCustomData(id) {
  const data = useData(id);

  // 在自定義 Hook 內部使用 useMemo
  const processedData = useMemo(() => {
    return expensiveProcess(data);
  }, [data]);

  // 也可以將 memoization 的決定權交給使用者
  return {
    data,
    processedData,
  };
}

// 使用時
function Component({ id }) {
  const { processedData } = useCustomData(id);
  // processedData 已經被 memoize，不需要在此處再次使用 useMemo
}
```

## 實際績效測試案例

### 案例：大數據列表渲染優化

```jsx
function DataList({ items, filterText }) {
  console.time("filter");

  // 未優化版本
  // const filteredItems = items
  //   .filter(item => item.name.includes(filterText))
  //   .sort((a, b) => a.name.localeCompare(b.name));

  // 使用 useMemo 優化版本
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => item.name.includes(filterText))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, filterText]);

  console.timeEnd("filter");

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

測試結果：

- 未優化版本：每次輸入字符都需要 ~100ms 處理時間
- 使用 useMemo：僅在 items 或完整 filterText 改變時花費 ~100ms，其他時間幾乎為 0ms

## 總結

掌握 useMemo 需要理解：

1. 基本使用方法和依賴項管理
2. 合適的使用場景和優化策略
3. 底層實現原理和性能影響
4. 與其他 React 優化方法的結合使用

靈活運用 useMemo 可以顯著提升 React 應用性能，但過度優化可能適得其反。關鍵是理解何時使用、如何正確使用，以及如何評估其效果。
