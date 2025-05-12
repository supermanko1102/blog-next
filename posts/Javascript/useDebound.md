---
title: 實作useDebounce
date: 2025-03-05
slug: useDebounce
category: javascript
---

# useDebounce 自定義 Hook

`useDebounce` 是一個自定義 React Hook，用於延遲執行函數或更新值，直到經過一段指定的時間後才觸發，這對於處理頻繁觸發的事件（如搜索輸入、視窗調整等）非常有用。

## 基本實現

```jsx
import { useState, useEffect } from "react";

/**
 * useDebounce 自定義 Hook
 * @param {any} value - 需要延遲更新的值
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {any} - 延遲後的值
 */
function useDebounce(value, delay) {
  // 設定內部狀態來存儲延遲後的值
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 設定一個計時器，在指定的延遲後更新值
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函數（當 value 或 delay 改變時，或組件卸載時被調用）
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // 當這些依賴項變更時，重新設定計時器

  return debouncedValue;
}

export default useDebounce;
```

## 使用示例

以下是如何在搜索輸入框中使用此 Hook 的示例：

```jsx
import React, { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

function SearchComponent() {
  // 使用者輸入的搜索詞
  const [searchTerm, setSearchTerm] = useState("");

  // 應用延遲到搜索詞，延遲 500 毫秒
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 當延遲後的搜索詞變化時執行搜索
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  // 模擬的搜索功能
  const performSearch = (term) => {
    console.log(`搜索：${term}`);
    // 在這裡進行 API 調用等操作
  };

  return (
    <div>
      <input
        type="text"
        placeholder="搜索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
```

## 進階實現：函數防抖

若需要防抖函數而非值，可以使用以下實現：

```jsx
import { useCallback, useRef } from "react";

/**
 * 函數防抖 Hook
 * @param {Function} callback - 需要防抖的回調函數
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Function} - 防抖後的函數
 */
function useDebounceFunction(callback, delay) {
  // 使用 ref 存儲計時器 ID
  const timerRef = useRef(null);

  // 使用 useCallback 以確保除非依賴項變化，否則返回相同的函數引用
  const debouncedCallback = useCallback(
    (...args) => {
      // 清除現有計時器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // 設定新計時器
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

export default useDebounceFunction;
```

## 注意事項

1. 防抖和節流不同：防抖是在一連串事件結束後才執行，而節流是在一連串事件中以固定頻率執行。
2. 延遲時間設定需要平衡用戶體驗和性能考量。
3. 對於表單提交等重要操作，確保用戶理解延遲行為。

通過使用 `useDebounce`，你可以有效地減少不必要的渲染和 API 調用，提高應用程序的性能和響應性。
