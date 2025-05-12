---
title: type跟interface
date: 2025-04-029
slug: Typescript的類型
category: typescript
---

# TypeScript 中的 type 與 interface

TypeScript 提供了兩種主要的方式來定義類型：`type` 和 `interface`。這兩種機制雖然有許多相似之處，但在某些情況下卻有著關鍵的差異。本文將由淺入深地探討這兩種類型定義方式的用法、差異和最佳實踐。

## 基本概念

### type（類型別名）

`type` 關鍵字用於創建一個類型別名，可以為任何類型指定一個名稱：

```typescript
// 基本類型別名
type Name = string;
type Age = number;
type IsActive = boolean;

// 使用類型別名
const userName: Name = "張三";
const userAge: Age = 25;
const isUserActive: IsActive = true;
```

### interface（介面）

`interface` 用於定義物件的結構：

```typescript
// 基本介面
interface User {
  name: string;
  age: number;
  isActive: boolean;
}

// 使用介面
const user: User = {
  name: "張三",
  age: 25,
  isActive: true,
};
```

## 主要相似點

### 1. 描述物件結構

兩者都可以用來描述物件的結構：

```typescript
// 使用 type
type Person = {
  name: string;
  age: number;
};

// 使用 interface
interface Person {
  name: string;
  age: number;
}
```

### 2. 擴展已有類型

兩者都支持擴展已有的類型：

```typescript
// 使用 type 擴展
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

// 使用 interface 擴展
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

### 3. 實現泛型

兩者都支持泛型：

```typescript
// 使用 type 的泛型
type Box<T> = {
  value: T;
};

const stringBox: Box<string> = { value: "Hello" };

// 使用 interface 的泛型
interface Container<T> {
  value: T;
}

const numberContainer: Container<number> = { value: 42 };
```

## 主要差異

### 1. 聯合類型

`type` 可以直接定義聯合類型，但 `interface` 不可以：

```typescript
// type 可以是聯合類型
type ID = string | number;

// 這無法用 interface 直接實現
```

### 2. 交叉類型

`type` 使用 `&` 進行交叉，而 `interface` 使用 `extends`：

```typescript
// type 的交叉類型
type Employee = Person & {
  employeeId: string;
};

// interface 的擴展
interface Manager extends Person {
  managerId: string;
}
```

### 3. 聲明合併

`interface` 支援聲明合併，而 `type` 不支援：

```typescript
// interface 可以重複定義，會自動合併
interface User {
  name: string;
}

interface User {
  age: number;
}

// 等同於：
// interface User {
//   name: string;
//   age: number;
// }

// type 不能重複定義
type User = {
  name: string;
};

// 錯誤：標識符 'User' 重複定義
// type User = {
//   age: number;
// };
```

### 4. 原始值類型

`type` 可以使用原始值作為類型，但 `interface` 不行：

```typescript
// type 可以使用字面量類型
type Direction = "North" | "South" | "East" | "West";
type OneToFive = 1 | 2 | 3 | 4 | 5;

// interface 不能這樣做
```

### 5. 元組和數組

`type` 可以更容易地定義元組和特定數組類型：

```typescript
// type 定義元組
type Point = [number, number];
type RGB = [number, number, number];

// interface 需要間接定義
interface PointInterface {
  0: number;
  1: number;
  length: 2;
}
```

## 進階用法

### 條件類型（僅適用於 type）

`type` 可以使用條件類型（三元運算符）：

```typescript
type IsArray<T> = T extends any[] ? true : false;

type CheckString = IsArray<string>; // false
type CheckArray = IsArray<number[]>; // true
```

### 映射類型（主要用於 type）

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface Person {
  name: string;
  age: number;
}

// 所有屬性變為只讀
type ReadonlyPerson = Readonly<Person>;

// 所有屬性變為可選
type OptionalPerson = Optional<Person>;
```

### 索引訪問類型

```typescript
interface Person {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

type City = Person["address"]["city"]; // string
```

### 實用工具類型

TypeScript 內建了許多實用的工具類型，主要基於 `type`：

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 將所有屬性變為可選
type PartialTodo = Partial<Todo>;

// 將所有屬性變為必需
type RequiredTodo = Required<Todo>;

// 將所有屬性變為只讀
type ReadonlyTodo = Readonly<Todo>;

// 從 Todo 中選擇部分屬性
type TodoPreview = Pick<Todo, "title" | "completed">;

// 從 Todo 中排除部分屬性
type TodoInfo = Omit<Todo, "completed">;
```

## 最佳實踐與選擇指南

### 何時使用 interface

1. **定義物件的公共 API**：當你要定義類、函數庫或第三方 API 的形狀時
2. **需要聲明合併**：當你需要在多個地方擴展同一個介面時
3. **實現 OOP 設計模式**：尤其是在需要類實現介面的情況下

```typescript
interface Repository<T> {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(item: T): void;
}

class UserRepository implements Repository<User> {
  // 實現所有方法...
}
```

### 何時使用 type

1. **聯合類型或交叉類型**：需要組合多種類型時
2. **基本類型的別名**：為基本類型創建語義化名稱時
3. **元組**：需要固定長度和特定位置類型的數組時
4. **複雜的類型轉換和操作**：使用條件類型、映射類型等
5. **不希望類型被擴展**：希望類型定義固定不變時

```typescript
// 聯合類型
type Result<T> = T | Error;

// 複雜類型轉換
type ExtractProps<T> = T extends { props: infer P } ? P : never;
```

## TypeScript 團隊的建議

TypeScript 團隊的官方建議是：

> 從 TypeScript 2.1 開始，interface 和 type 的功能差距已經大幅縮小。在大多數情況下，你可以自由選擇使用哪一個。一個常見的經驗法則是當你需要使用 interface 獨有的功能（如聲明合併）時使用 interface；當你需要使用 type 獨有的功能（如聯合類型、映射類型）時使用 type。

## 結論

`type` 和 `interface` 各有其優勢和適用場景。理解它們的差異可以幫助你在 TypeScript 中寫出更清晰、更強大的類型定義。在實際項目中，兩者通常會一起使用，根據具體需求選擇最合適的工具。

總的來說，選擇 `type` 還是 `interface` 取決於你的具體需求，而不是某一個總是優於另一個。隨著你對 TypeScript 的理解加深，你會更加自然地知道在什麼情況下使用哪一個。
