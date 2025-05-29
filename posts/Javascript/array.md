---
title: JavaScript 陣列方法完全指南
date: 2025-05-29
slug: javascript-array-methods
category: Javascript
---

# JavaScript 陣列方法完全指南

JavaScript 的陣列方法是現代前端開發中最重要的工具之一。掌握這些方法不僅能讓你的程式碼更簡潔優雅，還能大幅提升開發效率。本文將深入介紹最常用的陣列方法，並提供豐富的實際應用範例。

## 為什麼要學習陣列方法？

### 傳統迴圈 vs 陣列方法

**傳統的 for 迴圈寫法：**

```javascript
// 找出所有成年人
const people = [
  { name: "小明", age: 25 },
  { name: "小華", age: 17 },
  { name: "小美", age: 30 },
  { name: "小強", age: 16 },
];

// 傳統寫法
const adults = [];
for (let i = 0; i < people.length; i++) {
  if (people[i].age >= 18) {
    adults.push(people[i]);
  }
}
console.log(adults);
```

**使用陣列方法的現代寫法：**

```javascript
// 現代寫法 - 更簡潔、更易讀
const adults = people.filter((person) => person.age >= 18);
console.log(adults);
```

### 陣列方法的優勢

1. **程式碼更簡潔**：減少樣板程式碼
2. **更易讀懂**：語意化的方法名稱
3. **函數式程式設計**：避免副作用
4. **鏈式呼叫**：可以組合多個操作
5. **不變性**：原陣列不會被修改

## 核心陣列方法詳解

### 1. filter() - 過濾陣列

`filter()` 方法會建立一個新陣列，包含所有通過測試函數的元素。

**基本語法：**

```javascript
const newArray = array.filter(callback(element, index, array));
```

**實際範例：**

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 過濾出偶數
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// 過濾出大於 5 的數字
const bigNumbers = numbers.filter((num) => num > 5);
console.log(bigNumbers); // [6, 7, 8, 9, 10]

// 複雜物件的過濾
const products = [
  { name: "iPhone", price: 30000, category: "手機" },
  { name: "MacBook", price: 50000, category: "筆電" },
  { name: "iPad", price: 20000, category: "平板" },
  { name: "Samsung", price: 25000, category: "手機" },
];

// 過濾出手機類別的產品
const phones = products.filter((product) => product.category === "手機");
console.log(phones);

// 過濾出價格低於 30000 的產品
const affordableProducts = products.filter((product) => product.price < 30000);
console.log(affordableProducts);
```

### 2. map() - 轉換陣列

`map()` 方法會建立一個新陣列，其結果是該陣列中的每個元素都呼叫一個提供的函數後的回傳值。

**基本語法：**

```javascript
const newArray = array.map(callback(element, index, array));
```

**實際範例：**

```javascript
const numbers = [1, 2, 3, 4, 5];

// 每個數字乘以 2
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// 轉換為字串
const strings = numbers.map((num) => `數字: ${num}`);
console.log(strings); // ["數字: 1", "數字: 2", "數字: 3", "數字: 4", "數字: 5"]

// 物件轉換
const users = [
  { firstName: "張", lastName: "小明" },
  { firstName: "李", lastName: "小華" },
  { firstName: "王", lastName: "小美" },
];

// 建立全名
const fullNames = users.map((user) => ({
  ...user,
  fullName: user.firstName + user.lastName,
}));
console.log(fullNames);

// 提取特定屬性
const names = users.map((user) => user.firstName + user.lastName);
console.log(names); // ["張小明", "李小華", "王小美"]
```

### 3. reduce() - 累積運算

`reduce()` 方法對陣列中的每個元素執行一個 reducer 函數，將其結果累積為單一回傳值。

**基本語法：**

```javascript
const result = array.reduce(
  callback(accumulator, currentValue, index, array),
  initialValue
);
```

**實際範例：**

```javascript
const numbers = [1, 2, 3, 4, 5];

// 計算總和
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// 計算乘積
const product = numbers.reduce((acc, num) => acc * num, 1);
console.log(product); // 120

// 找出最大值
const max = numbers.reduce((acc, num) => Math.max(acc, num), -Infinity);
console.log(max); // 5

// 複雜的物件操作
const orders = [
  { id: 1, amount: 100 },
  { id: 2, amount: 200 },
  { id: 3, amount: 150 },
];

// 計算總金額
const totalAmount = orders.reduce((total, order) => total + order.amount, 0);
console.log(totalAmount); // 450

// 建立物件映射
const orderMap = orders.reduce((map, order) => {
  map[order.id] = order;
  return map;
}, {});
console.log(orderMap);
// { 1: { id: 1, amount: 100 }, 2: { id: 2, amount: 200 }, 3: { id: 3, amount: 150 } }

// 計算每個類別的數量
const fruits = ["蘋果", "香蕉", "蘋果", "橘子", "香蕉", "蘋果"];
const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1;
  return count;
}, {});
console.log(fruitCount); // { 蘋果: 3, 香蕉: 2, 橘子: 1 }
```

### 4. forEach() - 遍歷陣列

`forEach()` 方法會對陣列的每個元素執行一次給定的函數。

**基本語法：**

```javascript
array.forEach(callback(element, index, array));
```

**實際範例：**

```javascript
const fruits = ["蘋果", "香蕉", "橘子"];

// 基本遍歷
fruits.forEach((fruit) => {
  console.log(`我喜歡吃${fruit}`);
});

// 使用索引
fruits.forEach((fruit, index) => {
  console.log(`${index + 1}. ${fruit}`);
});

// 修改 DOM 元素
const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log("按鈕被點擊了！");
  });
});

// 注意：forEach 不會回傳新陣列
const numbers = [1, 2, 3];
const result = numbers.forEach((num) => num * 2); // undefined
console.log(result); // undefined
```

### 5. find() - 尋找元素

`find()` 方法會回傳第一個滿足測試函數的元素值，如果沒有找到則回傳 `undefined`。

**實際範例：**

```javascript
const users = [
  { id: 1, name: "小明", email: "ming@example.com" },
  { id: 2, name: "小華", email: "hua@example.com" },
  { id: 3, name: "小美", email: "mei@example.com" },
];

// 根據 ID 尋找使用者
const user = users.find((user) => user.id === 2);
console.log(user); // { id: 2, name: "小華", email: "hua@example.com" }

// 根據名稱尋找
const userByName = users.find((user) => user.name === "小美");
console.log(userByName);

// 找不到時回傳 undefined
const notFound = users.find((user) => user.id === 999);
console.log(notFound); // undefined
```

### 6. findIndex() - 尋找索引

`findIndex()` 方法會回傳第一個滿足測試函數的元素索引，如果沒有找到則回傳 -1。

**實際範例：**

```javascript
const numbers = [10, 20, 30, 40, 50];

// 找出第一個大於 25 的數字的索引
const index = numbers.findIndex((num) => num > 25);
console.log(index); // 2

// 在物件陣列中尋找索引
const products = [
  { name: "iPhone", price: 30000 },
  { name: "Samsung", price: 25000 },
  { name: "Pixel", price: 20000 },
];

const expensiveIndex = products.findIndex((product) => product.price > 28000);
console.log(expensiveIndex); // 0
```

### 7. some() - 檢查是否有元素符合條件

`some()` 方法會測試陣列中是否至少有一個元素通過測試函數，回傳布林值。

**實際範例：**

```javascript
const numbers = [1, 2, 3, 4, 5];

// 檢查是否有偶數
const hasEven = numbers.some((num) => num % 2 === 0);
console.log(hasEven); // true

// 檢查是否有大於 10 的數字
const hasBig = numbers.some((num) => num > 10);
console.log(hasBig); // false

// 在物件陣列中使用
const users = [
  { name: "小明", age: 17 },
  { name: "小華", age: 25 },
  { name: "小美", age: 16 },
];

const hasAdult = users.some((user) => user.age >= 18);
console.log(hasAdult); // true
```

### 8. every() - 檢查是否所有元素都符合條件

`every()` 方法會測試陣列中的所有元素是否都通過測試函數，回傳布林值。

**實際範例：**

```javascript
const numbers = [2, 4, 6, 8, 10];

// 檢查是否都是偶數
const allEven = numbers.every((num) => num % 2 === 0);
console.log(allEven); // true

// 檢查是否都大於 0
const allPositive = numbers.every((num) => num > 0);
console.log(allPositive); // true

// 檢查是否都大於 5
const allBig = numbers.every((num) => num > 5);
console.log(allBig); // false

// 表單驗證範例
const formFields = [
  { name: "email", value: "test@example.com", valid: true },
  { name: "password", value: "123456", valid: true },
  { name: "confirmPassword", value: "123456", valid: true },
];

const isFormValid = formFields.every((field) => field.valid);
console.log(isFormValid); // true
```

## 方法鏈式呼叫

陣列方法的強大之處在於可以鏈式呼叫，組合多個操作：

```javascript
const students = [
  { name: "小明", age: 20, grade: 85, subject: "數學" },
  { name: "小華", age: 19, grade: 92, subject: "英文" },
  { name: "小美", age: 21, grade: 78, subject: "數學" },
  { name: "小強", age: 20, grade: 88, subject: "英文" },
  { name: "小麗", age: 19, grade: 95, subject: "數學" },
];

// 鏈式呼叫：找出數學科成績 80 分以上的學生姓名
const mathTopStudents = students
  .filter((student) => student.subject === "數學") // 過濾數學科
  .filter((student) => student.grade >= 80) // 過濾 80 分以上
  .map((student) => student.name) // 提取姓名
  .sort(); // 排序

console.log(mathTopStudents); // ["小明", "小麗"]

// 複雜的資料處理
const salesData = [
  { product: "iPhone", category: "手機", sales: 100, price: 30000 },
  { product: "Samsung", category: "手機", sales: 80, price: 25000 },
  { product: "MacBook", category: "筆電", sales: 50, price: 50000 },
  { product: "iPad", category: "平板", sales: 70, price: 20000 },
];

// 計算手機類別的總營收
const phoneRevenue = salesData
  .filter((item) => item.category === "手機")
  .map((item) => item.sales * item.price)
  .reduce((total, revenue) => total + revenue, 0);

console.log(phoneRevenue); // 5000000

// 找出最暢銷的產品類別
const categoryStats = salesData.reduce((stats, item) => {
  if (!stats[item.category]) {
    stats[item.category] = { totalSales: 0, products: [] };
  }
  stats[item.category].totalSales += item.sales;
  stats[item.category].products.push(item.product);
  return stats;
}, {});

console.log(categoryStats);
```

## 實際應用場景

### 1. 電商網站商品篩選

```javascript
const products = [
  {
    id: 1,
    name: "iPhone 15",
    price: 32900,
    category: "手機",
    brand: "Apple",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Samsung S24",
    price: 28900,
    category: "手機",
    brand: "Samsung",
    rating: 4.6,
  },
  {
    id: 3,
    name: "MacBook Pro",
    price: 59900,
    category: "筆電",
    brand: "Apple",
    rating: 4.9,
  },
  {
    id: 4,
    name: "iPad Air",
    price: 19900,
    category: "平板",
    brand: "Apple",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Surface Pro",
    price: 35900,
    category: "平板",
    brand: "Microsoft",
    rating: 4.5,
  },
];

// 商品篩選功能
function filterProducts(products, filters) {
  return products
    .filter((product) => {
      // 價格範圍篩選
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;

      // 類別篩選
      if (filters.category && product.category !== filters.category)
        return false;

      // 品牌篩選
      if (filters.brand && product.brand !== filters.brand) return false;

      // 評分篩選
      if (filters.minRating && product.rating < filters.minRating) return false;

      return true;
    })
    .sort((a, b) => {
      // 排序邏輯
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
}

// 使用範例
const filters = {
  category: "手機",
  maxPrice: 30000,
  minRating: 4.5,
  sortBy: "price-low",
};

const filteredProducts = filterProducts(products, filters);
console.log(filteredProducts);
```

### 2. 資料統計與分析

```javascript
const orders = [
  {
    id: 1,
    customerId: 101,
    amount: 1500,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    customerId: 102,
    amount: 2300,
    date: "2024-01-16",
    status: "completed",
  },
  {
    id: 3,
    customerId: 101,
    amount: 800,
    date: "2024-01-17",
    status: "pending",
  },
  {
    id: 4,
    customerId: 103,
    amount: 3200,
    date: "2024-01-18",
    status: "completed",
  },
  {
    id: 5,
    customerId: 102,
    amount: 1200,
    date: "2024-01-19",
    status: "cancelled",
  },
];

// 銷售統計
const salesStats = {
  // 總營收（僅完成的訂單）
  totalRevenue: orders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.amount, 0),

  // 平均訂單金額
  averageOrderValue: orders
    .filter((order) => order.status === "completed")
    .reduce((total, order, index, array) => {
      total += order.amount;
      return index === array.length - 1 ? total / array.length : total;
    }, 0),

  // 每個客戶的訂單統計
  customerStats: orders.reduce((stats, order) => {
    if (!stats[order.customerId]) {
      stats[order.customerId] = {
        totalOrders: 0,
        totalAmount: 0,
        completedOrders: 0,
      };
    }

    stats[order.customerId].totalOrders++;
    stats[order.customerId].totalAmount += order.amount;

    if (order.status === "completed") {
      stats[order.customerId].completedOrders++;
    }

    return stats;
  }, {}),

  // 訂單狀態分布
  statusDistribution: orders.reduce((distribution, order) => {
    distribution[order.status] = (distribution[order.status] || 0) + 1;
    return distribution;
  }, {}),
};

console.log(salesStats);
```

### 3. 表單驗證

```javascript
const formValidation = {
  // 驗證規則
  rules: {
    email: [
      { test: (value) => value.length > 0, message: "Email 不能為空" },
      {
        test: (value) => /\S+@\S+\.\S+/.test(value),
        message: "Email 格式不正確",
      },
    ],
    password: [
      { test: (value) => value.length >= 8, message: "密碼至少需要 8 個字元" },
      { test: (value) => /[A-Z]/.test(value), message: "密碼需要包含大寫字母" },
      { test: (value) => /[0-9]/.test(value), message: "密碼需要包含數字" },
    ],
    name: [
      { test: (value) => value.length > 0, message: "姓名不能為空" },
      { test: (value) => value.length >= 2, message: "姓名至少需要 2 個字元" },
    ],
  },

  // 驗證單一欄位
  validateField(fieldName, value) {
    const fieldRules = this.rules[fieldName] || [];
    const errors = fieldRules
      .filter((rule) => !rule.test(value))
      .map((rule) => rule.message);

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // 驗證整個表單
  validateForm(formData) {
    const results = Object.keys(formData).map((fieldName) => ({
      field: fieldName,
      ...this.validateField(fieldName, formData[fieldName]),
    }));

    const isFormValid = results.every((result) => result.isValid);
    const allErrors = results
      .filter((result) => !result.isValid)
      .reduce((errors, result) => {
        errors[result.field] = result.errors;
        return errors;
      }, {});

    return {
      isValid: isFormValid,
      errors: allErrors,
    };
  },
};

// 使用範例
const formData = {
  email: "test@example.com",
  password: "Password123",
  name: "張小明",
};

const validationResult = formValidation.validateForm(formData);
console.log(validationResult);
```

## 效能考量與最佳實踐

### 1. 選擇適當的方法

```javascript
const numbers = [1, 2, 3, 4, 5];

// ❌ 不好的做法：使用 map 但不需要回傳值
numbers.map((num) => console.log(num));

// ✅ 好的做法：使用 forEach
numbers.forEach((num) => console.log(num));

// ❌ 不好的做法：使用 filter + map 可以合併
const result1 = numbers.filter((num) => num > 2).map((num) => num * 2);

// ✅ 好的做法：使用 reduce 一次完成
const result2 = numbers.reduce((acc, num) => {
  if (num > 2) {
    acc.push(num * 2);
  }
  return acc;
}, []);
```

### 2. 避免不必要的計算

```javascript
const products = [
  /* 大量商品資料 */
];

// ❌ 不好的做法：每次都重新計算
function getExpensiveProducts() {
  return products.filter((product) => product.price > 10000);
}

// ✅ 好的做法：快取結果
let expensiveProductsCache = null;
function getExpensiveProducts() {
  if (!expensiveProductsCache) {
    expensiveProductsCache = products.filter(
      (product) => product.price > 10000
    );
  }
  return expensiveProductsCache;
}
```

### 3. 處理大型陣列

```javascript
// 對於大型陣列，考慮使用分批處理
function processBigArray(bigArray, batchSize = 1000) {
  const results = [];

  for (let i = 0; i < bigArray.length; i += batchSize) {
    const batch = bigArray.slice(i, i + batchSize);
    const batchResult = batch
      .filter((item) => item.isActive)
      .map((item) => ({ ...item, processed: true }));

    results.push(...batchResult);
  }

  return results;
}
```

## 常見錯誤與解決方案

### 1. 修改原陣列

```javascript
const numbers = [1, 2, 3, 4, 5];

// ❌ 錯誤：forEach 中修改原陣列
numbers.forEach((num, index) => {
  if (num % 2 === 0) {
    numbers.splice(index, 1); // 這會導致問題
  }
});

// ✅ 正確：使用 filter 建立新陣列
const oddNumbers = numbers.filter((num) => num % 2 !== 0);
```

### 2. 忘記回傳值

```javascript
// ❌ 錯誤：忘記回傳值
const doubled = numbers.map((num) => {
  num * 2; // 忘記 return
});

// ✅ 正確：記得回傳值
const doubled = numbers.map((num) => {
  return num * 2;
});

// 或使用箭頭函數的簡寫
const doubled = numbers.map((num) => num * 2);
```

### 3. 混淆 find 和 filter

```javascript
const users = [
  { id: 1, name: "小明" },
  { id: 2, name: "小華" },
  { id: 3, name: "小美" },
];

// find 回傳第一個符合條件的元素
const user = users.find((user) => user.id === 2);
console.log(user); // { id: 2, name: "小華" }

// filter 回傳所有符合條件的元素組成的陣列
const filteredUsers = users.filter((user) => user.id === 2);
console.log(filteredUsers); // [{ id: 2, name: "小華" }]
```

## 總結

JavaScript 陣列方法是現代前端開發的基石，掌握這些方法能讓你：

### 主要優勢

1. **提升程式碼品質**：更簡潔、更易讀
2. **減少錯誤**：避免手動迴圈的常見錯誤
3. **函數式程式設計**：促進不變性和純函數
4. **提高開發效率**：減少重複的樣板程式碼

### 學習建議

1. **從基礎開始**：先熟悉 `map`、`filter`、`reduce`
2. **多練習**：在實際專案中應用這些方法
3. **理解差異**：知道何時使用哪個方法
4. **組合使用**：學會鏈式呼叫和方法組合
5. **注意效能**：在處理大型資料時考慮效能影響

### 下一步學習

- 深入學習函數式程式設計概念
- 了解 ES6+ 的其他陣列方法（如 `flatMap`、`includes` 等）
- 學習 Lodash 等函數式程式庫
- 探索 React、Vue 等框架中的陣列方法應用

記住，熟練掌握這些陣列方法不僅能讓你寫出更好的程式碼，還能幫助你更好地理解現代 JavaScript 框架和函式庫的工作原理。持續練習，你會發現這些方法將成為你開發工具箱中最有價值的工具！
