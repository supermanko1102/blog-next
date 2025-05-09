---
title: "JavaScript 入門指南"
date: "2024-03-20"
---

# JavaScript 入門指南

JavaScript 是一種輕量級的解釋型程式語言，主要用於網頁開發。本文將帶您了解 JavaScript 的基礎知識。

## 變數宣告

在 JavaScript 中，我們可以使用 `let`、`const` 和 `var` 來宣告變數：

```javascript
let name = "John";
const age = 25;
var oldWay = "不建議使用";
```

## 資料型別

JavaScript 有以下幾種基本資料型別：

- String（字串）
- Number（數字）
- Boolean（布林值）
- Null（空值）
- Undefined（未定義）
- Object（物件）
- Symbol（符號）

## 函數

函數是 JavaScript 中的一等公民，可以這樣定義：

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

// 箭頭函數
const greetArrow = (name) => `Hello, ${name}!`;
```

## 物件

物件是 JavaScript 中最常用的資料結構之一：

```javascript
const person = {
  name: "John",
  age: 25,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
};
```

## 陣列

陣列用於儲存多個值：

```javascript
const fruits = ["apple", "banana", "orange"];

// 陣列方法
fruits.push("grape");
fruits.map((fruit) => fruit.toUpperCase());
```

## 結語

這只是 JavaScript 的基礎知識，還有更多進階主題等待探索。希望這篇文章能幫助您開始 JavaScript 的學習之旅！
