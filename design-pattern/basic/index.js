/*Function.prototype.bind = function() {
    var self = this,
        context = [].shift.call(arguments),
        args = [].slice.call(arguments);
    return function() {
        return self.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
};

var obj = {
    name: 'zero'
};

var func = function(a, b, c, d) {
    console.log(this.name);
    console.log([a, b, c, d])
}.bind(obj, 1, 2);

func(3, 4);

console.log([].slice.call([1, 2, 3]));*/

/*var A = function(name) {
    this.name = name;
};

var B = function() {
    A.apply(this, arguments);
};

B.prototype.getName = function() {
    return this.name;
}

var b = new B('zero');
console.log(b.getName());*/

/*a = {};
Array.prototype.push.call(a, 1, 2, 3);
console.log(a);*/

/*var func = function() {
    var a = 1;
    console.log(a);
}

func();
console.log(a);*/

/*var a = 1;

var func1 = function() {
    var func2 = function() {
        var c = 3;
        console.log(b);
        console.log(a);
    }
    func2();
    var b = 2;
    // console.log(c);
}
func1();*/

/*funcs1 = [];
for (i = 0; i < 5; i++) {
    funcs1[i] = function() {
        return i;
        // console.log(i);
    }
}
console.log(funcs1[3]());

funcs2 = [];
for (i = 0; i < 5; i++) {
    (function(i) {
        funcs2[i] = function() {
            // console.log(i);
            return i;
        }
    })(i);
}
console.log(funcs2[3]());

funcs3 = [];
for (let i = 0; i < 5; i++) {
    funcs3[i] = function() {
        return i;
    }
}
console.log(funcs3[2]());*/

/*var cache = {};

var mult = function() {

    var args = Array.prototype.join.call(arguments, ',');
    if (cache[args]) {
        return cache[args];
    }
    var a = 1;
    for (var i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return cache[args] = a;
};*/

/*var mult = (function() {
    var cache = {};
    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        var a = 1;
        for (var i = 0, l = arguments.length; i < l; i++) {
            a = a * arguments[i];
        }
        return cache[args] = a;
    }
})();

console.log(mult(2, 3, 4));*/

/*var mult = (function() {
    var cache = {};
    var calculate = function() {
        var a = 1;
        for (var i = 0, l = arguments.length; i < l; i++) {
            a = a * arguments[i];
        }
        return a;
    };

    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        // arguments 是一个数组，使用 apply 将数组形式的参数传入 calculate
        return cache[args] = calculate.apply(null, arguments);
    }
})();
console.log(mult(2, 3, 4))*/

/*var extent = function() {
    var value = 0;
    return {
        call: function() {
            value++;
            console.log(value)
        }
    }
};
var extent = extent();
extent.call();
extent.call();
extent.call();

var extent = {
    value: 0,
    call: function() {
        this.value++;
        console.log(this.value);
    }
};
extent.call();
extent.call();
extent.call();

var Extent = function() {
    this.value = 0;
}
Extent.prototype.call = function() {
    this.value++;
    console.log(this.value);
}
var extent = new Extent();
extent.call();
extent.call();
extent.call();*/

/*var getSingle = function(fn) {
    var ret;
    return function() {
        return ret || (ret = fn.apply(this, arguments));
    };
};

var getScript = getSingle(function(i, j) {
    return i;
});

var script1 = getScript(2);
var script2 = getScript(3);

console.log(script1 === script2)
console.log(script1, script2)*/

/*Function.prototype.before = function(beforefn) {
    var __self = this;

    return function() {
        beforefn.apply(this, arguments);
        return __self.apply(this, arguments);
    }
};

Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        var ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};

var func = function() {
    console.log(2);
};

func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
});

var func2 = function() {
    console.log(2);
};

func2 = func2.before(function() {
    console.log(3);
}).after(function() {
    console.log(1);
})

var func3 = function() {
    console.log(4);
}

func();
func2();
func();
func3();*/

/*// currying
var cost = (function() {
    var args = [];

    return function() {
        if (arguments.length === 0) {
            var money = 0;
            for (var i = 0, l = args.length; i < l; i++) {
                money += args[i];
            }
            return money;
        } else {
            [].push.apply(args, arguments);
        }
    }
})();

cost(100, 300);
cost(200);
console.log(cost());*/

/*var currying = function(fn) {
    var args = [];
    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee; // 返回当前被调用的函数
        }
    }
};

var cost = (function() {
    var money = 0;
    return function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }
        return money;
    }
})();

var cost = currying(cost);

cost(100);
cost(200, 300)(400);
console.log(cost());*/

/*Function.prototype.uncurrying = function() {
    var self = this;
    return function() {
        var obj = Array.prototype.shift.call(arguments);
        return self.apply(obj, arguments);
    };
};

var push = Array.prototype.push.uncurrying();

(function() {
    push(arguments, 4);
    console.log(arguments);
})(1, 2, 3);*/

/*Function.prototype.uncurrying = function() {
    var self = this;
    return function() {
        return Function.prototype.call.apply(self, arguments);
    };
};
var push = Array.prototype.push.uncurrying();
var a = {};
push(a, 1, 2, 3);
console.log(a);*/

/*var startTime = new Date();
startTime = startTime.getTime();

var throttle = function(fn, interval) {
    var __self = fn,
        timer,
        firstTime = true;

    return function() {
        var args = arguments,
            __me = this;

        if (firstTime) {
            __self.apply(__me, args);
            return firstTime = false;
        }

        if (timer) {
            return false;
        }

        timer = setTimeout(function() {
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
    };
};

// var throttle2 = function(fn, interval) {
//     var __self = fn,
//         timer,
//         firstTime = true;
//     return function() {
//         var args = arguments,
//             __me = this;

//         if (firstTime) {
//             __self.apply(__me, args);
//             timer = setTimeout(function() {
//                 clearTimeout(timer);
//                 timer = null;
//                 firstTime = true
//             }, interval || 500);
//             return firstTime = false;
//         } else {
//             return false;
//         }
//     }
// }

var tfn = throttle(function() {
    console.log('run');
    var time = new Date();
    console.log(time.getTime() - startTime);
});
setTimeout(tfn, 0);
setTimeout(tfn, 20);
setTimeout(tfn, 1000); // 除第一次执行，其余在调用时都会有延迟
setTimeout(tfn, 2000);*/

/*var timeChunk = function(ary, fn, count) {
    var obj, t;
    var len = ary.length;
    var start = function() {
        for (var i = 0; i < Math.min(count || 1, arr.length); i++) {
            var obj = ary.shift();
            fn(obj);
        }
    };

    return function() {
        t = setInterval(function() {
            if (ary.length === 0) {
                return clearInterval(t);
            }
            start();
        }, 200);
    };
};*/

/*var addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        return elem.addEventListener(type, handler, false);
    }
    if (window.attachEvent) {
        return elem.attachEvent('on' + type, handler);
    }
}

var addEvent = (function() {
    if (window.addEventListener) {
        return function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    }
    if (window.attachEvent) {
        return function(elem, type, handler) {
            elem.attachEvent('on' + type, handler)
        }
    }
})();

var addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    } else if (window.attachEvent) {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        }
    }

    addEvent(elem, type, handler);
}*/