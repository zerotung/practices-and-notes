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

# 变量的解构赋值

## 数组的解构赋值

### 基本用法

ES6 允许按照一定模式，从数组和变量中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```javascript
let [a, b, c] = [1, 2, 3];
```

ES6 允许写成上面这样，从数组中提取值，按照对应位置，对变量赋值。本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会赋予对应的值。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]]; // foo=1;bar=2;baz=3
let [ , , third] = ['foo', 'bar', 'baz']; // third='baz'
let [x, , y] = [1, 2, 3]; // x=1;y=3
let [head, ...tail] = [1, 2, 3, 4]; //head=1;tail=4
let [x, y, ...z] = ['a']; // x='a';y=undefined;z=[]
```

如果解构不成功，变量的值就等于 `undefined` 。

另一种情况是不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况依然可以解构成功。

```javascript
let [x, y] = [1, 2, 3]; // x=1;y=2
let [a, [b], d] = [1, [2, 3], 4]; // a=1;b=2;d=4
```

如果等号的右边不是数组（或者严格的说，不是可遍历的结构），那么将会报错

```javascript
let [foo] = 1; let [foo] = false; let [foo] = NaN; let [foo] = undefined; let [foo] = null; let [foo] = {};
```

对于 Set 结构，也可以使用数组的解构赋值。

```javascript
let [x, y, z] = new Set(['a', 'b', 'c']);
x // "a"
```

实际上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。下面代码中， `fibs` 是一个 Generator 函数，原生具有 Iterator 接口。解构赋值会依次从这个接口获取值。

```javascript
function* fibs() {
  let a = 0;
  let b = 1;
  while(true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

### 默认值

解构赋值允许指定默认值。ES6 内部使用严格相等运算符 `===` 判断一个位置是否有值。所以，如果一个数组成员不严格等于 `undefined` ，默认值是不会生效的。

```javascript
let [foo = true] = []; foo //true
let [x, y = 'b'] = ['a']; // x='a';y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a';y='b'
let [x = 1] = [null]; x // null
```

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```javascript
function f() {
  console.log('aaa');
}
let [x = f()] = [1];
```

上面的代码由于 `x` 能取到值，所以函数 `f` 根本不会执行。默认值可以引用解构赋值的其他变量，但该变量必须已经声明。

```javascript
let [x = 1, y = x] = []; // x=1; y=1
let [x = 1, y = x] = [2]; // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = []; // ReferenceError
```

## 对象的解构赋值

对象的解构与数组有一个重要的不同。数组的元素是按次序排序的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```javascript
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"
let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined
```

上面代码的第一个例子，等号左边的两个变量的次序，与等号右边的两个同名属性的次序不一致，但是对取值完全没有影响。第二个例子的变量没有对应的同名属性，导致取不到值，最后等于 `undefined` 。

如果变量名与属性名不一致，必须写成下面这样。对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```javascript
var { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

采用这种写法时，变量的声明和赋值是一体的。对于 `let` 和 `const` 来说，变量不能重新声明。

```javascript
let foo; ({foo} = {foo: 1});
let baz; ({bar: baz} = {bar: 1});
```

上面代码中，`let` 命令后的圆括号是必须的，否则解析器会将起首的大括号，理解成一个代码块，而不是赋值语句。

和数组一样，解构也可以用于嵌套结构的对象。

```javascript
let obj = {
  p: [
    'Hello',
    { y: 'World'}
  ]
};
let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

let node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};
var { loc: { start: { line }} } = node;
line // 1
loc // error: loc is undefined
start // error: loc is undefined
```

下面是嵌套赋值的例子。

```javascript
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
obj // {prop:123}
arr // [true]
```

对象的解构也可以指定默认值。默认值生效的条件是，对象的属性值严格等于 `undefined` 。

```javascript
var { x = 3 } = {}; // x=3
var { x, y = 5 } = { x: 1 }; // x=1; y=5
var { x: y = 3 } = {}; // y=3
var { x: y = 3 } = { x: 5 } // y=5
var { message: msg = 'Something went wrong' } = {}; // msg="Something went wrong"
var { x = 3 } = { x: undefined }; // x=3
var { x = 3 } = { x: null }; // x=null
```

如果解构失败，变量的值等于 `undefined` ，如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错。

```javascript
let { foo } = { bar: 'baz' };
foo // undefined

let { foo: {bar}} = { bar: 'baz' }; // 报错
```

对象的解构赋值，可以很方便的将现有的对象的方法，赋值到某个变量。

```javascript
let { log, sin, cos } = Math;
```

由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。

```javascript
let arr = [1, 2, 3];
let {0: first, [arr.length -1] : last} = arr;
first // 1
last // 3
```

## 字符串的解构赋值

字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象。

```javascript
const [a, b, c, d, e] = 'hello';
// a='h'; b='e'; c='l'; d='l'; e='o'
```

类似数组的对象都有一个 `length` 属性，因此还可以对这个属性解构赋值。

```javascript
let { length: len } = 'hello';
len // 5
```

## 数值和布尔值的解构赋值

如果等号右边是数值和布尔值，会先转为对象。

```javascript
let {toString: s} = 123;
s === Number.prototype.toString // true
let {toString: s} = true;
s === Boolean.prototype.toString // true
```

解构赋值的规则是，只要等号右边的值不是对象，就先将其转为对象。由于 `undefined` 和 `null` 无法转为对象，所以对他们进行解构赋值，都会报错。

## 函数参数的解构赋值

```javascript
function add([x, y]) {
  return x + y;
}
add([1, 2]) // 3
```

函数 `add` 的参数表面上是一个数组，但在传入参数的那一刻，参数就被解析成了 `x` 和 `y` 。

```javascript
[[1, 2], [3, 4]].map(([a, b]) => a + b); // [3, 7]
```

函数参数的解构也可以使用默认值。由于后一个函数 `move` 的参数指定默认值，而不是变量 `x` 和 `y` 指定默认值，所以会得到不同的结果。

```javascript
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = {x: 0, y: 0}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

`undefined` 就会触发函数参数的默认值

```javascript
[1, undefined, 3].map((x = 'yes') => x); // [1, 'yes', 3]
```

## 圆括号问题

ES6的规则是，只要有可能导致解构的歧义，就不得使用圆括号。建议只要有可能，就不要在模式中放置圆括号。

以下三种解构赋值不能使用圆括号

1. 变量声明语句中，不能带有圆括号
2. 函数参数中，模式不能带有圆括号
3. 赋值语句中，不能将整个模式，或嵌套模式中的一层，放在圆括号中

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。

```javascript
[(b)] = [3]; ({ p: (d) } = {}); [(parseInt.prop)] = [3];
```

## 用途

1. 交换变量的值

   ```javascript
   let x = 1, y = 2; [x, y] = [y, x];
   ```

2. 从函数返回多个值

   ```javascript
   function foo() { return [1, 2, 3]; } // 返回一个数组
   let [a, b, c] = foo();
   function bar() { return { a: 1, b: 2}; } // 返回一个对象
   let { a, b } = bar();
   ```

3. 函数参数的定义

   ```javascript
   function f([x, y, z]) { ... } // 参数是一组有次序的值
   f([1, 2, 3]);
   function f({x, y, z}) { ... } // 参数是一组无次序的值
   f({z: 3, y: 2, x: 1});
   ```

4. 提取 JSON 数据

   ```javascript
   let jsonData = { id: 42, status: "OK", data: [867, 5309] };
   let { id, status, data: number } = jsonData;
   console.log(id, status, number); // 42, "OK", [867, 5309]
   ```

5. 函数参数的默认值

   ```javascript
   jQuery.ajax = function (url, {
     async = true, beforeSend = function() {}, cache = true,
     complete = function() {}, crossDomain = false, global = true,
     // ... more config
   }) {
     // ... do stuff
   };
   ```

6. 遍历 Map 结构

   任何部署了 Iterator 接口的对象，都可以用 `for…of` 循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便了。

   ```javascript
   var map = new Map();
   map.set('first', 'hello');
   map.set('second', 'world');
   for (let [key, value] of map) {
     console.log(key + " is" + value);
   }
   // first is hello  second is world
   for (let [key] of map) { ... } // 获取键名
   for (let [, value] of map) { ... } // 获取键值
   ```

7. 输入模块的指定方法

   加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。

   ```javascript
   const { SourceMapConsumer, SourceNode } = require("source-map");
   ```

