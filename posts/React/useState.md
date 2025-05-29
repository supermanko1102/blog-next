---
title: "為何useState不能在if語句中：從React源碼角度深度解析"
date: "2025-05-01"
excerpt: "深入React Fiber源碼，理解Hooks鏈結串列機制與呼叫順序一致性原理"
---

# 為何 useState 不能在 if 語句中：從 React 源碼角度深度解析

## 前言

當我們學習 React Hooks 時，總是會被告知「Hooks 不能在條件語句中使用」，但很少有資料從源碼層面解釋其根本原因。今天讓我們深入 React 源碼，理解這個限制背後的技術原理。

## React Hooks 的內部結構

### 1. Hooks 鏈結串列 (Hooks Linked List)

在 React 內部，每個函數組件的 hooks 都以**鏈結串列**的形式儲存：

```javascript
// React 源碼中的 Hook 結構
type Hook = {
  memoizedState: any, // 儲存的狀態值
  baseState: any, // 基礎狀態
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null, // 更新佇列
  next: Hook | null, // 指向下一個 hook 的指標
};
```

**關鍵理解**：每個 hook 透過 `next` 指標連接，形成一條鏈結串列。

### 2. Fiber 節點如何儲存 Hooks

```javascript
// 在 Fiber 節點中
type Fiber = {
  // ... 其他屬性
  memoizedState: Hook | null, // 指向第一個 hook 的指標
  // ... 其他屬性
};
```

## 源碼分析：Hook 的建立過程

### Mount 階段 (首次渲染)

當組件首次渲染時，React 會呼叫 `mountWorkInProgressHook()` 函數：

```javascript
// react-reconciler/src/ReactFiberHooks.js
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 這是第一個 hook，儲存在 fiber.memoizedState
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 添加到鏈結串列的末尾
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

**重點**：hooks 按照**呼叫順序**依序加入鏈結串列。

### Update 階段 (重新渲染)

重新渲染時，React 會呼叫 `updateWorkInProgressHook()`：

```javascript
function updateWorkInProgressHook(): Hook {
  // currentHook 指向當前正在處理的 hook
  let nextCurrentHook: null | Hook;
  if (currentHook === null) {
    // 從 fiber.memoizedState 開始遍歷
    const current = currentlyRenderingFiber.alternate;
    nextCurrentHook = current !== null ? current.memoizedState : null;
  } else {
    // 移動到下一個 hook
    nextCurrentHook = currentHook.next;
  }

  // 複製 hook 並移動指標
  const newHook: Hook = {
    memoizedState: nextCurrentHook.memoizedState,
    baseState: nextCurrentHook.baseState,
    baseQueue: nextCurrentHook.baseQueue,
    queue: nextCurrentHook.queue,
    next: null,
  };

  // 更新工作中的 hook 鏈結串列
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }

  currentHook = nextCurrentHook;
  return workInProgressHook;
}
```

## 問題的根源：指標不匹配

### 情境示例

```javascript
function MyComponent({ condition }) {
  const [name, setName] = useState("Alice"); // Hook #1

  if (condition) {
    const [age, setAge] = useState(25); // Hook #2 (有條件的)
  }

  const [email, setEmail] = useState(""); // Hook #3 或 #2

  return (
    <div>
      {name} - {email}
    </div>
  );
}
```

### 第一次渲染 (condition = true)

Hooks 鏈結串列：

```
fiber.memoizedState → Hook#1(name) → Hook#2(age) → Hook#3(email) → null
```

### 第二次渲染 (condition = false)

React 期望的遍歷順序：

```
遍歷指標位置:    #1        #2        #3
實際 hook 呼叫:  name      email     (缺少)
應該對應的狀態:   name      age       email
```

**結果**：`email` 狀態會錯誤地接收到 `age` 的值！

## 源碼中的錯誤處理

React 在開發模式下會檢測這種不一致性：

```javascript
// react-reconciler/src/ReactFiberHooks.js
function updateWorkInProgressHook(): Hook {
  let nextCurrentHook: null | Hook;

  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else {
    nextCurrentHook = currentHook.next;
  }

  if (nextCurrentHook === null) {
    // 🚨 這裡會拋出錯誤
    throw new Error(
      "Rendered more hooks than during the previous render. " +
        "This may be caused by an accidental early return statement."
    );
  }

  // ... 繼續處理
}
```

## 正確的處理方式

### ❌ 錯誤做法

```javascript
function MyComponent({ showAge }) {
  const [name, setName] = useState("Alice");

  if (showAge) {
    const [age, setAge] = useState(25); // ❌ 不要這樣做
  }

  const [email, setEmail] = useState("");

  return <div>...</div>;
}
```

### ✅ 正確做法

```javascript
function MyComponent({ showAge }) {
  const [name, setName] = useState("Alice");
  const [age, setAge] = useState(25); // ✅ 總是呼叫
  const [email, setEmail] = useState("");

  return (
    <div>
      {name}
      {showAge && <span> - {age}</span>} {/* 條件渲染在 JSX 中 */}- {email}
    </div>
  );
}
```

## 進階：Dispatcher 機制

React 使用 Dispatcher 模式來管理不同階段的 hook 行為：

```javascript
// react-reconciler/src/ReactFiberHooks.js
const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
  useEffect: mountEffect,
  // ... 其他 hooks
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useEffect: updateEffect,
  // ... 其他 hooks
};

// 根據組件狀態切換 dispatcher
function renderWithHooks(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: any,
  props: any
): any {
  if (current !== null && current.memoizedState !== null) {
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  }

  // 呼叫組件函數
  let children = Component(props, secondArg);

  // 清空 dispatcher
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  return children;
}
```

## 總結

**為什麼 useState 不能在 if 語句中使用？**

1. **鏈結串列結構**：React 使用鏈結串列儲存 hooks，按呼叫順序連接
2. **指標遍歷機制**：重新渲染時，React 按順序遍歷舊的 hook 鏈結串列
3. **順序不一致問題**：條件語句會改變 hook 呼叫順序，導致指標錯位
4. **狀態錯配**：錯位的指標會讓狀態值分配給錯誤的變數

**核心原則**：保持 hook 呼叫順序的一致性，讓 React 能正確追蹤每個 hook 的狀態。

## 進一步學習建議

1. **閱讀 React 源碼**：專注於 `ReactFiberHooks.js` 文件
2. **實驗與測試**：嘗試違反 hook 規則，觀察錯誤訊息
3. **ESLint 插件**：使用 `eslint-plugin-react-hooks` 自動檢查
4. **深入 Fiber 架構**：理解 React 的協調演算法

記住：**React Hooks 的魔法背後是精心設計的數據結構和演算法**！
