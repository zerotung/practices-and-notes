# let 和 const 命令

## let 命令

### 基本用法

`let` 命令只在其所在的代码块内有效。

```javascript
{ let a = 10; var b = 1; }
a // ReferenceError: a is not defined.
b // 1
```

`for` 循环计数器，就很合适使用 `let` 命令。

```javascript
for (let i = 0; i < 10; i++) {}
console.log(i); // ReferenceError: i is not defined.
```

下面的代码如果使用 `var` ，输出结果是10。 `i` 是 `var` 声明的，在全局范围有效。新的 `i` 会覆盖旧值。

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 10
```

如果使用 `let` ，声明的变量仅在块级作用域内有效，最后输出的是6。

```javascript
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[6](); // 6
```

在 `for` 循环中，循环语句部分是一个父作用域，而循环体内部是一个单独的子作用域。

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
 // abc abc abc
```

### 不存在变量提升

变量一定要在声明后使用，否则报错。

```javascript
console.log(foo); // undefined
var foo = 2;
console.log(bar); // ReferenceError
let bar = 2;
```

### 暂时性死区

只要块级作用域内存在 `let` 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。这在语法上，成为“暂时性死区”（Temporal Dead Zone，简称 TDZ）。

```javascript
var tmp = 123;
if(true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

“暂时性死区”意味着 `typeof` 不再是一个百分之百安全的操作。

```javascript
typeof x; // ReferenceError
let x;
typeof undeclared_variable; // "undefined"
```

上面代码中，变量 `x` 使用 `let` 命令声明，所以在声明之前，都属于 `x` 的“死区”，只要用到该变量就会报错。如果一个变量根本没有被什么，使用 `typeof` 反而不会报错。

有些“死区”比较隐蔽，不太容易发现。

```javascript
function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // 报错
var x = x; // 不报错
let x = x; // ReferenceError: x is not defined
```

调用 `bar` 函数报错，因为参数 `x` 默认值等于另一个参数 `y` ，而此时 `y` 还没有声明，属于“死区”。

### 不允许重复声明

`let` 不允许在同一作用域内，重复声明同一个变量。因此，不能再函数内部重复声明参数。

```javascript
function func(arg) {
  let arg; // 报错
}
function func(arg) {
  {
    let arg; //不报错
  }
}
```

## 块级作用域

### 为什么需要块级作用域

1. 内层变量可能会覆盖外层变量

   ```javascript
   var tmp = new Date();
   function f() {
     console.log(tmp);
     if (false) {
       var tmp = "hello world";
     }
   }
   f(); // undefined
   ```

2. 用来计数的循环变量泄露为全局变量

   ```javascript
   var s = "hello";
   for (var i = 0; i < s.length; i++) {
     console.log(s[i]);
   }
   console.log(i); // 5
   ```

### ES6的块级作用域

`let` 实际上为 JavaScript 新增了块级作用域。外层代码块不受内层代码块的影响。

```javascript
function f1() {
  let n = 5;
  if (true) { let n = 10; }
  console.log(n); // 5
}
```

ES6 允许块级作用域的任意嵌套，外层作用域无法读取内层作用域的变量。内层作用域可以定义外层作用域的同名变量。块级作用域的出现，使得广泛应用的立即执行函数表达式（IIFE）不再必要了。

```javascript
{{{{
  let insane1 = 'Hello World';
  {
    let insane1 = 'Hello World';
    let insane2 = 'Hello World';
  }
  console.log(insane2) // ReferenceError
}}}}

(function() { // IIFE 写法
  var tmp = ...;
  ...
}());
{ // 块级作用域写法
  let tmp = ...;
  ...
}
```

### 块级作用域与函数声明

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能再块级作用域声明。如：

```javascript
if (true) { function f() {}}
try { function f() {} } catch(e) {}
```

在严格模式下会报错。

ES6 引入了块级作用域，明确允许在块级作用域中声明函数。ES6 规定，块级作用域之中，函数声明语句的行为类似于 `let` ，在块级作用域之外不可引用。

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```javascript
{ // 函数声明语句
  let a = 'secret';
  function f() { return a; }
}
{ // 函数表达式
  let a = 'secret';
  let f = function () { return a; };
}
```

ES6 的块级作用域允许声明函数的规则，只在使用大括号的情况下成立。如果未使用大括号，就会报错。

### do 表达式

本质上，块级作用域是一个语句，将多个操作封装在一起，没有返回值。现在有一个提案，使得块级作用域可以变为表达式，也就是说可以返回值，办法就是在块级作用域前加上 `do` ，使它变为 `do` 表达式。

```javascript
let x = do { let t = f(); t * t + 1;}
```

## const 命令

`const` 声明一个只读的常量。一旦声明，常量的值就不能改变。

```javascript
const PI = 3.1415;
PI // 3.1415
PI = 3 // TypeError: Assignment to constant variable.
```

`const` 声明必须初始化，若只声明不赋值就会报错。

`const` 的作用域与 `let` 命令相同，只在声明所在的块级作用域内有效，常量声明也不提升，同样存在暂时性死区，只能在声明的位置后面使用。不可重复声明。

对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。`const` 命令只是保证变量名指向的地址不变，不保证数据不变。

```javascript
const foo = {};
foo.prop = 123;
foo.prop // 123
foo = {}; // TypeError: "foo" is read-only

const a = [];
a.push('hello'); // 可执行
a.length = 0; // 可执行
a = ['Dave']; // 报错
```

如果真的想将对象冻结，应该使用 `Object.freeze` 方法。

```javascript
const foo = Object.freeze({});
// 常规模式时，下面一行不起作用；
// 严格模式时，下面一行会报错
foo.prop = 123;
```

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。

```javascript
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((key, value) => {
    if (typeof obj[key] === 'object') {
      constantize(obj[key]);
    }
  });
};
```

## 顶层对象的属性

顶层对象，在浏览器环境指的是 `window` 对象，在Node指的是 `global` 对象。ES5 之中，顶层对象的属性与全局变量是等价的。这样的设计会带来几个很大的问题：

1. 没法再编译时就报出变量未声明的错误，只有在运行时才能知道
2. 程序员很容易不知不觉地创建了全局变量
3. 顶层对象的属性是到处可以读写的，不利于模块化编程
4. `window` 对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也不适合

ES6 中，`var` 命令和 `function` 命令声明的全局变量，依旧是顶层对象的属性。`let` 命令、`const` 命令、`class` 命令声明的全局变量，不属于顶层对象属性。

```javascript
var a = 1;
// 如果在Node的REPL环境，可以写成global.a
// 如果采用通用方法，写成this.a
window.a // 1
let b = 1;
window.b // undefined
```

## global 对象

ES5 的顶层对象，本身也是一个问题，因为它在各种实现里面是不统一的。

- 浏览器里面，顶层对象是 `window` ，但 Node 和 Web Worker 没有 `window` 
- 浏览器和 Web Worker 里面，`self` 也指向顶层对象，但是 Node 没有 `self`
- Node 里面，顶层对象是 `global` ，但其他环境都不支持

同一段代码为了能够在各个环境，都能渠道顶层对象，现在一般是使用 `this` 变量，但是有局限性。下面提供两种勉强可以使用的方法。

```javascript
// 方法一
(typeof window !== 'undefined'
  ? window
  : (typeof process === 'object' &&
     typeof require === 'function' &&
     typeof global === 'object')
    ? global
    : this);

// 方法二
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

