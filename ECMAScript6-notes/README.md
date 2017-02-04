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

# 字符串的扩展

## 字符的 Unicode 表示法

JavaScript 允许采用 `\uxxxx` 形式表示一个字符，但这种表示方法仅限于 `\u0000-\uFFFF` 之间的字符。

ES6 对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。

```javascript
"\u{20BB7}" // "𠮷"
"\u{41}\u{42}\u{43}" // "ABC"
let hello = 123; hell\u{6F} // 123
'\u{1F680}' === '\uD83D\uDE80' // true
```

有了这种表示法后，JavaScript 共有 6 种方法表示一个字符。

```javascript
'z' === '\z' === '\172' === '\x7A' === '\u007A' === '\u{7A}'
```

## codePointAt()

```javascript
var s = "𠮷";
s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) //55362
s.charCodeAt(1) //57271
```

对于 4 个字节的字符，JavaScript 不能正确处理，字符串长度会误判为 2，而且`charAt` 方法无法读取整个字符， `charCodeAt` 方法只能分别返回前两个字节和后两个字节的值。

ES6 提供了 `codePointAt` 方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。

```javascript
var s = '𠮷a';
s.codePointAt(0) // 134071 0x20BB7
s.codePointAt(1) // 57271
s.codePointAt(2) // 97
```

`codePointAt` 方法在第一个字符上，正确地识别了“𠮷”，在第二个字符（“𠮷”的后两个字节）和第三个字符上，`codePointAt` 和 `charCodeAt` 方法相同。

`codePointAt` 方法返回的是码点的十进制值，如果想要十六进制的值，可以使用 `toString` 方法转换一下。

```javascript
var s = '𠮷a';
s.codePointAt(0).toString(16); // "20bb7"
```

使用 `for … of` 循环正确识别 32 位的 UTF-16 字符。

```javascript
var s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 20bb7  61
```

`codePointAt` 方法时测试一个字符由两个字节还是四个字节组成的最简单方法。

```javascript
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}
is32Bit("𠮷") // true
is32Bit("a") // false
```

## String.fromCodePoint()

ES6 提供了 `String.fromCodePoint()` 方法，可以识别 32 位的 UTF-16字符，弥补了 `String.fromCharCode` 方法的不足。作用上，正好与 `codePointAt` 方法相反。

```javascript
String.fromCodePoint(0x20BB7) // "𠮷"
```

注意，`fromCodePoint` 方法定义在 `String` 对象上，而 `codePointAt` 方法定义在字符串的实例对象上。

## 字符串的遍历器接口

ES6 为字符串添加了遍历器接口，使得字符串可以被 `for … of` 循环遍历。可以识别大于 `0xFFFF` 的码点。

```javascript
for (let codePoint of 'foo') {
  console.log(codePoint);
} // "f", "o", "o"
```

## at()

ES5 对字符串对象提供 `charAt` 方法，返回字符串给定位置的字符。但该方法无法识别码点大于 `0xFFFF` 的字符。目前有一个提案，提出字符串实例的 `at` 方法，用于识别返回码点大于 `0xFFFF` 的正确的字符。

```javascript
'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"
```

## normalize()

用于解决语调符号和重音符号在视觉和语义上等价，但是 JavaScript 不识别的问题。

```javascript
'\u01D1' === '\u004F\u030c' // false Ǒ(\u01D1) Ǒ(\u004F\u030c)
'\u01D1'.normalize() === '\u004F\u030c'.normalize() // true
```

## includes(), startsWith(), endsWith()

- **includes()** 返回布尔值，表示是否找到了参数字符串
- **startsWith()** 返回布尔值，表示参数字符串是否在源字符串的头部
- **endsWith()** 返回布尔值，表示参数字符串是否在源字符串的尾部

```javascript
var s = 'Hello world!';
s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) //false
```

## repeat()

`repeat()` 方法返回一个新字符串，表示将原字符串重复 n 次。参数如果是小数，会被取整，如果是负数或者 `Infinity` ，会报错（-1 到 0 之间的小数会等同于 0）。`NaN` 等同于 0。若参数是字符串，则会先转换成数字。

```javascript
'hello'.repeat(2) // "hellohello"
```

## padStart(), padEnd()

ES7 推出了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。`padStart` 用于头部补全，`padEnd` 用于尾部补全。

```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padEnd(4, 'ab') // 'xaba'
'xxx'.padStart(2, 'ab') // 'xxx'
'abc'.padStart(10, '0123456789') // '0123456abc'
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

`padStart` 的常见用途是为数值补全指定位数，以及提示字符串格式。

```javascript
'12'.padStart(10, '0') // "0000000012"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```

## 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当做普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```javascript
`In JavaScript '\n' is a line-feed.`;
console.log(`string text line1
string text line 2`);
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```

使用模板字符串的空格和换行，都会被保留。模板字符串中嵌入变量，需写在 `${}` 中。大括号内可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性，调用函数。如果大括号中的值不是字符串，将按照一般的规则转为字符串。如果变量没有声明，将报错。

## 标签模块

模板字符串的功能，不仅仅是上面这些。它可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能（tagged template）。

```javascript
alert`123` /* 等同于 */ alert('123')
```

但是，如果模板字符里面有变量，就不是简单的调用了，而是会先将模板字符串先处理成多个参数，再调用函数

```javascript
var a = 5, b= 10;
tag`Hello ${ a + b} world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

函数 `tag` 依次会接收到多个参数。

```javascript
function tag(stringArr, value1, value2) { ... }
// 等同于
function tag(stringArr, ...values) {}
```

“标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。

```javascript
var message = SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(templateData) {
  var s = templateData[0];
  for (var i = 1; i < arguments.length; i++) {
    var arg = String(arguments[i]);
    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}
```

上面代码中，`sender` 变量往往是用户提供的，经过 `SaferHTML` 函数处理，里面的特殊字符都会被转义。

```javascript
var sender = '<script>alert("abc")</script>'; // 恶意代码
var message = SaferHTML`<p>${sender} has sent you a message.</p>`;
message
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>
```

标签模板的另一个应用，就是多语言转换（国际化处理）。

```javascript
i18n`Welcome to ${siteName}, you are visitor number ${visitorNumber}!`
// "欢迎访问xxx，您是第xxxx位访问者！"
```

模板处理函数的第一个参数（模板字符串数组），还有一个 `raw` 属性，保存的是转义后的原字符串。

```javascript
console.log`123` // ["123", raw: Array[1]]

tag`First line\nSecond line`
function tag(strings) {
  console.log(strings.raw[0]);
  // "First line\\nSecond line"
}
```

## String.raw()

ES6 还为原生的 String 对象，提供了一个 `raw` 方法。

`String.raw` 方法，往往用来充当模板字符串的处理函数，返回一个斜杠都被转义的字符串，对应于替换变量后的模板字符串。如果原字符串的斜杠已经转义，那么 `String.raw` 不会做任何处理。

```javascript
String.raw`Hi\n${2+3}!` // "Hi\\n5!"
String.raw`Hi\\n` // "Hi\\n"
String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'
```

## 模板字符串的限制

由于模板字符串默认会将字符串转义，因此无法嵌入其他语言。

现在有一个提案，放松对 *标签模板*  里面的字符串转义的限制。如果遇到不合法的字符串转义，就返回 `undefined` ，而不是报错，并且从 `raw` 属性上面可以得到原始字符串。

```javascript
function tag(strs) {
  strs[0] === undefined
  strs.raw[0] === "\\unicode and \\u{55}";
}
tag`\unicode and \u{55}`
```

注意，这种字符串转义的放松，只在标签模板解析字符串时生效，其他场合依然会报错。

# 正则的扩展

## RegExp 构造函数

在 ES5 中，RegExp 构造函数的参数有两种情况。

- 第一个参数是字符串，第二个参数表示正则表达式的修饰符（flag）

  ```javascript
  var regex = new RegExp('xyz', 'i'); /* 等价于 */ var regex = /xyz/i;
  ```

- 参数是一个正则表达式，这时返回一个原有正则表达式的拷贝

  ```javascript
  var regex = new RegExp(/xyz/i); /* 等价于 */ var regex = /xyz/i;
  ```

ES5 不允许此时使用第二参数，添加修饰符，否则会报错。ES6 改变了这种行为。第二个参数指定的修饰符会覆盖原有正则表达式的修饰符。

```javascript
var regex = new RegExp(/xyz/, 'i'); // ES5
// Uncaught TypeError: Cannot supply flags when constructing one RegExp from another
new RegExp(/abc/ig, 'i').flags // "i"
```

## 字符串的正则方法

字符串对象共有 4 个方法，可以使用正则表达式：`match()`、`replace()`、`search()` 和 `split()`。

ES6 将这 4 个方法，在语言内部全部调用 RegExp 的实例方法，从而做到所有与正则相关的方法，全都定义在 RegExp 对象上。

- `String.prototype.match` 调用 `RegExp.prototype[Symbol.match]`
- `String.prototype.replace` 调用 `RegExp.prototype[Symbol.replace]`
- `String.prototype.search` 调用 `RegExp.prototype[Symbol.search]`
- `String.prototype.split` 调用 `RegExp.prototype[Symbol.split]`

## u修饰符

ES6 对正则表达式添加 `u` 修饰符，含义为“Unicode模式”，用来正确处理大于 `\uFFFF` 的 Unicode 字符。

```javascript
/^\uD83D/u.test('\uD83D\uDC2A') // false
/^\uD83D/.test('\uD83D\uDC2A') // true
```

### 点字符

点 `.` 字符在正则表达式中，含义是除了换行符以外的任意单个字符。对于码点大于 `0xFFFF` 的 Unicode 字符，点字符不能识别，必须加上 `u` 修饰符。

```javascript
var s = '𠮷';
/^.$/.test(s) // false
/^.$/u.test(s) // true
```

### Unicode 字符表示法

ES6 新增了使用大括号表示 Unicode 字符，这种表示法在正则表达式中必须加上 `u` 修饰符，才能识别。

```javascript
/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true
/\u{20BB7}/u.test('𠮷') // true
```

### 量词

使用 `u` 修饰符后，所有量词都会正确识别码点大于 `0xFFFF` 的 Unicode 字符。

```javascript
/a{2}/.test('aa') // true
/a{2}/u.test('aa') // true
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

另外，只有在使用 `u` 修饰符的情况下，Unicode 表达式当中的大括号才会被正确解读，否则会被解读为量词。

### 预定义模式

`u` 修饰符也影响到预定义模式，能否正确识别码点大于 `0xFFFF` 的 Unicode 字符。

```javascript
/^\S/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```

上面代码的 `\S` 是预定义模式，匹配所有不是空格的字符。只有加了 `u` 修饰符，它才能正确匹配码点大于 `0xFFFF` 的 Unicode 字符。利用这点可以写出正确返回字符串长度的函数。

```javascript
function codePointLength(text) {
  var result = text.match(/[\s\S]/gu);
  return result ? result.length : 0'
}
var s = '𠮷𠮷';
s.length // 4
codePointLength(s) // 2
```

### i 修饰符

有些 Unicode 字符的编码不同，但是字型很接近，比如 `\u0048` 和 `\u212A` 都是大写的 `K` 。

```javascript
/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true
```

## y 修饰符

ES6 还为正则表达式添加了 `y` 修饰符，叫做“粘连”（sticky）修饰符。

`y` 修饰符的作用与 `g` 修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一位开始，不同之处在于，`g` 修饰符只要剩余位置中存在匹配就可以，而 `y` 修饰符确保匹配必须从剩余的第一个位置开始，这也就是“粘连”的含义。

```javascript
var s = 'aaa_aa_a';
var r1 = /a+/g, r2 = /a+/y, r3 = /a+_/y;
r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]
r3.exec(s) // ["aaa_"]
r1.exec(s) // ["aa"]
r2.exec(s) // null
r3.exec(s) // ["aa_"]
```

使用 `lastIndex` 属性，可以更好地说明 `y` 修饰符。`lastIndex` 指定每次搜索的开始位置，`g` 修饰符从这个位置开始往后搜索，知道发现匹配为止。`y` 修饰符要求必须在 `lastIndex` 指定的位置发现匹配。进一步说，`y` 修饰符号隐含了头部匹配的标志 `^` 。

```javascript
const REGEX = /a/g;
REGEX.lastIndex = 2; // 指定从2号位(y)开始匹配
const match = REGEX.exec('xaya'); // 匹配成功
match.index // 在3号位置匹配成功 3
REGEX.lastIndex // 下次匹配从4号位开始 4
REGEX.exec('xaxa') // 4号位开始匹配失败 null
```

```javascript
const REGEX = /a/gy;
'aaxa'.replace(REGEX, '-') // '--xa'
'a1a2a3'.match(/a\d/y) // ["a1"]
'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
```

`y` 修饰符的一个应用，是从字符串提取token（词元），`y` 修饰符确保了匹配之间不会有漏掉的字符。`g` 会胡烈非法字符，而 `y` 不会。更易发现错误。

```javascript
const TOKEN_Y = /\s*(\+|[0-9]+)\s*/y;
const TOKEN_G  = /\s*(\+|[0-9]+)\s*/g;
tokenize(TOKEN_Y, '3 + 4'); // [ '3', '+', '4' ]
tokenize(TOKEN_G, '3 + 4'); // [ '3', '+', '4' ]
function tokenize(TOKEN_REGEX, str) {
  let result = [];
  let match;
  while (match = TOKEN_REGEX.exec(str)) {
    result.push(match[1]);
  }
  return result;
}
tokenize(TOKEN_Y, '3x + 4') // ['3']
tokenize(TOKEN_G, '3x + 4') // ['3', '+', '4']
```

## sticky 属性

与 `y` 修饰符相匹配，ES6 的正则对象多了 `sticky` 属性，表示是否设置了 `y` 修饰符。

```javascript
var r = /hello\d/y; r.sticky // true
```

## flags 属性

ES6 为正则表达式新增了 `flags` 属性，会返回正则表达式的修饰符

```javascript
/abc/ig.source // "abc"
/abc/ig.flags // "gi"
```

## RegExp.escape()

字符串必须转义，才能作为正则模式。

```javascript
function escapeExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
let str = '/path/to/resource.html?search=query';
escapeRegExp(str) // "\/path\/to\/resource\.html\?search=query"
```

字符串转义以后，可以使用 RegExp 构造函数生成正则模式。

## s 修饰符：dotAll 模式

正则表达式中，点 `.` 是一个特殊的字符，代表任意单个字符（除行终止符）。以下四个字符属于“行终止符”

- U+000A 换行符 `\n` 
- U+000D 回车符 `\r` 
- U+2028 行分隔符（line separator）
- U+2029 段分隔符（paragraph separator）

```javascript
/foo.bar/.test('foo\nbar') // false
/foo[^]bar/.test('foo\nbar') // true
```

现在有一个提案，引入 `\s` 修饰符，使得 `.` 可以匹配任意单个字符。正则表达式还引入一个 `dotAll` 属性，返回一个布尔值，表示该正则表达式是否处在 `dotAll` 模式。

`/s` 修饰符和多行修饰符 `/m` 不冲突，两者一起使用的情况下，`.` 匹配所有字符，而 `^` 和 `$` 匹配每一行的行首和行尾。

## 后行断言

JavaScript 语言的正则表达式，只支持先行断言（lookahead）和先行否定断言（negative lookahead），不支持后行断言（lookbehind）和后行否定断言（negative lookahead）。

- “先行断言”指的是，`x` 只有在 `y` 前面才匹配，必须写成 `/x(?=y)/` 
- “先行否定断言”值的是，`x` 只有不在 `y` 前面才匹配，必须写成 `/x(?!y)/` 

## Unicode 属性类

目前，有一个提案，引入了一种新的类的写法 `\p{…}` 和 `\P{…}` ，允许正则表达式匹配符合 Unicode 某种属性的所有字符。

```javascript
const regexGreekSymbol = /\p{Script=Greek}/u;
regexGreekSymbol.test('π') // u
```

上面代码中，`\p{Script=Greek}` 指定匹配一个希腊文字幕，所以匹配成功。

`\P{…}` 是 `\p{…}` 的反向匹配，即匹配不满足条件的字符。这两种类只对 Unicode 有效，所以使用的时候一定要加 `u` 修饰符。由于 Unicode 的各种属性非常多，所以这种新的类的表达能力非常强。

```javascript
const regex = /^\p{Decimal_Number}+$/u;
regex.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // true
```

`\p{Number}` 甚至能匹配罗马数字。

```javascript
// 匹配所有数字
const regex = /^\p{Number}+$/u;
regex.test('²³¹¼½¾') // true
regex.test('㉛㉜㉝') // true
regex.test('ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ') // true
```

# 数值的扩展

## 二进制和八进制表示法

ES6 提供了二进制和八进制数值的新的写法，分别用前缀 `0b(0B)` 和 `0o(0O)` 表示。可以使用 `Number` 方法将 `0b` 和 `0o` 字符串转换为十进制。

```javascript
0b111110111 === 503 // true
0o767 === 503 // true
Number('0b111') // 7
Number('0o10') // 8
```

## Number.isFinite(), Number.isNaN()

ES6 在 Number 对象上，新提供了 `Number.isFinite()` 和 `Number.isNaN()` 两个方法。

`Number.isFinite()` 用来检查一个数值是否为有限的。非有限的值包括 `NaN` `(-)Infinity` `'foo'` `'15'` `true` 

`Number.isNaN()` 用来检查一个值是否为 `NaN` 。

```javascript
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true'/0) // true
Number.isNaN('true'/'true') // true
```

新方法只对数值有效，非数字一律返回 `false` 。

## Number.parseInt(), Number.parseFloat()

ES6 将全局方法 `parseInt()` 和 `parseFloat()` ，移植到 Number 对象上，行为保持不变。这样做是为了逐步减少全局性方法，使得语言逐步模块化。

## Number.isInteger()

用于判断一个值是否为整数。需要注意的是，在 JavaScript 内部，整数和浮点数是同样的储存方法，所以 3 和 3.0 被视为同一个值。

```javascript
Number.isInteger(25.0) // true
```

## Number.EPSILON

ES6 在 Number 对象上面，新增了一个极小的常量 `Number.EPSILON` 。用于为浮点数计算设置一个误差范围，如果误差小于 `Number.EPSILON` ，我们就认为得到正确结果。

```javascript
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON;
}
withinErrorMargin(0.1 + 0.2, 0.3) // true
withinErrorMargin(0.2 + 0.2, 0.3) // false
```

## 安全整数和 Number.isSafeInteger()

JavaScript 能够准确表示的整数范围在 `-2^53~2^53（不含两个端点）` ，超过这个范围，无法精确表示这个值。

ES6 引入了 `Number.MAX_SAFE_INTEGER` 和 `Number.MIN_SAFE_INTEGER` 两个常量，用来表示这个范围的上下限。`Number.inSafeInteger()` 则是用来判断一个整数是否落在这个范围内。

实际使用时，不要只验证运算结果，而要同时验证参与运算的每一个值。

## Math 对象的扩展

### Math.trunc()

用于去除一个数的小数部分，返回整数部分。由于负数将导致向上向下取整的不同。

对于非数值，`Math.trunc` 内部使用 Number 方法将其先转为数值，对于空值或无法截取整数的值，返回 NaN。

```javascript
Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
```

### Math.sign()

用来判断一个数是正数、负数还是零。它返回五种值：

- 正数，返回 +1
- 负数，返回 -1
- 0，返回 0
- -0，返回 -0
- 其他值，返回 NaN

### Math.cbrt()

用于计算一个数的立方根，会先使用 Number 方法将其转换为数值

### Math.clz32

JavaScript 的整数使用 32 位二进制形式表示，`Math.clz32` 方法返回一个数的32位无符号整数形式有多少个前导0。clz32 函数名来自“count leading zero bits in 32-bit binary representations of a number”。

### Math.imul()

返回两个数以 32 位带符号整数形式相乘的结果，返回一个 32 位的带符号整数。`Math.imul` 方法可以返回很大的数相乘时，正确的低位数值。

### Math.fround()

返回一个数的单精度浮点数形式。对整数来说，返回结果相同。对于无法用 64 个二进制位精确表示的小数，`Math.fround` 方法会返回最接近这个小数的单精度浮点数。

### Math.hypot()

返回所有参数的平方和的平方根。

### 对数的方法

#### Math.expm1()

`Math.expm1(x)` 返回 e^x - 1，即 `Math.exp(x) - 1`。

#### Math.log1p()

`Math.log1p(x)` 方法返回 `1 + x` 的自然对数，即 `Math.log(1 + x)`。如果 `x` 小于 -1，返回 `NaN`。

#### Math.log10()

`Math.log10(x)` 返回以 10 为底的 `x` 的对数。如果 `x` 小于 0，则返回 NaN。

#### Math.log2()

`Math.log10(x)` 返回以 2 为底的 `x` 的对数。如果 `x` 小于 0，则返回 NaN。

### 三角函数的方法

- `Math.sinh(x)` 返回 `x` 的双曲正弦
- `Math.cosh(x)` 返回 `x` 的双曲余弦
- `Math.tanh(x)` 返回 `x` 的双曲正切
- `Math.asinh(x)` 返回 `x` 的反双曲正弦
- `Math.acosh(x)` 返回 `x` 的反双曲余弦
- `Math.atanh(x)` 返回 `x` 的反双曲正切

## 指数运算符

ES2016 新增了一个指数运算符 `**` 。可以与等号结合，形成一个新的赋值运算符 `**=` 。

```javascript
let a = 2; a **= 3 // a = a * a * a
```

与 `Math.pow` 的实现不同，对于特别大的运算结果，两者会有细微的差异。

# 数组的扩展

## Array.from()

用于将两类对象转为真正的数组：类似数组的对象和可遍历的对象（包括 ES6 新增的数据结构 Set 和 Map）

```javascript
let arrayLike = { '0': 'a', '1': 'b', '2': 'c', length: 3};
let arr = Array.from(arrayLike); // ['a', 'b', 'c']
```

实际应用中，常见的类似数组的对象是 DOM 操作返回的 NodeList 集合，以及函数内部的 `arguments` 对象。`Array.from` 都可以将他们转为真正的数组。

`querySelectorAll` 方法返回一个类似数组的对象，只有转换为真正的数组，才能使用 `forEach` 方法。只要是部署了 `Iterator` 接口的数据结构，`Array.from` 都能将其转为数组。

扩展运算符 `…` 也可以将某些数据结构转为数组。扩展运算符背后调用的是遍历器接口（`Symbol.iteratro` ），如果一个对象未部署这个接口，就无法转换。

```javascript
function foo() { var args = [...arguments]; } // arguments对象
[...document.querySelectorAll('div')] // NodeList对象
```

类似数组的对象，本质特征只有一点，必须有 `length` 属性。因此，任何有 `length` 属性的对象都可以通过 `Array.from` 方法转为数组，而扩展运算符就无法转换。

```javascript
Array.from({ length: 3 }); // [ undefined, undefined, undefined ]
```

`Array.from` 还可以接受第二个参数，作用类似于数组的 `map` 方法，用来对每个元素进行处理，结果放回数组。

```javascript
Array.from([1, 2, 3], (x) => x * x) // [1, 4, 9]
function typeOf() { return Array.from(arguments, value => typeof value) }
typeOf(null, [], NaN) // ['object', 'object', 'number']
Array.from({ length: 2 }, () => 'jack') // ['jack', 'jack']
```

## Array.of()

用于将一组值，转换为数组。主要用于弥补构造函数 `Array()` 的不足。

```javascript
Array.of(3, 11, 8) // [3, 11, 8]
Array.of(3) // [3]
Array(3, 11, 8) // [3, 11, 8]
Array(3) // [, , ,]
```

`Array.of` 基本上可以用来替代 `Array()` 或 `new Array()` 。总是返回参数值组成的数组。如果没有参数，就返回一个空数组。

## 数组实例的 copyWithin()

在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。使用这个方法，会修改当前数组。

```javascript
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

接受三个参数，都应该是数值，不是则转为数值。

- target（必需）从该位置开始替换数据
- start（可选）从该位置开始读取数据，默认为0。如果为负值，表示倒数。
- end（可选）到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]
```

## 数组实例的 find() 和 findIndex()

### find()

找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 `true` 的成员，然后返回该成员。如果没有符合的成员，则返回 `undefined` 。

```javascript
[1, 4, -5, 10].find((n) => n < 0) // -5
```

`find` 方法的回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

```javascript
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
```

### findIndex()

与 `find` 类似，返回第一个符合条件的数组成员的位置，如果都不符合条件则返回 `-1` 。

```javascript
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```

这两个方法都可以接受第二个参数，用来绑定回调函数的 `this` 对象。另外，这两个方法都可以发现 `NaN` 。

## 数组实例的 fill()

使用给定值，填充一个数组。用于空数组的初始化非常方便。还可以接受第二个和第三个参数，用于指定填充的起始位置和结束为止。

```javascript
['a', 'b', 'c'].fill(7) // [7, 7, 7]
['a', 'b', 'c'].fill(7, 1, 2) // ['a', 7, 'c']
```

## 数组实例的 entries(), keys() 和 values()

用于遍历数组。他们都返回一个遍历器对象，可以用 `for … of` 循环进行遍历，唯一区别是 `keys()` 是对键名的遍历、`values()` 是对键值的遍历，`entries()` 是对键值对的遍历。

```javascript
for (let index of ['a', 'b'].keys()) { console.log(index); } // 0  1
for (let elem of ['a', 'b'].values()) { console.log(elem); } // 'a'  'b'
for (let [index, elem] of ['a', 'b'].entries()) { console.log(index, elem); }
```

如果不使用 `for … of` 循环，可以手动调用遍历器对象的 `next` 方法，进行遍历。

```javascript
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
```

## 数组实例的 includes()

`Array.prototype.includes` 方法返回一个布尔值，表示某数组是否包含给定的值，与字符串的 `includes` 方法类似。该方法属于 ES7，但 Babel 转码器已经支持。

该方法的第二个参数表示搜索的起始位置，默认为 0。如果为负，则倒数。如果大于数组长度，则会重置为从 0 开始。

```javascript
[1, 2, 3].includes(2); // true
[1, 2, NaN].includes(NaN); // true
[1, 2, 3].includes(3, 3); // false
[1, 2, 3].includes(3, -1); // true
```

`indexOf` 方法有两个缺点，一是不够语义化，二是内部使用严格相当运算符 `===` ，会导致 `NaN` 的误判。另外，Map 和 Set 数据结构有一个 `has` 方法，需要注意与 `includes` 区分。

- Map 结构的 `has` 方法，用来查找键名
- Set 结构的 `has` 方法，用来查找值

## 数组的空位

数组的空位指，数组的某一位没有任何值。比如，`Array` 构造函数返回的数组都是空位。

```javascript
Array(3) // [, , ,]
0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
```

注意，空位不是 `undefined`，一个位置的值等于 `undefined`，依然是有值的。空位是没有任何值的。ES5 对空位的处理很不一致，大多数情况会忽略空位。

- `forEach()`，`filter()`，`every()` 和 `some()` 都会跳过空位
- `map()` 会跳过空位，但会保留这个值
- `join()` 和 `toString()` 会将空位视为 `undefined`，而 `undefined` 和 `null` 会被处理成空字符串

ES6这是明确将空位转为 `undefined`。

- `Array.from`，`entries()`，`keys()`，`values()`，`find()`，`findIndex()` 和 `…` 会将空位转为 `undefined`
- `copyWithin()` 会连空位一起拷贝
- `fill()` 会将空位视为正常的数组位置
- `for .. of` 循环也会遍历空位

由于空位的处理规则非常不统一，所以建议避免出现空位。





















