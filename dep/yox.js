(function (global, factory) {
    (global.Yox = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * 为了压缩，定义的常量
 */
var TRUE = true;
var FALSE = false;
var NULL = null;
var UNDEFINED = undefined;

var RAW_TRUE = 'true';
var RAW_FALSE = 'false';
var RAW_NULL = 'null';
var RAW_UNDEFINED = 'undefined';

var RAW_THIS = 'this';
var RAW_LENGTH = 'length';
var RAW_CHILDREN = 'children';
var RAW_FUNCTION = 'function';

var KEYPATH_SEPARATOR = '.';

var KEYPATH_PUBLIC_PARENT = '..';
var KEYPATH_PRIVATE_PARENT = '$parent';

var KEYPATH_PUBLIC_CURRENT = RAW_THIS;
var KEYPATH_PRIVATE_CURRENT = '$this';

/**
 * 浏览器环境下的 window 对象
 *
 * @type {?Window}
 */
var win = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== RAW_UNDEFINED ? window : NULL;

/**
 * 浏览器环境下的 document 对象
 *
 * @type {?Document}
 */
var doc = (typeof document === 'undefined' ? 'undefined' : _typeof(document)) !== RAW_UNDEFINED ? document : NULL;

/**
 * 空函数
 *
 * @type {Function}
 */
function noop() {
  /** yox */
}

var isDef = function (target) {
  return target !== UNDEFINED;
};

function is(value, type) {
  return type === 'numeric' ? numeric(value)
  // 这个函数比较慢，所以下面都不用它
  : Object.prototype.toString.call(value).toLowerCase() === '[object ' + type + ']';
}

function func(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === RAW_FUNCTION;
}

function array(value) {
  return value && Array.isArray(value);
}

function object(value) {
  // 低版本 IE 会把 null 和 undefined 当作 object
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

function string(value) {
  return typeof value === 'string';
}

function number(value) {
  return typeof value === 'number';
}

function boolean(value) {
  return typeof value === 'boolean';
}

function numeric(value) {
  return number(value) || string(value) && !isNaN(parseFloat(value)) && isFinite(value);
}

function primitive(value) {
  return string(value) || number(value) || boolean(value) || value == NULL;
}



var is$1 = Object.freeze({
    is: is,
    func: func,
    array: array,
    object: object,
    string: string,
    number: number,
    boolean: boolean,
    numeric: numeric,
    primitive: primitive
});

/**
 * 任性地执行一个函数，不管它有没有、是不是
 *
 * @param {?Function} fn 调用的函数
 * @param {*} context 执行函数时的 this 指向
 * @param {*} args 调用函数的参数，多参数时传入数组
 * @return {*} 调用函数的返回值
 */
var execute = function (fn, context, args) {
  if (func(fn)) {
    return array(args) ? fn.apply(context, args) : fn.call(context, args);
  }
};

var Event = function () {
  function Event(event) {
    classCallCheck(this, Event);

    if (event.type) {
      this.type = event.type;
      this.originalEvent = event;
    } else {
      this.type = event;
    }
  }

  Event.prototype.prevent = function prevent() {
    var instance = this;
    if (!instance.isPrevented) {
      var originalEvent = instance.originalEvent;

      if (originalEvent) {
        if (func(originalEvent.prevent)) {
          originalEvent.prevent();
        } else if (func(originalEvent.preventDefault)) {
          originalEvent.preventDefault();
        }
      }
      instance.isPrevented = TRUE;
    }
    return instance;
  };

  Event.prototype.stop = function stop() {
    var instance = this;
    if (!instance.isStoped) {
      var originalEvent = instance.originalEvent;

      if (originalEvent) {
        if (func(originalEvent.stop)) {
          originalEvent.stop();
        } else if (func(originalEvent.stopPropagation)) {
          originalEvent.stopPropagation();
        }
      }
      instance.isStoped = TRUE;
    }
    return instance;
  };

  return Event;
}();

Event.is = function (target) {
  return target instanceof Event;
};

/**
 * 为了压缩，定义的常用字符
 */

function charAt(str, index) {
  return str.charAt(index || 0);
}

function codeAt(str, index) {
  return str.charCodeAt(index || 0);
}

var CHAR_BLANK = '';

var CHAR_DOT = '.';
var CODE_DOT = codeAt(CHAR_DOT);

var CHAR_HASH = '#';
var CODE_HASH = codeAt(CHAR_HASH);

var CHAR_DASH = '-';
var CODE_DASH = codeAt(CHAR_DASH);

var CHAR_EQUAL = '=';
var CODE_EQUAL = codeAt(CHAR_EQUAL);

var CHAR_SLASH = '/';
var CODE_SLASH = codeAt(CHAR_SLASH);

var CHAR_COMMA = ',';
var CODE_COMMA = codeAt(CHAR_COMMA);

var CHAR_COLON = ':';
var CODE_COLON = codeAt(CHAR_COLON);

var CHAR_SEMCOL = ';';
var CODE_SEMCOL = codeAt(CHAR_SEMCOL);

var CHAR_SQUOTE = "'";
var CODE_SQUOTE = codeAt(CHAR_SQUOTE);

var CHAR_DQUOTE = '"';
var CODE_DQUOTE = codeAt(CHAR_DQUOTE);

var CHAR_OPAREN = '(';
var CODE_OPAREN = codeAt(CHAR_OPAREN);

var CHAR_CPAREN = ')';
var CODE_CPAREN = codeAt(CHAR_CPAREN);

var CHAR_OBRACK = '[';
var CODE_OBRACK = codeAt(CHAR_OBRACK);

var CHAR_CBRACK = ']';
var CODE_CBRACK = codeAt(CHAR_CBRACK);

var CHAR_OBRACE = '{';
var CODE_OBRACE = codeAt(CHAR_OBRACE);

var CHAR_CBRACE = '}';
var CODE_CBRACE = codeAt(CHAR_CBRACE);

var CHAR_LEFT = '<';
var CODE_LEFT = codeAt(CHAR_LEFT);

var CHAR_RIGHT = '>';
var CODE_RIGHT = codeAt(CHAR_RIGHT);

var CHAR_QUMARK = '?';
var CODE_QUMARK = codeAt(CHAR_QUMARK);

var CHAR_TAB = '\t';
var CODE_TAB = codeAt(CHAR_TAB);

var CHAR_BREAKLINE = '\n';
var CODE_BREAKLINE = codeAt(CHAR_BREAKLINE);

var CHAR_WHITESPACE = ' ';
var CODE_WHITESPACE = codeAt(CHAR_WHITESPACE);

/**
 * 遍历数组
 *
 * @param {Array} array
 * @param {Function} callback 返回 false 可停止遍历
 * @param {?boolean} reversed 是否逆序遍历
 */
function each(array$$1, callback, reversed) {
  var length = array$$1[RAW_LENGTH];
  if (length) {
    if (reversed) {
      for (var i = length - 1; i >= 0; i--) {
        if (callback(array$$1[i], i) === FALSE) {
          break;
        }
      }
    } else {
      for (var _i = 0; _i < length; _i++) {
        if (callback(array$$1[_i], _i) === FALSE) {
          break;
        }
      }
    }
  }
}

/**
 * 把数组合并成字符串
 *
 * @param {Array} array
 * @param {string} separator
 * @return {string}
 */
function join(array$$1, separator) {
  return array$$1.join(separator);
}

function nativePush(array$$1, item) {
  array$$1[array$$1[RAW_LENGTH]] = item;
}

function nativeUnshift(array$$1, item) {
  array$$1.unshift(item);
}

/**
 * 添加
 *
 * @param {Array} array
 * @param {*} value
 * @param {Function} action
 */
function addItem(array$$1, value, action) {
  if (array(value)) {
    each(value, function (item) {
      action(array$$1, item);
    });
  } else {
    action(array$$1, value);
  }
}

/**
 * 往后加
 *
 * @param {Array} array
 * @param {*} item
 */
function push(array$$1, item) {
  addItem(array$$1, item, nativePush);
}

/**
 * 往前加
 *
 * @param {Array} array
 * @param {*} item
 */
function unshift(array$$1, item) {
  addItem(array$$1, item, nativeUnshift);
}

/**
 * 把类数组转成数组
 *
 * @param {Array|ArrayLike} array 类数组
 * @return {Array}
 */
function toArray$1(array$$1) {
  return array(array$$1) ? array$$1 : execute([].slice, array$$1);
}

/**
 * 把数组转成对象
 *
 * @param {Array} array 数组
 * @param {?string} key 数组项包含的字段名称，如果数组项是基本类型，可不传
 * @param {?*} value
 * @return {Object}
 */
function toObject(array$$1, key, value) {
  var result = {},
      hasValue = arguments[RAW_LENGTH] === 3;
  each(array$$1, function (item, index) {
    result[key ? item[key] : item] = hasValue ? value : item;
  });
  return result;
}

/**
 * 数组项在数组中的位置
 *
 * @param {Array} array 数组
 * @param {*} item 数组项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {number} 如果未找到，返回 -1
 */
function indexOf(array$$1, item, strict) {
  if (strict !== FALSE) {
    return array$$1.indexOf(item);
  } else {
    for (var i = 0, len = array$$1[RAW_LENGTH]; i < len; i++) {
      if (array$$1[i] == item) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * 数组是否包含 item
 *
 * @param {Array} array 数组
 * @param {*} item 可能包含的数组项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {boolean}
 */
function has(array$$1, item, strict) {
  return indexOf(array$$1, item, strict) >= 0;
}

/**
 * 获取数组最后一项
 *
 * @param {Array} array 数组
 * @return {*}
 */
function last(array$$1) {
  return array$$1[array$$1[RAW_LENGTH] - 1];
}

/**
 * 弹出数组最后一项
 *
 * 项目里用的太多，仅用于节省字符...
 *
 * @param {Array} array 数组
 * @return {*}
 */
function pop(array$$1) {
  return array$$1.pop();
}

/**
 * 删除数组项
 *
 * @param {Array} array 数组
 * @param {*} item 待删除项
 * @param {?boolean} strict 是否全等判断，默认是全等
 * @return {number} 删除的数量
 */
function remove(array$$1, item, strict) {
  var result = 0;
  each(array$$1, function (value, index) {
    if (strict === FALSE ? value == item : value === item) {
      array$$1.splice(index, 1);
      result++;
    }
  }, TRUE);
  return result;
}

/**
 * 用于判断长度大于 0 的数组
 *
 * @param {*} array
 * @return {boolean}
 */
function falsy(array$$1) {
  return !array(array$$1) || array$$1[RAW_LENGTH] === 0;
}

var array$1 = Object.freeze({
    each: each,
    join: join,
    push: push,
    unshift: unshift,
    toArray: toArray$1,
    toObject: toObject,
    indexOf: indexOf,
    has: has,
    last: last,
    pop: pop,
    remove: remove,
    falsy: falsy
});

/**
 * 连字符转成驼峰
 *
 * @param {string} str
 * @return {string}
 */
function camelCase(str) {
  if (has$2(str, CHAR_DASH)) {
    return str.replace(/-([a-z])/gi, function ($0, $1) {
      return $1.toUpperCase();
    });
  }
  return str;
}

/**
 * 删除两侧空白符
 *
 * @param {*} str
 * @return {string}
 */
function trim(str) {
  return falsy$1(str) ? CHAR_BLANK : str.trim();
}

/**
 * 截取字符串
 *
 * @param {string} str
 * @param {number} start
 * @param {?number} end
 * @return {string}
 */
function slice(str, start, end) {
  return number(end) ? str.slice(start, end) : str.slice(start);
}

/**
 * 获取子串的起始位置
 *
 * @param {string} str
 * @param {string} part
 * @param {?number} startIndex
 * @return {number}
 */
function indexOf$1(str, part, startIndex) {
  return number(startIndex) ? str.indexOf(part, startIndex) : str.indexOf(part);
}

/**
 * 获取子串的起始位置
 *
 * @param {string} str
 * @param {string} part
 * @param {?number} endIndex
 * @return {number}
 */
function lastIndexOf(str, part, endIndex) {
  return number(endIndex) ? str.lastIndexOf(part, endIndex) : str.lastIndexOf(part);
}

/**
 * str 是否包含 part
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
function has$2(str, part) {
  return indexOf$1(str, part) >= 0;
}

/**
 * str 是否以 part 开始
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
function startsWith(str, part) {
  return indexOf$1(str, part) === 0;
}

/**
 * str 是否以 part 结束
 *
 * @param {string} str
 * @param {string} part
 * @return {boolean}
 */
function endsWith(str, part) {
  var offset = str[RAW_LENGTH] - part[RAW_LENGTH];
  return offset >= 0 && lastIndexOf(str, part) === offset;
}

/**
 * 判断长度大于 0 的字符串
 *
 * @param {*} str
 * @return {boolean}
 */
function falsy$1(str) {
  return !string(str) || str === CHAR_BLANK;
}

var string$1 = Object.freeze({
    camelCase: camelCase,
    trim: trim,
    slice: slice,
    indexOf: indexOf$1,
    lastIndexOf: lastIndexOf,
    has: has$2,
    startsWith: startsWith,
    endsWith: endsWith,
    falsy: falsy$1
});

var normalizeCache = {};

function normalize(str) {
  if (!falsy$1(str)) {
    var start = indexOf$1(str, CHAR_OBRACK);
    if (start > 0 && indexOf$1(str, CHAR_CBRACK) > start) {
      if (!normalizeCache[str]) {
        normalizeCache[str] = str.replace(/\[\s*?([^\]]+)\s*?\]/g, function ($0, $1) {
          var code = codeAt($1);
          if (code === CODE_SQUOTE || code === CODE_DQUOTE) {
            $1 = slice($1, 1, -1);
          }
          return KEYPATH_SEPARATOR + $1;
        });
      }
      return normalizeCache[str];
    }
  }
  return str;
}

function startsWith$1(keypath, prefix) {
  var temp = void 0;
  if (keypath === prefix) {
    return prefix[RAW_LENGTH];
  } else if (startsWith(keypath, temp = prefix + KEYPATH_SEPARATOR)) {
    return temp[RAW_LENGTH];
  } else {
    return FALSE;
  }
}

function each$2(keypath, callback) {
  if (falsy$1(keypath)) {
    callback(keypath, TRUE);
  } else {
    var startIndex = 0,
        endIndex = 0;
    while (TRUE) {
      endIndex = indexOf$1(keypath, KEYPATH_SEPARATOR, startIndex);
      if (endIndex > 0) {
        callback(slice(keypath, startIndex, endIndex));
        startIndex = endIndex + 1;
      } else {
        callback(slice(keypath, startIndex), TRUE);
        break;
      }
    }
  }
}

function join$1(keypath1, keypath2) {

  var keypath = number(keypath1) || string(keypath1) ? keypath1 : CHAR_BLANK;

  var isNumber = void 0,
      isString = void 0;

  if ((isNumber = number(keypath2)) || (isString = string(keypath2))) {
    if (keypath === CHAR_BLANK) {
      return keypath2;
    }
    if (isNumber || keypath2 !== CHAR_BLANK) {
      return keypath + KEYPATH_SEPARATOR + keypath2;
    }
  }

  return keypath;
}

/**
 * 获取对象的 key 的数组
 *
 * @param {Object} object
 * @return {Array}
 */
function keys(object$$1) {
  return Object.keys(object$$1);
}

function sortByAsc(a, b) {
  return a[RAW_LENGTH] - b[RAW_LENGTH];
}

function sortByDesc(a, b) {
  return b[RAW_LENGTH] - a[RAW_LENGTH];
}

/**
 * 排序对象的 key
 *
 * @param {Object} object
 * @param {Object} desc 是否逆序，默认从小到大排序
 * @return {Array.<string>}
 */
function sort(object$$1, desc) {
  return keys(object$$1).sort(desc ? sortByDesc : sortByAsc);
}

/**
 * 遍历对象
 *
 * @param {Object} object
 * @param {Function} callback 返回 false 可停止遍历
 */
function each$1(object$$1, callback) {
  each(keys(object$$1), function (key) {
    return callback(object$$1[key], key);
  });
}

/**
 * 对象是否包含某个 key
 *
 * @param {Object} object
 * @param {string} key
 * @return {boolean}
 */
function has$1(object$$1, key) {
  return object$$1.hasOwnProperty(key);
}

/**
 * 清空对象所有的值
 *
 * @param {Object} object
 */
function clear(object$$1) {
  each$1(object$$1, function (value, key) {
    delete object$$1[key];
  });
}

/**
 * 扩展对象
 *
 * @return {Object}
 */
function extend(original, object1, object2, object3) {
  // 尽量不用 arguments
  // 提供三个扩展对象足够了吧...
  each([object1, object2, object3], function (object$$1) {
    if (object(object$$1)) {
      each$1(object$$1, function (value, key) {
        original[key] = value;
      });
    }
  });
  return original;
}

/**
 * 拷贝对象
 *
 * @param {*} object
 * @param {?boolean} deep 是否需要深拷贝
 * @return {*}
 */
function copy(object$$1, deep) {
  var result = object$$1;
  if (array(object$$1)) {
    if (deep) {
      result = [];
      each(object$$1, function (item, index) {
        result[index] = copy(item, deep);
      });
    } else {
      result = object$$1.slice();
    }
  } else if (object(object$$1)) {
    result = {};
    each$1(object$$1, function (value, key) {
      result[key] = deep ? copy(value, deep) : value;
    });
  }
  return result;
}

function getValue(object$$1, key) {
  if (object$$1 != NULL && has$1(object$$1, key)) {
    var value = object$$1[key];
    if (object(value) && value.get) {
      value = value.get();
    }
    return {
      value: value
    };
  }
}

/**
 * 从对象中查找一个 keypath
 *
 * 返回值是对象时，表示找了值
 * 返回值是空时，表示没找到值
 *
 * @param {Object} object
 * @param {string|number} keypath
 * @return {?Object}
 */
function get$1(object$$1, keypath) {

  if (has$1(object$$1, keypath)) {
    return getValue(object$$1, keypath);
  }

  each$2(keypath, function (key, isLast) {
    object$$1 = getValue(object$$1, key);
    if (!isLast) {
      if (object$$1) {
        object$$1 = object$$1.value;
      } else {
        return FALSE;
      }
    }
  });

  return object$$1;
}

/**
 * 为对象设置一个键值对
 *
 * @param {Object} object
 * @param {string|number} keypath
 * @param {*} value
 * @param {?boolean} autofill 是否自动填充不存在的对象，默认自动填充
 */
function set$1(object$$1, keypath, value, autofill) {
  each$2(keypath, function (key, isLast) {
    if (isLast) {
      object$$1[key] = value;
    } else {
      if (object$$1[key]) {
        object$$1 = object$$1[key];
      } else if (autofill !== FALSE) {
        object$$1 = object$$1[key] = {};
      } else {
        return FALSE;
      }
    }
  });
}

var object$1 = Object.freeze({
    keys: keys,
    sort: sort,
    each: each$1,
    has: has$1,
    clear: clear,
    extend: extend,
    copy: copy,
    get: get$1,
    set: set$1
});

var Emitter = function () {

  /**
   *
   * @param {boolean} namespace 是否需要命名空间
   */
  function Emitter(namespace) {
    classCallCheck(this, Emitter);

    this.namespace = namespace;
    this.listeners = {};
  }

  Emitter.prototype.fire = function fire(type, data, context) {

    var instance = this;
    var namespace = instance.namespace,
        listeners = instance.listeners;

    var _parseType = parseType(type, namespace),
        name = _parseType.name,
        space = _parseType.space;

    var isComplete = TRUE,
        list = listeners[name];
    if (list) {

      var event = array(data) ? data[0] : data,
          isEvent = Event.is(event);

      each(copy(list), function (item) {

        var index = indexOf(list, item);

        // 在 fire 过程中被移除了
        if (index < 0 || space && item.space && space !== item.space) {
          return;
        }

        // 为 event 对象加上当前正在处理的 listener
        // 这样方便业务层移除事件绑定
        // 比如 on('xx', function) 这样定义了匿名 listener
        // 在这个 listener 里面获取不到当前 listener 的引用
        // 为了能引用到，有时候会先定义 var listener = function,
        // 然后再 on('xx', listener) 这样其实是没有必要的
        if (isEvent) {
          event.listener = item.func;
        }

        var result = execute(item.func, isDef(context) ? context : item.context, data);

        // 执行次数
        if (item.count > 0) {
          item.count++;
        } else {
          item.count = 1;
        }

        // 注册的 listener 可以指定最大执行次数
        if (item.count === item.max) {
          instance.off(name, item);
        }

        // 如果没有返回 false，而是调用了 event.stop 也算是返回 false
        if (isEvent) {
          if (result === FALSE) {
            event.prevent().stop();
          } else if (event.isStoped) {
            result = FALSE;
          }
        }

        if (result === FALSE) {
          return isComplete = FALSE;
        }
      });
    }

    return isComplete;
  };

  Emitter.prototype.has = function has$$1(type, listener) {
    var namespace = this.namespace,
        listeners = this.listeners,
        _parseType2 = parseType(type, namespace),
        name = _parseType2.name,
        space = _parseType2.space,
        result = TRUE;

    var each$$1 = function each$$1(list) {
      each(list, function (item, index) {
        if ((!space || space === item.space) && (!listener || listener === item.func)) {
          return result = FALSE;
        }
      });
      return result;
    };

    if (name) {
      var list = listeners[name];
      if (list) {
        each$$1(list);
      }
    } else if (space) {
      each$1(listeners, each$$1);
    }

    return !result;
  };

  return Emitter;
}();

extend(Emitter.prototype, {
  on: on(),
  once: on({ max: 1 }),
  off: function off(type, listener) {

    var instance = this,
        listeners = instance.listeners;

    if (type) {
      var _parseType3 = parseType(type, instance.namespace),
          name = _parseType3.name,
          space = _parseType3.space;

      var each$$1 = function each$$1(list, name) {
        if (object(listener)) {
          var index = indexOf(list, listener);
          if (index >= 0) {
            list.splice(index, 1);
          }
        } else {
          each(list, function (item, index) {
            if ((!space || space === item.space) && (!listener || listener === item.func)) {
              list.splice(index, 1);
            }
          }, TRUE);
        }
        if (!list[RAW_LENGTH]) {
          delete listeners[name];
        }
      };

      if (name) {
        if (listeners[name]) {
          each$$1(listeners[name], name);
        }
      } else if (space) {
        each$1(listeners, each$$1);
      }
    } else {
      // 清空
      instance.listeners = {};
    }
  }
});

function on(data) {
  return function (type, listener) {
    var namespace = this.namespace,
        listeners = this.listeners;


    var addListener = function addListener(item, type) {
      if (func(item)) {
        item = { func: item };
      }
      if (object(item) && func(item.func)) {
        if (data) {
          extend(item, data);
        }

        var _parseType4 = parseType(type, namespace),
            name = _parseType4.name,
            space = _parseType4.space;

        item.space = space;
        push(listeners[name] || (listeners[name] = []), item);
      }
    };

    if (object(type)) {
      each$1(type, addListener);
    } else if (string(type)) {
      addListener(listener, type);
    }
  };
}

function parseType(type, namespace) {
  var result = {
    name: type,
    space: CHAR_BLANK
  };
  if (namespace) {
    var index = indexOf$1(type, CHAR_DOT);
    if (index >= 0) {
      result.name = slice(type, 0, index);
      result.space = slice(type, index + 1);
    }
  }
  return result;
}

var toString = function (str, defaultValue) {
  if (str != NULL && str.toString) {
    return str.toString();
  }
  return arguments[RAW_LENGTH] === 1 ? CHAR_BLANK : defaultValue;
};

/**
 * 是否有原生的日志特性，没有必要单独实现
 *
 * @type {?Object}
 */
var Console = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== RAW_UNDEFINED ? console : NULL;

var debug = /yox/.test(toString(noop));

// 全局可覆盖
// 比如开发环境，开了 debug 模式，但是有时候觉得看着一堆日志特烦，想强制关掉
// 比如线上环境，关了 debug 模式，为了调试，想强制打开
function isDebug() {
  if (win) {
    var DEBUG = win.DEBUG;

    if (boolean(DEBUG)) {
      return DEBUG;
    }
  }
  return debug;
}

/**
 * 打印普通日志
 *
 * @param {string} msg
 */
function log(msg) {
  if (Console && isDebug()) {
    Console.log('[Yox log]: ' + msg);
  }
}

/**
 * 打印警告日志
 *
 * @param {string} msg
 */
function warn(msg) {
  if (Console && isDebug()) {
    Console.warn('[Yox warn]: ' + msg);
  }
}

/**
 * 打印错误日志
 *
 * @param {string} msg
 */
function error$1(msg) {
  if (Console) {
    Console.error('[Yox error]: ' + msg);
  }
}

/**
 * 致命错误，中断程序
 *
 * @param {string} msg
 */
function fatal(msg) {
  throw new Error('[Yox fatal]: ' + msg);
}



var logger = Object.freeze({
    log: log,
    warn: warn,
    error: error$1,
    fatal: fatal
});

var isNative = function (fn) {
  if (func(fn)) {
    return has$2(fn.toString(), '[native code]');
  }
};

var nextTick = void 0;

if ((typeof setImmediate === 'undefined' ? 'undefined' : _typeof(setImmediate)) === RAW_FUNCTION) {
  nextTick = setImmediate;
}
// 用 MessageChannel 去做 setImmediate 的 polyfill
// 原理是将新的 message 事件加入到原有的 dom events 之后
else if ((typeof MessageChannel === 'undefined' ? 'undefined' : _typeof(MessageChannel)) === RAW_FUNCTION) {
    nextTick = function nextTick(fn) {
      var channel = new MessageChannel();
      channel.port1.onmessage = fn;
      channel.port2.postMessage(1);
    };
  } else if ((typeof Promise === 'undefined' ? 'undefined' : _typeof(Promise)) === RAW_FUNCTION && isNative(Promise)) {
    nextTick = function nextTick(fn) {
      Promise.resolve().then(fn);
    };
  } else {
    nextTick = setTimeout;
  }

var nextTick$1 = nextTick;

var nextTasks = [];

function addTask(name, task) {
  if (!nextTasks[RAW_LENGTH]) {
    nextTick$1(run);
  }
  array$1[name](nextTasks, task);
}

/**
 * 在队尾添加异步任务
 *
 * @param {Function} task
 */
function append(task) {
  addTask('push', task);
}

/**
 * 在队首添加异步任务
 *
 * @param {Function} task
 */
function prepend(task) {
  addTask('unshift', task);
}

/**
 * 立即执行任务
 */
function run() {
  var currentTasks = nextTasks;
  nextTasks = [];
  each(currentTasks, function (task) {
    task();
  });
}

function createAttrs(vnode) {
  var el = vnode.el,
      component = vnode.component,
      attrs = vnode.attrs,
      api = this;

  if (!component && attrs) {
    each$1(attrs, function (value, name) {
      api.setAttr(el, name, value);
    });
  }
}

function updateAttrs(vnode, oldVnode) {
  var el = vnode.el,
      component = vnode.component,
      attrs = vnode.attrs,
      oldAttrs = oldVnode.attrs,
      api = this;

  if (component || !attrs && !oldAttrs) {
    return;
  }

  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  each$1(attrs, function (value, name) {
    if (!has$1(oldAttrs, name) || value !== oldAttrs[name]) {
      api.setAttr(el, name, value);
    }
  });

  each$1(oldAttrs, function (value, name) {
    if (!has$1(attrs, name)) {
      api.removeAttr(el, name);
    }
  });
}

var attrs = {
  create: createAttrs,
  update: updateAttrs
};

function createProps(vnode, oldVnode) {
  var component = vnode.component,
      props = vnode.props;

  if (!component && props) {
    var api = this,
        oldProps = oldVnode && oldVnode.props || {};
    each$1(props, function (value, name) {
      if (value !== oldProps[name]) {
        api.setProp(vnode.el, name, value);
      }
    });
  }
}

function removeProps(vnode, oldVnode) {
  var component = vnode.component,
      props = vnode.props,
      oldProps = oldVnode.props,
      api = this;

  if (!component && oldProps) {
    props = props || {};
    each$1(oldProps, function (value, name) {
      // 现在只有 innerText 和 innerHTML 会走进这里
      // 对于这两种属性，为了确保兼容性，不能设为 null 或 undefined，因为 IE 会认为是字符串 null 或 undefined
      // 但我们真实想要的是置为空字符串
      if (!has$1(props, name)) {
        api.setProp(vnode.el, name, CHAR_BLANK);
      }
    });
  }
}

//
// 旧 [ child1, child2 ]
// 新 innerHTML
//
// 这种情况，要让外部先把 child1 child2 正常移除掉，再用 innerHTML 覆盖，否则指令无法销毁
//
// 旧 innerHTML
// 新 [ child1, child2 ]
//
// 这种情况，先用 innerHTML 覆盖，再处理 child1 child2
//
var props = {
  create: createProps,
  update: removeProps,
  postpatch: createProps
};

function bindDirective(vnode, key, api) {
  var el = vnode.el,
      tag = vnode.tag,
      attrs = vnode.attrs,
      directives = vnode.directives,
      component = vnode.component,
      instance = vnode.instance;


  var node = directives[key],
      options = {
    el: el,
    node: node,
    instance: instance,
    directives: directives,
    attrs: attrs || {}
  };

  if (component) {
    options.component = api.component(el);
  }

  var bind = instance.directive(node.name),
      unbind = bind && bind(options);

  if (func(unbind)) {
    return unbind;
  }
}

function unbindDirective(vnode, key) {
  var unbinds = vnode.data.unbinds;

  if (unbinds && unbinds[key]) {
    unbinds[key]();
    delete unbinds[key];
  }
}

function updateDirectives(vnode, oldVnode) {

  var newDirectives = vnode.directives;
  var oldDirectives = oldVnode && oldVnode.directives;

  if (!newDirectives && !oldDirectives) {
    return;
  }

  newDirectives = newDirectives || {};
  oldDirectives = oldDirectives || {};

  var api = this,
      newUnbinds = void 0;

  each$1(newDirectives, function (directive, key) {
    var unbind = void 0;
    if (has$1(oldDirectives, key)) {
      var oldDirective = oldDirectives[key];
      if (directive.value !== oldDirective.value || directive.keypath !== oldDirective.keypath) {
        unbindDirective(oldVnode, key);
        unbind = bindDirective(vnode, key, api);
      }
    } else {
      unbind = bindDirective(vnode, key, api);
    }
    if (unbind) {
      (newUnbinds || (newUnbinds = {}))[key] = unbind;
    }
  });

  each$1(oldDirectives, function (directive, key) {
    if (!has$1(newDirectives, key)) {
      unbindDirective(oldVnode, key);
    }
  });

  if (newUnbinds) {
    var data = vnode.data;

    if (data.unbinds) {
      extend(data.unbinds, newUnbinds);
    } else {
      data.unbinds = newUnbinds;
    }
  }
}

function destroyDirectives(vnode) {
  var unbinds = vnode.data.unbinds;

  if (unbinds) {
    each$1(unbinds, function (unbind) {
      unbind();
    });
  }
}

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: destroyDirectives
};

var SYNTAX_IF = '#if';
var SYNTAX_ELSE = 'else';
var SYNTAX_ELSE_IF = 'else if';
var SYNTAX_EACH = '#each';
var SYNTAX_PARTIAL = '#partial';
var SYNTAX_IMPORT = '>';
var SYNTAX_SPREAD = '...';
var SYNTAX_COMMENT = /^!\s/;

var SPECIAL_EVENT = '$event';
var SPECIAL_KEYPATH = '$keypath';

var SLOT_DATA_PREFIX = '$slot_';

var DIRECTIVE_CUSTOM_PREFIX = 'o-';
var DIRECTIVE_EVENT_PREFIX = 'on-';

var DIRECTIVE_LAZY = 'lazy';
var DIRECTIVE_MODEL = 'model';
var DIRECTIVE_EVENT = 'event';
var DIRECTIVE_BINDING = 'binding';

var HOOK_BEFORE_CREATE = 'beforeCreate';
var HOOK_AFTER_CREATE = 'afterCreate';
var HOOK_BEFORE_MOUNT = 'beforeMount';
var HOOK_AFTER_MOUNT = 'afterMount';
var HOOK_BEFORE_UPDATE = 'beforeUpdate';
var HOOK_AFTER_UPDATE = 'afterUpdate';
var HOOK_BEFORE_DESTROY = 'beforeDestroy';
var HOOK_AFTER_DESTROY = 'afterDestroy';

function setRef(instance, ref, value) {
  if (ref) {
    // 为了避免相同的组件，因为切换位置
    // 出现在前面创建，却在后面删除的情况
    // 这里我们设计了一种机制，即在更新视图前，给 instance 设置了一个全新的对象 $flags
    // 任何有类似需求的地方，可以往这个对象存一些标识
    var refs = instance.$refs || (instance.$refs = {});
    refs[ref] = value;
    instance.$flags[ref] = TRUE;
  }
}

function removeRef(instance, ref) {
  // 不是本次更新视图新增的
  if (ref && !instance.$flags[ref]) {
    delete instance.$refs[ref];
  }
}

function createComponent(vnode) {
  var el = vnode.el,
      component = vnode.component,
      instance = vnode.instance,
      ref = vnode.ref;

  if (component) {
    el = this.component(el);
  }
  setRef(instance, ref, el);
}

function updateComponent(vnode, oldVnode) {
  var el = vnode.el,
      component = vnode.component,
      children = vnode.children,
      instance = vnode.instance,
      ref = vnode.ref;


  if (component) {
    el = this.component(el);
    el.set(vnode.attrs);
    el.set(vnode.slots);
  }

  if (oldVnode && oldVnode.ref !== ref) {
    removeRef(instance, oldVnode.ref);
    setRef(instance, ref, el);
  }
}

function destroyComponent(vnode) {
  removeRef(vnode.instance, vnode.ref);
}

var component = {
  create: createComponent,
  postpatch: updateComponent,
  destroy: destroyComponent
};

var TAG_COMMENT = '!';

var HOOK_CREATE = 'create';
var HOOK_UPDATE = 'update';
var HOOK_POSTPATCH = 'postpatch';
var HOOK_DESTROY = 'destroy';

var modules = [component, attrs, props, directives];

var moduleEmitter = new Emitter();

each([HOOK_CREATE, HOOK_UPDATE, HOOK_POSTPATCH, HOOK_DESTROY], function (hook) {
  each(modules, function (item) {
    moduleEmitter.on(hook, item[hook]);
  });
});

modules = NULL;

function isPatchable(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.tag === vnode2.tag;
}

function createKeyToIndex(vnodes, startIndex, endIndex) {
  var result = {},
      key = void 0;
  while (startIndex <= endIndex) {
    key = vnodes[startIndex].key;
    if (isDef(key)) {
      result[key] = startIndex;
    }
    startIndex++;
  }
  return result;
}

function createCommentVnode(text) {
  return {
    tag: TAG_COMMENT,
    text: toString(text)
  };
}

function createTextVnode(text) {
  return {
    text: toString(text)
  };
}

function createElementVnode(tag, attrs$$1, props$$1, directives$$1, children, slots, ref, key, instance, hooks) {
  return {
    tag: tag,
    attrs: attrs$$1,
    props: props$$1,
    directives: directives$$1,
    children: children,
    slots: slots,
    ref: ref,
    key: key,
    instance: instance,
    text: UNDEFINED,
    hooks: hooks
  };
}

function createComponentVnode(tag, attrs$$1, props$$1, directives$$1, children, slots, ref, key, instance, hooks) {
  var vnode = createElementVnode(tag, attrs$$1, props$$1, directives$$1, children, slots, ref, key, instance, hooks);
  vnode.component = TRUE;
  return vnode;
}

function isVnode(vnode) {
  return vnode && has$1(vnode, 'text');
}

function isTextVnode(vnode) {
  return isVnode(vnode) && !has$1(vnode, 'tag');
}

function init(api) {

  var createElement = function createElement(vnode, data) {
    var _vnode = vnode,
        el = _vnode.el,
        tag = _vnode.tag,
        component$$1 = _vnode.component,
        slots = _vnode.slots,
        children = _vnode.children,
        text = _vnode.text,
        instance = _vnode.instance;



    vnode.data = data || {};

    if (falsy$1(tag)) {
      return vnode.el = api.createText(text);
    }

    if (tag === TAG_COMMENT) {
      return vnode.el = api.createComment(text);
    }

    // 不管是组件还是元素，必须先有一个元素
    el = vnode.el = api.createElement(component$$1 ? 'i' : tag);

    if (component$$1) {

      api.component(el, vnode);

      instance.component(tag, function (options) {

        if (!options) {
          fatal('"' + tag + '" component is not found.');
        }

        vnode = api.component(el);

        if (vnode && tag === vnode.tag) {

          component$$1 = (vnode.parent || vnode.instance).create(options, {
            el: el,
            slots: slots,
            props: vnode.attrs,
            replace: TRUE
          });
          el = component$$1.$el;
          if (!el) {
            fatal('"' + tag + '" component must have a root element.');
          }

          vnode.el = el;
          api.component(el, component$$1);

          enterVnode(vnode);

          moduleEmitter.fire(HOOK_CREATE, vnode, api);
        }
      });
    } else {

      if (array(children)) {
        addVnodes(el, children, 0, children[RAW_LENGTH] - 1);
      } else if (string(text)) {
        api.append(el, api.createText(text));
      }

      moduleEmitter.fire(HOOK_CREATE, vnode, api);
    }

    return el;
  };

  var addVnodes = function addVnodes(parentNode, vnodes, startIndex, endIndex, before) {
    var vnode = void 0;
    while (startIndex <= endIndex) {
      vnode = vnodes[startIndex];
      if (createElement(vnode)) {
        insertVnode(parentNode, vnode, before);
      }
      startIndex++;
    }
  };

  var removeVnodes = function removeVnodes(parentNode, vnodes, startIndex, endIndex) {
    var vnode = void 0;
    while (startIndex <= endIndex) {
      vnode = vnodes[startIndex];
      if (vnode) {
        removeVnode(parentNode, vnode);
      }
      startIndex++;
    }
  };

  var removeVnode = function removeVnode(parentNode, vnode) {
    var tag = vnode.tag,
        el = vnode.el,
        component$$1 = vnode.component;

    if (tag) {
      leaveVnode(vnode, function () {
        if (!destroyVnode(vnode)) {
          api.remove(parentNode, el);
        }
      });
    } else if (el) {
      api.remove(parentNode, el);
    }
  };

  var destroyVnode = function destroyVnode(vnode) {
    var el = vnode.el,
        component$$1 = vnode.component,
        children = vnode.children;

    if (component$$1) {
      component$$1 = api.component(el);
      if (vnode.parent === vnode.instance) {
        if (component$$1.set) {
          moduleEmitter.fire(HOOK_DESTROY, vnode, api);
          api.component(el, NULL);
          component$$1.destroy();
          return TRUE;
        }
        api.component(el, NULL);
      } else {
        return;
      }
    } else if (children) {
      each(children, function (child) {
        destroyVnode(child);
      });
    }
    moduleEmitter.fire(HOOK_DESTROY, vnode, api);
  };

  var insertVnode = function insertVnode(parentNode, vnode, oldVnode) {
    var el = vnode.el,
        hasParent = api.parent(el);
    api.before(parentNode, el, oldVnode ? oldVnode.el : NULL);
    if (!hasParent) {
      enterVnode(vnode);
    }
  };

  var enterVnode = function enterVnode(vnode) {
    var el = vnode.el,
        hooks = vnode.hooks,
        data = vnode.data,
        instance = vnode.instance;

    if (hooks) {
      if (data.leaving) {
        data.leaving();
      }
      execute(hooks.enter, instance, [el, noop]);
    }
  };

  var leaveVnode = function leaveVnode(vnode, done) {
    var el = vnode.el,
        hooks = vnode.hooks,
        data = vnode.data,
        instance = vnode.instance;

    if (hooks) {
      data.leaving = function () {
        if (done) {
          done();
          done = NULL;
        }
      };
      execute(hooks.leave, instance, [el, data.leaving]);
    } else {
      done();
    }
  };

  var updateChildren = function updateChildren(parentNode, oldChildren, newChildren) {

    var oldStartIndex = 0;
    var oldEndIndex = oldChildren[RAW_LENGTH] - 1;
    var oldStartVnode = oldChildren[oldStartIndex];
    var oldEndVnode = oldChildren[oldEndIndex];

    var newStartIndex = 0;
    var newEndIndex = newChildren[RAW_LENGTH] - 1;
    var newStartVnode = newChildren[newStartIndex];
    var newEndVnode = newChildren[newEndIndex];

    var oldKeyToIndex = void 0,
        oldIndex = void 0,
        activeVnode = void 0;

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {

      // 下面有设为 NULL 的逻辑
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex]; // Vnode has been moved left
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      }

      // 从头到尾比较，位置相同且值得 patch
      else if (isPatchable(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode);
          oldStartVnode = oldChildren[++oldStartIndex];
          newStartVnode = newChildren[++newStartIndex];
        }

        // 从尾到头比较，位置相同且值得 patch
        else if (isPatchable(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
          }

          // 比较完两侧的节点，剩下就是 位置发生改变的节点 和 全新的节点

          // 当 oldStartVnode 和 newEndVnode 值得 patch
          // 说明元素被移到右边了
          else if (isPatchable(oldStartVnode, newEndVnode)) {
              patchVnode(oldStartVnode, newEndVnode);
              api.before(parentNode, oldStartVnode.el, api.next(oldEndVnode.el));
              oldStartVnode = oldChildren[++oldStartIndex];
              newEndVnode = newChildren[--newEndIndex];
            }

            // 当 oldEndVnode 和 newStartVnode 值得 patch
            // 说明元素被移到左边了
            else if (isPatchable(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode);
                api.before(parentNode, oldEndVnode.el, oldStartVnode.el);
                oldEndVnode = oldChildren[--oldEndIndex];
                newStartVnode = newChildren[++newStartIndex];
              }

              // 尝试同级元素的 key
              else {

                  if (!oldKeyToIndex) {
                    oldKeyToIndex = createKeyToIndex(oldChildren, oldStartIndex, oldEndIndex);
                  }

                  oldIndex = oldKeyToIndex[newStartVnode.key];

                  // 移动元素
                  if (number(oldIndex)) {
                    activeVnode = oldChildren[oldIndex];
                    patchVnode(activeVnode, newStartVnode);
                    oldChildren[oldIndex] = NULL;
                  }
                  // 新元素
                  else if (createElement(newStartVnode, oldStartVnode.data)) {
                      activeVnode = newStartVnode;
                    }

                  if (activeVnode) {
                    insertVnode(parentNode, activeVnode, oldStartVnode);
                  }

                  newStartVnode = newChildren[++newStartIndex];
                }
    }

    if (oldStartIndex > oldEndIndex) {
      addVnodes(parentNode, newChildren, newStartIndex, newEndIndex, newChildren[newEndIndex + 1]);
    } else if (newStartIndex > newEndIndex) {
      removeVnodes(parentNode, oldChildren, oldStartIndex, oldEndIndex);
    }
  };

  var patchVnode = function patchVnode(oldVnode, vnode) {

    if (oldVnode === vnode) {
      return;
    }

    var el = oldVnode.el,
        component$$1 = oldVnode.component,
        data = oldVnode.data;


    vnode.el = el;
    vnode.data = data;

    if (!isPatchable(oldVnode, vnode)) {
      var parentNode = api.parent(el);
      if (createElement(vnode) && parentNode) {
        insertVnode(parentNode, vnode, oldVnode);
        removeVnode(parentNode, oldVnode);
      }
      return;
    }

    if (component$$1) {
      component$$1 = api.component(el);
      if (!component$$1.set) {
        api.component(el, vnode);
        return;
      }
    }

    var args = [vnode, oldVnode];
    moduleEmitter.fire(HOOK_UPDATE, args, api);

    var newText = vnode.text;
    var newChildren = vnode.children;

    var oldText = oldVnode.text;
    var oldChildren = oldVnode.children;

    if (string(newText)) {
      if (newText !== oldText) {
        api.text(el, newText);
      }
    } else {
      // 两个都有需要 diff
      if (newChildren && oldChildren) {
        if (newChildren !== oldChildren) {
          updateChildren(el, oldChildren, newChildren);
        }
      }
      // 有新的没旧的 - 新增节点
      else if (newChildren) {
          if (string(oldText)) {
            api.text(el, CHAR_BLANK);
          }
          addVnodes(el, newChildren, 0, newChildren[RAW_LENGTH] - 1);
        }
        // 有旧的没新的 - 删除节点
        else if (oldChildren) {
            removeVnodes(el, oldChildren, 0, oldChildren[RAW_LENGTH] - 1);
          }
          // 有旧的 text 没有新的 text
          else if (string(oldText)) {
              api.text(el, CHAR_BLANK);
            }
    }

    moduleEmitter.fire(HOOK_POSTPATCH, args, api);
  };

  return function (oldVnode, vnode) {

    patchVnode(api.isElement(oldVnode) ? {
      el: oldVnode,
      tag: api.tag(oldVnode),
      data: {}
    } : oldVnode, vnode);

    return vnode;
  };
}

var snabbdom = Object.freeze({
    createCommentVnode: createCommentVnode,
    createTextVnode: createTextVnode,
    createElementVnode: createElementVnode,
    createComponentVnode: createComponentVnode,
    isVnode: isVnode,
    isTextVnode: isTextVnode,
    init: init
});

var PLUS = '+';
var MINUS = '-';
var MULTIPLY = '*';
var DIVIDE = '/';
var MODULO = '%';
var WAVE = '~';

var AND = '&&';
var OR = '||';
var NOT = '!';
var BOOLEAN = '!!';

var SE = '===';
var SNE = '!==';
var LE = '==';
var LNE = '!=';
var LT = '<';
var LTE = '<=';
var GT = '>';
var GTE = '>=';

var unaryMap = {};

unaryMap[PLUS] = unaryMap[MINUS] = unaryMap[NOT] = unaryMap[WAVE] = unaryMap[BOOLEAN] = TRUE;

var unaryList = sort(unaryMap, TRUE);

// 操作符和对应的优先级，数字越大优先级越高
var binaryMap = {};

binaryMap[OR] = 1;

binaryMap[AND] = 2;

binaryMap[LE] = binaryMap[LNE] = binaryMap[SE] = binaryMap[SNE] = 3;

binaryMap[LT] = binaryMap[LTE] = binaryMap[GT] = binaryMap[GTE] = 4;

binaryMap[PLUS] = binaryMap[MINUS] = 5;

binaryMap[MULTIPLY] = binaryMap[DIVIDE] = binaryMap[MODULO] = 6;

var binaryList = sort(binaryMap, TRUE);

/**
 * 字面量
 *
 * @type {number}
 */
var LITERAL = 1;

/**
 * 标识符
 *
 * @type {number}
 */
var IDENTIFIER = 2;

/**
 * 对象属性或数组下标
 *
 * @type {number}
 */
var MEMBER = 3;

/**
 * 一元表达式，如 - a
 *
 * @type {number}
 */
var UNARY = 4;

/**
 * 二元表达式，如 a + b
 *
 * @type {number}
 */
var BINARY = 5;

/**
 * 三元表达式，如 a ? b : c
 *
 * @type {number}
 */
var TERNARY = 6;

/**
 * 数组表达式，如 [ 1, 2, 3 ]
 *
 * @type {number}
 */
var ARRAY = 7;

/**
 * 对象表达式
 *
 * @type {number}
 */
var OBJECT = 8;

/**
 * 函数调用表达式，如 a()
 *
 * @type {number}
 */
var CALL = 9;

var unary = {};

unary[PLUS] = function (a) {
  return +a;
};
unary[MINUS] = function (a) {
  return -a;
};
unary[NOT] = function (a) {
  return !a;
};
unary[WAVE] = function (a) {
  return ~a;
};
unary[BOOLEAN] = function (a) {
  return !!a;
};

var binary = {};

binary[OR] = function (a, b) {
  return a || b;
};
binary[AND] = function (a, b) {
  return a && b;
};
binary[SE] = function (a, b) {
  return a === b;
};
binary[SNE] = function (a, b) {
  return a !== b;
};
binary[LE] = function (a, b) {
  return a == b;
};
binary[LNE] = function (a, b) {
  return a != b;
};
binary[LT] = function (a, b) {
  return a < b;
};
binary[LTE] = function (a, b) {
  return a <= b;
};
binary[GT] = function (a, b) {
  return a > b;
};
binary[GTE] = function (a, b) {
  return a >= b;
};
binary[PLUS] = function (a, b) {
  return a + b;
};
binary[MINUS] = function (a, b) {
  return a - b;
};
binary[MULTIPLY] = function (a, b) {
  return a * b;
};
binary[DIVIDE] = function (a, b) {
  return a / b;
};
binary[MODULO] = function (a, b) {
  return a % b;
};

/**
 * 节点基类
 */

var Node = function Node(type, raw) {
  classCallCheck(this, Node);

  this.type = type;
  this.raw = trim(raw);
};

/**
 * Array 节点
 *
 * @param {string} raw 源码
 * @param {Array.<Node>} elements 数组元素
 */

var Array$1 = function (_Node) {
  inherits(Array, _Node);

  function Array(raw, elements) {
    classCallCheck(this, Array);

    var _this = possibleConstructorReturn(this, _Node.call(this, ARRAY, raw));

    _this.elements = elements;
    return _this;
  }

  return Array;
}(Node);

/**
 * Object 节点
 *
 * @param {string} raw 源码
 * @param {Array.<string>} keys
 * @param {Array.<Node>} values
 */

var Object$1 = function (_Node) {
  inherits(Object, _Node);

  function Object(raw, keys, values) {
    classCallCheck(this, Object);

    var _this = possibleConstructorReturn(this, _Node.call(this, OBJECT, raw));

    _this.keys = keys;
    _this.values = values;
    return _this;
  }

  return Object;
}(Node);

/**
 * Binary 节点
 *
 * @param {string} raw
 * @param {Node} left
 * @param {string} operator
 * @param {Node} right
 */

var Binary = function (_Node) {
  inherits(Binary, _Node);

  function Binary(raw, left, operator, right) {
    classCallCheck(this, Binary);

    var _this = possibleConstructorReturn(this, _Node.call(this, BINARY, raw));

    _this.left = left;
    _this.operator = operator;
    _this.right = right;
    return _this;
  }

  return Binary;
}(Node);

/**
 * Call 节点
 *
 * @param {string} raw
 * @param {Node} callee
 * @param {Array.<Node>} args
 */

var Call = function (_Node) {
  inherits(Call, _Node);

  function Call(raw, callee, args) {
    classCallCheck(this, Call);

    var _this = possibleConstructorReturn(this, _Node.call(this, CALL, raw));

    _this.callee = callee;
    _this.args = args;
    return _this;
  }

  return Call;
}(Node);

/**
 * Ternary 节点
 *
 * @param {string} raw
 * @param {Node} test
 * @param {Node} yes
 * @param {Node} no
 */

var Ternary = function (_Node) {
  inherits(Ternary, _Node);

  function Ternary(raw, test, yes, no) {
    classCallCheck(this, Ternary);

    var _this = possibleConstructorReturn(this, _Node.call(this, TERNARY, raw));

    _this.test = test;
    _this.yes = yes;
    _this.no = no;
    return _this;
  }

  return Ternary;
}(Node);

var names = {};
names[KEYPATH_PUBLIC_CURRENT] = KEYPATH_PRIVATE_CURRENT;
names[KEYPATH_PUBLIC_PARENT] = KEYPATH_PRIVATE_PARENT;

/**
 * Identifier 节点
 *
 * @param {string} raw
 * @param {string} name
 */

var Identifier = function (_Node) {
  inherits(Identifier, _Node);

  function Identifier(raw, name) {
    classCallCheck(this, Identifier);

    var _this = possibleConstructorReturn(this, _Node.call(this, IDENTIFIER, raw));

    if (has$1(names, name)) {
      name = names[name];
      _this.lookup = FALSE;
    }
    _this.name = _this.staticKeypath = name;
    return _this;
  }

  return Identifier;
}(Node);

/**
 * Literal 节点
 *
 * @param {string} raw
 * @param {*} value
 */

var Literal = function (_Node) {
  inherits(Literal, _Node);

  function Literal(raw, value) {
    classCallCheck(this, Literal);

    var _this = possibleConstructorReturn(this, _Node.call(this, LITERAL, raw));

    _this.value = value;
    return _this;
  }

  return Literal;
}(Node);

/**
 * Member 节点
 *
 * @param {string} raw
 * @param {Node} object
 * @param {Node} prop
 */

var Member = function (_Node) {
  inherits(Member, _Node);

  function Member(raw, object, prop) {
    classCallCheck(this, Member);

    var _this = possibleConstructorReturn(this, _Node.call(this, MEMBER, raw));

    var props = [];

    push(props, object.type === MEMBER ? object.props : object);

    push(props, prop);

    var firstRaw = props[0].raw;
    if (firstRaw === KEYPATH_PUBLIC_CURRENT || firstRaw === KEYPATH_PUBLIC_PARENT) {
      _this.lookup = FALSE;
    }

    _this.props = props;

    var staticKeypath = object.staticKeypath;


    if (isDef(staticKeypath) && prop.type === LITERAL) {
      _this.staticKeypath = staticKeypath ? staticKeypath + KEYPATH_SEPARATOR + prop.value : prop.value;
    }

    return _this;
  }

  return Member;
}(Node);

/**
 * Unary 节点
 *
 * @param {string} raw
 * @param {string} operator
 * @param {Node} arg
 */

var Unary = function (_Node) {
  inherits(Unary, _Node);

  function Unary(raw, operator, arg) {
    classCallCheck(this, Unary);

    var _this = possibleConstructorReturn(this, _Node.call(this, UNARY, raw));

    _this.operator = operator;
    _this.arg = arg;
    return _this;
  }

  return Unary;
}(Node);

// 区分关键字和普通变量
// 举个例子：a === true
// 从解析器的角度来说，a 和 true 是一样的 token
var keywords = {};

keywords[RAW_TRUE] = TRUE;
keywords[RAW_FALSE] = FALSE;
keywords[RAW_NULL] = NULL;
keywords[RAW_UNDEFINED] = UNDEFINED;

// 缓存编译结果
var compileCache$1 = {};

/**
 * 是否是数字
 *
 * @param {number} charCode
 * @return {boolean}
 */
function isDigit(charCode) {
  return charCode >= 48 && charCode <= 57; // 0...9
}

/**
 * 变量开始字符必须是 字母、下划线、$
 *
 * @param {number} charCode
 * @return {boolean}
 */
function isIdentifierStart(charCode) {
  return charCode === 36 // $
  || charCode === 95 // _
  || charCode >= 97 && charCode <= 122 // a...z
  || charCode >= 65 && charCode <= 90; // A...Z
}

/**
 * 变量剩余的字符必须是 字母、下划线、$、数字
 *
 * @param {number} charCode
 * @return {boolean}
 */
function isIdentifierPart(charCode) {
  return isIdentifierStart(charCode) || isDigit(charCode);
}

/**
 * 把表达式编译成抽象语法树
 *
 * @param {string} content 表达式字符串
 * @return {Object}
 */
function compile$1(content) {

  if (compileCache$1[content]) {
    return compileCache$1[content];
  }

  var length = content[RAW_LENGTH],
      index = 0,
      charCode = void 0;

  var throwError = function throwError() {
    fatal('Failed to compile expression: ' + CHAR_BREAKLINE + content);
  };

  var getCharCode = function getCharCode() {
    return codeAt(content, index);
  };

  var getNextCharCode = function getNextCharCode() {
    return codeAt(content, index + 1);
  };

  var cutString = function cutString(start, end) {
    return content.substring(start, end == NULL ? index : end);
  };

  var skipWhitespace = function skipWhitespace() {
    while ((charCode = getCharCode()) && (charCode === CODE_WHITESPACE || charCode === CODE_TAB)) {
      index++;
    }
  };

  var skipNumber = function skipNumber() {
    if (getCharCode() === CODE_DOT) {
      skipDecimal();
    } else {
      skipDigit();
      if (getCharCode() === CODE_DOT) {
        skipDecimal();
      }
    }
  };

  var skipDigit = function skipDigit() {
    do {
      index++;
    } while (isDigit(getCharCode()));
  };

  var skipDecimal = function skipDecimal() {
    // 跳过点号
    index++;
    // 后面必须紧跟数字
    if (isDigit(getCharCode())) {
      skipDigit();
    } else {
      throwError();
    }
  };

  var skipString = function skipString() {

    var quote = getCharCode();

    // 跳过引号
    index++;
    while (index < length) {
      index++;
      if (codeAt(content, index - 1) === quote) {
        return;
      }
    }

    throwError();
  };

  var skipIdentifier = function skipIdentifier() {
    // 第一个字符一定是经过 isIdentifierStart 判断的
    // 因此循环至少要执行一次
    do {
      index++;
    } while (isIdentifierPart(getCharCode()));
  };

  var parseIdentifier = function parseIdentifier(careKeyword) {

    var start = index;
    skipIdentifier();

    var literal = cutString(start);
    if (literal) {
      return careKeyword && has$1(keywords, literal) ? new Literal(literal, keywords[literal]) : new Identifier(literal, literal);
    }

    throwError();
  };

  var parseTuple = function parseTuple(delimiter) {

    var list = [];

    // 跳过开始字符，如 [、(
    index++;

    while (index < length) {
      charCode = getCharCode();
      if (charCode === delimiter) {
        index++;
        return list;
      } else if (charCode === CODE_COMMA) {
        index++;
      } else {
        push(list, parseExpression());
      }
    }

    throwError();
  };

  var parseObject = function parseObject() {

    var keys$$1 = [],
        values = [],
        current = keys$$1;

    // 跳过开始字符 {
    index++;

    while (index < length) {
      charCode = getCharCode();
      // }
      if (charCode === CODE_CBRACE) {
        index++;
        if (keys$$1[RAW_LENGTH] !== values[RAW_LENGTH]) {
          throwError();
        }
        return {
          keys: keys$$1.map(function (item) {
            if (item.type === IDENTIFIER) {
              return item.name;
            } else if (item.type === LITERAL) {
              return item.value;
            } else {
              throwError();
            }
          }),
          values: values
        };
      }
      // :
      else if (charCode === CODE_COLON) {
          current = values;
          index++;
        }
        // ,
        else if (charCode === CODE_COMMA) {
            current = keys$$1;
            index++;
          } else {
            push(current, parseExpression());
          }
    }

    throwError();
  };

  var parseOperator = function parseOperator(sortedOperatorList) {

    skipWhitespace();

    var value = slice(content, index),
        match = void 0;
    each(sortedOperatorList, function (prefix) {
      if (startsWith(value, prefix)) {
        match = prefix;
        return FALSE;
      }
    });

    if (match) {
      index += match[RAW_LENGTH];
      return match;
    }
  };

  var parseVariable = function parseVariable(prevStart, prevNode) {

    var start = index,
        node = parseIdentifier(TRUE),
        temp = void 0;

    if (prevNode) {
      node = new Member(cutString(prevStart), prevNode, new Literal(node.raw, node.name));
    }

    while (index < length) {
      // a(x)
      charCode = getCharCode();
      if (charCode === CODE_OPAREN) {
        temp = parseTuple(CODE_CPAREN);
        return new Call(cutString(start), node, temp);
      }
      // a.x
      else if (charCode === CODE_DOT) {
          index++;
          temp = parseIdentifier();
          node = new Member(cutString(start), node, new Literal(temp.raw, temp.name));
        }
        // a[x]
        else if (charCode === CODE_OBRACK) {
            temp = parseExpression(CODE_CBRACK);
            node = new Member(cutString(start), node, temp);
          } else {
            break;
          }
    }

    return node;
  };

  var parseNumber = function parseNumber(start) {
    skipNumber();
    var temp = cutString(start);
    return new Literal(temp, parseFloat(temp));
  };

  var parsePath = function parsePath(start, prevNode) {

    // 跳过第一个点号
    index++;
    charCode = getCharCode();

    var node = void 0;

    // ./
    if (charCode === CODE_SLASH) {
      index++;
      node = new Identifier(KEYPATH_PUBLIC_CURRENT, KEYPATH_PUBLIC_CURRENT);
    }
    // ../
    else if (charCode === CODE_DOT) {
        index++;
        if (getCharCode() === CODE_SLASH) {
          index++;
          node = new Identifier(KEYPATH_PUBLIC_PARENT, KEYPATH_PUBLIC_PARENT);
        }
      }

    if (node) {
      if (prevNode) {
        node = new Member(cutString(start), prevNode, new Literal(node.raw, node.name));
      }
      charCode = getCharCode();
      if (charCode === CODE_DOT) {
        return parsePath(start, node);
      } else if (isIdentifierStart(charCode)) {
        return parseVariable(start, node);
      }
    }

    throwError();
  };

  var parseToken = function parseToken() {

    skipWhitespace();

    charCode = getCharCode();

    var start = index,
        temp = void 0;

    // 'xx' 或 "xx"
    if (charCode === CODE_SQUOTE || charCode === CODE_DQUOTE) {
      // 截出的字符串包含引号
      skipString();
      temp = cutString(start);
      return new Literal(temp, slice(temp, 1, -1));
    }
    // 1.1
    else if (isDigit(charCode)) {
        return parseNumber(start);
      }
      // .1  ./  ../
      else if (charCode === CODE_DOT) {
          return isDigit(getNextCharCode()) ? parseNumber(start) : parsePath(start);
        }
        // [xx, xx]
        else if (charCode === CODE_OBRACK) {
            temp = parseTuple(CODE_CBRACK);
            return new Array$1(cutString(start), temp);
          } else if (charCode === CODE_OBRACE) {
            temp = parseObject();
            return new Object$1(cutString(start), temp.keys, temp.values);
          }
          // (xx)
          else if (charCode === CODE_OPAREN) {
              return parseExpression(CODE_CPAREN);
            }
            // 变量
            else if (isIdentifierStart(charCode)) {
                return parseVariable();
              }
    // 一元操作
    var action = parseOperator(unaryList);
    if (action) {
      temp = parseToken();
      return new Unary(cutString(start), action, temp);
    }
    throwError();
  };

  var parseBinary = function parseBinary() {

    var stack = [index, parseToken(), index],
        next = void 0,
        length = void 0;

    // stack 的结构必须是 token 之后跟一个 index
    // 这样在裁剪原始字符串时，才有据可查

    // 处理优先级，确保循环结束时，是相同的优先级操作
    while (next = parseOperator(binaryList)) {

      length = stack[RAW_LENGTH];

      if (length > 7 && binaryMap[next] < stack[length - 4]) {
        stack.splice(length - 7, 6, new Binary(cutString(stack[length - 8], stack[length - 1]), stack[length - 7], stack[length - 5], stack[length - 2]));
      }

      push(stack, next);
      push(stack, binaryMap[next]);
      push(stack, index);
      push(stack, parseToken());
      push(stack, index);
    }

    while (TRUE) {
      length = stack[RAW_LENGTH];
      if (length > 8 && stack[length - 4] > stack[length - 9]) {
        stack.splice(length - 7, 6, new Binary(cutString(stack[length - 8], stack[length - 1]), stack[length - 7], stack[length - 5], stack[length - 2]));
      } else if (length > 7) {
        stack.splice(1, 6, new Binary(cutString(stack[0], stack[7]), stack[1], stack[3], stack[6]));
      } else {
        return stack[1];
      }
    }
  };

  var parseExpression = function parseExpression(delimiter) {

    // 主要是区分三元和二元表达式
    // 三元表达式可以认为是 3 个二元表达式组成的
    // test ? yes : no

    // 跳过开始字符
    if (delimiter) {
      index++;
    }

    // 保证调用 parseExpression() 之后无需再次调用 skipWhitespace()
    var start = index,
        test = parseBinary();
    skipWhitespace();

    if (getCharCode() === CODE_QUMARK) {
      index++;

      var yes = parseBinary();
      skipWhitespace();

      if (getCharCode() === CODE_COLON) {
        index++;

        var no = parseBinary();
        skipWhitespace();

        return new Ternary(cutString(start), test, yes, no);
      } else {
        throwError();
      }
    }

    if (delimiter) {
      if (getCharCode() === delimiter) {
        index++;
      } else {
        throwError();
      }
    }

    return test;
  };

  return compileCache$1[content] = parseExpression();
}

var executor = {};

executor[LITERAL] = function (node) {
  return node.value;
};

executor[IDENTIFIER] = function (node, getter) {
  return getter(node.name, node);
};

executor[MEMBER] = function (node, getter, context) {
  var keypath = node.staticKeypath;
  if (!keypath) {
    keypath = CHAR_BLANK;
    each(node.props, function (node, index) {
      var type = node.type,
          next = CHAR_BLANK;
      if (type !== LITERAL) {
        if (index > 0) {
          next = execute$1(node, getter, context);
        } else if (type === IDENTIFIER) {
          next = node.name;
        }
      } else {
        next = node.value;
      }
      keypath = join$1(keypath, next);
    });
  }
  return getter(keypath, node);
};

executor[UNARY] = function (node, getter, context) {
  return unary[node.operator](execute$1(node.arg, getter, context));
};

executor[BINARY] = function (node, getter, context) {
  return binary[node.operator](execute$1(node.left, getter, context), execute$1(node.right, getter, context));
};

executor[TERNARY] = function (node, getter, context) {
  return execute$1(node.test, getter, context) ? execute$1(node.yes, getter, context) : execute$1(node.no, getter, context);
};

executor[ARRAY] = function (node, getter, context) {
  return node.elements.map(function (node) {
    return execute$1(node, getter, context);
  });
};

executor[OBJECT] = function (node, getter, context) {
  var result = {};
  each(node.keys, function (key, index) {
    result[key] = execute$1(node.values[index], getter, context);
  });
  return result;
};

executor[CALL] = function (node, getter, context) {
  var args = node.args;

  if (args) {
    args = args.map(function (node) {
      return execute$1(node, getter, context);
    });
  }
  return execute(execute$1(node.callee, getter, context), context, args);
};

/**
 * 表达式求值
 *
 * @param {Node} node 表达式抽象节点
 * @param {Function} getter 读取数据的方法
 * @param {*} context 表达式函数调用的执行上下文
 * @return {*}
 */
function execute$1(node, getter, context) {
  return executor[node.type](node, getter, context);
}

/**
 * 元素 节点
 *
 * @type {number}
 */
var ELEMENT = 1;

/**
 * 属性 节点
 *
 * @type {number}
 */
var ATTRIBUTE = 2;

/**
 * 文本 节点
 *
 * @type {number}
 */
var TEXT = 3;

/**
 * 指令 节点
 *
 * @type {number}
 */
var DIRECTIVE = 4;

/**
 * if 节点
 *
 * @type {number}
 */
var IF = 5;

/**
 * else if 节点
 *
 * @type {number}
 */
var ELSE_IF = 6;

/**
 * else 节点
 *
 * @type {number}
 */
var ELSE = 7;

/**
 * each 节点
 *
 * @type {number}
 */
var EACH = 8;

/**
 * partial 节点
 *
 * @type {number}
 */
var PARTIAL = 9;

/**
 * import 节点
 *
 * @type {number}
 */
var IMPORT = 10;

/**
 * 表达式 节点
 *
 * @type {number}
 */
var EXPRESSION = 11;

/**
 * 延展操作 节点
 *
 * @type {number}
 */
var SPREAD = 12;

// if 带条件的
var ifTypes = {};
// if 分支的
var elseTypes = {};
// html 层级的节点类型
var htmlTypes = {};
// 叶子节点类型
var leafTypes = {};
// 内置指令，无需加前缀
var builtInDirectives = {};
// 名称 -> 类型的映射
var name2Type = {};
// 类型 -> 名称的映射
var type2Name = {};

ifTypes[IF] = ifTypes[ELSE_IF] = elseTypes[ELSE_IF] = elseTypes[ELSE] = htmlTypes[ELEMENT] = htmlTypes[ATTRIBUTE] = htmlTypes[DIRECTIVE] = leafTypes[TEXT] = leafTypes[IMPORT] = leafTypes[SPREAD] = leafTypes[EXPRESSION] = builtInDirectives[DIRECTIVE_LAZY] = builtInDirectives[DIRECTIVE_MODEL] = TRUE;

name2Type['if'] = IF;
name2Type['each'] = EACH;
name2Type['partial'] = PARTIAL;

each$1(name2Type, function (type, name) {
  type2Name[type] = name;
});

/**
 * 节点基类
 */

var Node$2 = function () {
  function Node(type) {
    classCallCheck(this, Node);

    this.type = type;
  }

  Node.prototype.stringify = function stringify() {
    return this.stringifyObject(this);
  };

  Node.prototype.stringifyObject = function stringifyObject(obj) {
    if (obj) {
      var keys$$1 = keys(obj);
      if (keys$$1[RAW_LENGTH]) {
        var me = this,
            result = void 0;
        each(keys$$1, function (key) {
          var value = obj[key];
          if (value == NULL) {
            return;
          }
          if (string(value)) {
            value = me.stringifyString(value);
          } else {
            if (array(value)) {
              if (key === 'children') {
                value = me.stringifyArray(value, 'x');
                if (value) {
                  value = me.stringifyFunction(value);
                }
              } else {
                value = me.stringifyArray(value);
              }
            } else if (object(value)) {
              value = me.stringifyObject(value);
            }
            if (value == NULL) {
              return;
            }
          }
          if (!result) {
            result = [];
          }
          push(result, key + ':' + value);
        });
        if (result) {
          return '{' + join(result, ',') + '}';
        }
      }
    }
  };

  Node.prototype.stringifyArray = function stringifyArray(arr, name) {
    if (arr && arr[RAW_LENGTH]) {
      var me = this,
          result = [];
      each(arr, function (item) {
        if (item.stringify) {
          item = item.stringify();
        } else if (object(item)) {
          item = me.stringifyObject(item);
        }
        push(result, item);
      });
      return name ? me.stringifyCall(name, result) : '[' + join(result, ',') + ']';
    }
  };

  Node.prototype.stringifyExpression = function stringifyExpression(expr, safe) {
    if (expr) {
      return this.stringifyCall('o', this.stringifyObject(expr));
    }
  };

  Node.prototype.stringifyCall = function stringifyCall(name, params) {
    return name + '(' + (array(params) ? join(params, ',') : params) + ')';
  };

  Node.prototype.stringifyString = function stringifyString(str) {
    return '"' + str.replace(/"/g, '\\"').replace(/\s*\n+\s*/g, ' ') + '"';
  };

  Node.prototype.stringifyFunction = function stringifyFunction(str) {
    return 'function(){' + (str || '') + '}';
  };

  return Node;
}();

/**
 * 属性节点
 *
 * @param {string|Expression} name 属性名
 */

var Attribute = function (_Node) {
  inherits(Attribute, _Node);

  function Attribute(name) {
    classCallCheck(this, Attribute);

    var _this = possibleConstructorReturn(this, _Node.call(this, ATTRIBUTE));

    _this.name = name;
    return _this;
  }

  return Attribute;
}(Node$2);

/**
 * 指令节点
 *
 * on-click="submit"  name 是 event, modifier 是 click
 *
 * @param {string} name 指令名
 * @param {?string} modifier 指令修饰符
 */

var Directive = function (_Node) {
  inherits(Directive, _Node);

  function Directive(name, modifier) {
    classCallCheck(this, Directive);

    var _this = possibleConstructorReturn(this, _Node.call(this, DIRECTIVE));

    _this.name = name;
    if (modifier) {
      _this.modifier = modifier;
    }
    return _this;
  }

  return Directive;
}(Node$2);

/**
 * each 节点
 *
 * @param {Expression} expr
 * @param {?string} index 遍历索引值，对于数组来说是 0,1,2,...，对于对象来说是 key
 */

var Each = function (_Node) {
  inherits(Each, _Node);

  function Each(expr, index) {
    classCallCheck(this, Each);

    var _this = possibleConstructorReturn(this, _Node.call(this, EACH));

    _this.expr = expr;
    if (index) {
      _this.index = index;
    }
    return _this;
  }

  Each.prototype.stringify = function stringify() {
    var generate = this.stringifyArray(this[RAW_CHILDREN], 'x');
    if (generate) {
      var params = [this.stringifyObject(this.expr), this.stringifyFunction(generate)];
      if (this.index) {
        push(params, this.stringifyString(this.index));
      }
      return this.stringifyFunction(this.stringifyCall('e', params));
    }
  };

  return Each;
}(Node$2);

/**
 * 元素节点
 *
 * @param {string} tag
 * @param {?boolean} component 是否是组件
 */

var Element = function (_Node) {
  inherits(Element, _Node);

  function Element(tag, component) {
    classCallCheck(this, Element);

    var _this = possibleConstructorReturn(this, _Node.call(this, ELEMENT));

    _this.tag = tag;
    if (component) {
      _this.component = component;
    }
    return _this;
  }

  Element.prototype.stringify = function stringify() {

    var me = this;
    var tag = me.tag,
        divider = me.divider,
        component = me.component,
        props = me.props,
        slot = me.slot,
        name = me.name,
        key = me.key,
        ref = me.ref,
        transition = me.transition;


    var params = [],
        attrs = [],
        children = [];

    if (me[RAW_CHILDREN]) {
      each(me[RAW_CHILDREN], function (child, index) {
        push(index < divider ? attrs : children, child.stringify());
      });
    }

    var addArray = function addArray(arr, name) {
      arr = me.stringifyArray(arr, name || 'x');
      unshift(params, arr ? me.stringifyFunction(arr) : RAW_UNDEFINED);
    };

    if (tag === 'template') {
      if (slot && children[RAW_LENGTH]) {
        addArray(children);
        addArray(slot);
        return this.stringifyCall('a', params);
      }
    } else if (tag === 'slot') {
      if (name) {
        addArray(name);
        return this.stringifyCall('b', params);
      }
    } else {

      if (key) {
        addArray(key);
      }

      if (transition || params[RAW_LENGTH]) {
        addArray(transition);
      }

      if (ref || params[RAW_LENGTH]) {
        addArray(ref);
      }

      if (props && props[RAW_LENGTH] || params[RAW_LENGTH]) {
        addArray(props, 'z');
      }

      if (attrs[RAW_LENGTH] || params[RAW_LENGTH]) {
        addArray(attrs, 'y');
      }

      if (children[RAW_LENGTH] || params[RAW_LENGTH]) {
        addArray(children);
      }

      unshift(params, me.stringifyString(tag));
      unshift(params, component ? 1 : 0);

      return this.stringifyCall('c', params);
    }
  };

  return Element;
}(Node$2);

/**
 * else 节点
 */

var Else = function (_Node) {
  inherits(Else, _Node);

  function Else() {
    classCallCheck(this, Else);
    return possibleConstructorReturn(this, _Node.call(this, ELSE));
  }

  return Else;
}(Node$2);

/**
 * else if 节点
 *
 * @param {Expression} expr 判断条件
 */

var ElseIf = function (_Node) {
  inherits(ElseIf, _Node);

  function ElseIf(expr, then) {
    classCallCheck(this, ElseIf);

    var _this = possibleConstructorReturn(this, _Node.call(this, ELSE_IF));

    _this.expr = expr;
    return _this;
  }

  return ElseIf;
}(Node$2);

/**
 * 表达式节点
 *
 * @param {string} expr
 * @param {boolean} safe
 */

var Expression = function (_Node) {
  inherits(Expression, _Node);

  function Expression(expr, safe) {
    classCallCheck(this, Expression);

    var _this = possibleConstructorReturn(this, _Node.call(this, EXPRESSION));

    _this.expr = expr;
    _this.safe = safe;
    return _this;
  }

  Expression.prototype.stringify = function stringify() {
    return this.stringifyExpression(this.expr);
  };

  return Expression;
}(Node$2);

/**
 * if 节点
 *
 * @param {Expression} expr 判断条件
 */

var If = function (_Node) {
  inherits(If, _Node);

  function If(expr) {
    classCallCheck(this, If);

    var _this = possibleConstructorReturn(this, _Node.call(this, IF));

    _this.expr = expr;
    return _this;
  }

  If.prototype.stringify = function stringify() {
    var stump = this.stump;


    var stringify = function stringify(node) {
      var expr = node.stringifyExpression(node.expr);
      var children = node.stringifyArray(node[RAW_CHILDREN], 'x');
      var next = node.next;
      if (next) {
        next = stringify(next);
      } else if (stump) {
        next = 'x(m())';
      }
      if (expr) {
        if (children) {
          if (next) {
            return expr + '?' + children + ':' + next;
          }
          return expr + '&&' + children;
        } else {
          if (next) {
            return '!' + expr + '&&' + next;
          }
        }
      } else if (children) {
        return children;
      }
    };

    var str = stringify(this);
    if (str) {
      return this.stringifyFunction(str);
    }
  };

  return If;
}(Node$2);

/**
 * import 节点
 *
 * @param {string} name
 */

var Import = function (_Node) {
  inherits(Import, _Node);

  function Import(name) {
    classCallCheck(this, Import);

    var _this = possibleConstructorReturn(this, _Node.call(this, IMPORT));

    _this.name = name;
    return _this;
  }

  Import.prototype.stringify = function stringify() {
    return this.stringifyCall('i', this.stringifyString(this.name));
  };

  return Import;
}(Node$2);

/**
 * Partial 节点
 *
 * @param {string} name
 */

var Partial = function (_Node) {
  inherits(Partial, _Node);

  function Partial(name) {
    classCallCheck(this, Partial);

    var _this = possibleConstructorReturn(this, _Node.call(this, PARTIAL));

    _this.name = name;
    return _this;
  }

  Partial.prototype.stringify = function stringify() {
    return this.stringifyCall('p', [this.stringifyString(this.name), this.stringifyFunction(this.stringifyArray(this[RAW_CHILDREN], 'x'))]);
  };

  return Partial;
}(Node$2);

/**
 * 延展操作 节点
 *
 * @param {Expression} expr
 */

var Spread = function (_Node) {
  inherits(Spread, _Node);

  function Spread(expr) {
    classCallCheck(this, Spread);

    var _this = possibleConstructorReturn(this, _Node.call(this, SPREAD));

    _this.expr = expr;
    return _this;
  }

  Spread.prototype.stringify = function stringify() {
    var expr = this.expr;

    return this.stringifyCall('s', this.stringifyObject(expr));
  };

  return Spread;
}(Node$2);

/**
 * 文本节点
 *
 * @param {*} content
 */

var Text = function (_Node) {
  inherits(Text, _Node);

  function Text(text) {
    classCallCheck(this, Text);

    var _this = possibleConstructorReturn(this, _Node.call(this, TEXT));

    _this.text = text;
    return _this;
  }

  Text.prototype.stringify = function stringify() {
    return this.stringifyString(this.text);
  };

  return Text;
}(Node$2);

var delimiterPattern = /(\{?\{\{)\s*([^\}]+?)\s*(\}\}\}?)/;
var openingTagPattern = /<(\/)?([a-z][-a-z0-9]*)/i;
var closingTagPattern = /^\s*(\/)?>/;
var attributePattern = /^\s*([-:\w]+)(?:=(['"]))?/;
var componentNamePattern = /[-A-Z]/;
var selfClosingTagNames = ['area', 'base', 'embed', 'track', 'source', 'param', 'input', 'slot', 'col', 'img', 'br', 'hr'];

// 缓存编译结果
var compileCache = {};

/**
 * 截取前缀之后的字符串
 *
 * @param {string} str
 * @param {string} prefix
 * @return {string}
 */
function slicePrefix(str, prefix) {
  return trim(slice(str, prefix[RAW_LENGTH]));
}

/**
 * 是否是纯粹的换行
 *
 * @param {string} content
 * @return {boolean}
 */
function isBreakline(content) {
  return has$2(content, CHAR_BREAKLINE) && !trim(content);
}

/**
 * trim 文本开始和结束位置的换行符
 *
 * 换行符比较神奇，有时候你明明看不到换行符，却真的存在一个，那就是 \r
 *
 * @param {string} content
 * @return {string}
 */
function trimBreakline(content) {
  return content.replace(/^\s*[\n\r]\s*|\s*[\n\r]\s*$/g, CHAR_BLANK);
}

var textProp = win && win.SVGElement ? 'textContent' : 'innerText';

/**
 * 把模板编译为抽象语法树
 *
 * @param {string} content
 * @return {Array}
 */
function compile$$1(content) {

  var nodeList = compileCache[content];
  if (nodeList) {
    return nodeList;
  }
  nodeList = [];

  var nodeStack = [],
      ifStack = [],
      htmlStack = [],
      currentQuote = void 0;

  var throwError = function throwError(msg) {
    fatal('Error compiling template:' + CHAR_BREAKLINE + content + CHAR_BREAKLINE + '- ' + msg);
  };

  var popSelfClosingElementIfNeeded = function popSelfClosingElementIfNeeded(popingTagName) {
    var lastNode = last(nodeStack);
    if (lastNode && lastNode.type === ELEMENT && lastNode.tag !== popingTagName && has(selfClosingTagNames, lastNode.tag)) {
      popStack(ELEMENT, lastNode.tag);
    }
  };

  var popStack = function popStack(type, expectedTagName) {

    /**
     * <div>
     *    <input>
     * </div>
     */
    if (expectedTagName) {
      popSelfClosingElementIfNeeded(expectedTagName);
    }

    var target = void 0;

    each(nodeStack, function (node, i) {
      if (node.type === type) {
        target = nodeStack.splice(i, 1)[0];
        return FALSE;
      }
    }, TRUE);

    if (target) {
      var _target = target,
          tag = _target.tag,
          name = _target.name,
          divider = _target.divider,
          children = _target.children,
          component = _target.component;

      if (type === ELEMENT && expectedTagName && tag !== expectedTagName) {
        throwError('end tag expected </' + tag + '> to be </' + expectedTagName + '>.');
      }

      // ==========================================
      // 以下是性能优化的逻辑
      // ==========================================

      // 如果 children 没实际的数据，删掉它
      // 避免在渲染阶段增加计算量
      if (children && !children[RAW_LENGTH]) {
        children = NULL;
        delete target[RAW_CHILDREN];
      }

      if (!children) {
        return;
      }

      if (type === ELEMENT) {
        // 优化只有一个子节点的情况
        if (!component && tag !== 'template' && children[RAW_LENGTH] - divider === 1) {

          var singleChild = last(children);

          // 子节点是纯文本
          if (singleChild.type === TEXT) {
            target.props = [{
              name: textProp,
              value: singleChild.text
            }];
            pop(children);
          } else if (singleChild.type === EXPRESSION) {
            var props = [];
            if (singleChild.safe === FALSE) {
              push(props, {
                name: 'innerHTML',
                value: singleChild.expr
              });
            } else {
              push(props, {
                name: textProp,
                value: singleChild.expr
              });
            }
            target.props = props;
            pop(children);
          }

          if (!children[RAW_LENGTH]) {
            delete target[RAW_CHILDREN];
          }
        }
      } else {

        if (type === ATTRIBUTE) {
          // <div key="xx">
          // <div ref="xx">
          // <div transition="xx">
          // <slot name="xx">
          // <template slot="xx">
          var element = last(htmlStack);
          if (name === 'key' || name === 'ref' || name === 'transition' || element.tag === 'template' && name === 'slot' || element.tag === 'slot' && name === 'name') {
            // 把数据从属性中提出来，减少渲染时的遍历
            remove(element[RAW_CHILDREN], target);
            if (!element[RAW_CHILDREN][RAW_LENGTH]) {
              delete element[RAW_CHILDREN];
            }
            if (children[RAW_LENGTH]) {
              element[name] = children;
            }
            return;
          }
        }

        var _singleChild = children[RAW_LENGTH] === 1 && children[0];
        if (_singleChild) {
          if (_singleChild.type === TEXT) {
            // 指令的值如果是纯文本，可以预编译表达式，提升性能
            var text = _singleChild.text;

            if (type === DIRECTIVE) {
              target.expr = compile$1(text);
              target.value = text;
              delete target[RAW_CHILDREN];
            }
            // 属性的值如果是纯文本，直接获取文本值
            // 减少渲染时的遍历
            else if (type === ATTRIBUTE) {
                target.value = text;
                delete target[RAW_CHILDREN];
              }
          }
          // <div class="{{className}}">
          // 把 Attribute 转成 单向绑定 指令，可实现精确更新视图
          else if (type === ATTRIBUTE && _singleChild.type === EXPRESSION) {
              var expr = _singleChild.expr;

              target.expr = expr;
              delete target[RAW_CHILDREN];
            }
        }
      }
    } else {
      throwError('{{/' + type2Name[type] + '}} is not a pair.');
    }
  };

  var addChild = function addChild(node) {
    var type = node.type,
        text = node.text;


    if (type === TEXT) {
      if (isBreakline(text) || !(text = trimBreakline(text))) {
        return;
      }
      node.text = text;
    }

    /**
     * <div>
     *    <input>
     *    <div></div>
     * </div>
     *
     * <div>
     *    <input>xxx
     * </div>
     */
    if (!htmlStack[RAW_LENGTH]) {
      popSelfClosingElementIfNeeded();
    }

    if (elseTypes[type]) {
      var ifNode = pop(ifStack);
      ifNode.next = node;
      popStack(ifNode.type);
      push(ifStack, node);
      push(nodeStack, node);
      return;
    }

    var prevNode = void 0;

    var currentNode = last(nodeStack);
    if (currentNode) {
      var children = currentNode.children,
          divider = currentNode.divider;

      if (children) {
        if (children[RAW_LENGTH] !== divider) {
          prevNode = children[children[RAW_LENGTH] - 1];
        }
      } else {
        children = currentNode[RAW_CHILDREN] = [];
      }
      push(children, node);
    } else {
      prevNode = last(nodeList);
      push(nodeList, node);
    }

    if (ifTypes[type]) {
      // 只要是 if 节点，并且处于 element 层级，就加 stump
      // 方便 virtual dom 进行对比
      if (!htmlStack[RAW_LENGTH]) {
        node.stump = TRUE;
      }
      push(ifStack, node);
    } else if (htmlTypes[type]) {
      push(htmlStack, node);
    }

    if (!leafTypes[type]) {
      push(nodeStack, node);
    }
  };

  var htmlParsers = [function (content) {
    if (!htmlStack[RAW_LENGTH]) {
      var _match = content.match(openingTagPattern);
      // 必须以 <tag 开头才能继续
      if (_match && !_match.index) {
        var tagName = _match[2];
        if (_match[1] === CHAR_SLASH) {
          popStack(ELEMENT, tagName);
        } else {
          addChild(new Element(tagName, componentNamePattern.test(tagName)));
        }
        return _match[0];
      }
    }
  }, function (content) {
    var match = content.match(closingTagPattern);
    if (match) {
      if (htmlStack[RAW_LENGTH] === 1) {
        var element = last(htmlStack);
        element.divider = element[RAW_CHILDREN] ? element[RAW_CHILDREN][RAW_LENGTH] : 0;
        if (match[1] === CHAR_SLASH) {
          popStack(ELEMENT);
        }
        pop(htmlStack);
      }
      return match[0];
    }
  }, function (content) {
    if (htmlStack[RAW_LENGTH] === 1) {
      var _match2 = content.match(attributePattern);
      if (_match2) {
        var name = _match2[1];
        if (builtInDirectives[name]) {
          addChild(new Directive(camelCase(name)));
        } else if (startsWith(name, DIRECTIVE_EVENT_PREFIX)) {
          name = slice(name, DIRECTIVE_EVENT_PREFIX[RAW_LENGTH]);
          addChild(new Directive(DIRECTIVE_EVENT, camelCase(name)));
        } else if (startsWith(name, DIRECTIVE_CUSTOM_PREFIX)) {
          name = slice(name, DIRECTIVE_CUSTOM_PREFIX[RAW_LENGTH]);
          addChild(new Directive(camelCase(name)));
        } else {
          addChild(new Attribute(htmlStack[0].component ? camelCase(name) : name));
        }
        currentQuote = _match2[2];
        if (!currentQuote) {
          popStack(pop(htmlStack).type);
        }
        return _match2[0];
      }
    }
  }, function (content) {
    if (htmlStack[RAW_LENGTH] === 2) {
      var index = 0,
          currentChar = void 0,
          closed = void 0;
      while (currentChar = charAt(content, index)) {
        if (currentChar === currentQuote) {
          closed = TRUE;
          break;
        }
        index++;
      }
      var text = CHAR_BLANK;
      if (index) {
        text = slice(content, 0, index);
        addChild(new Text(text));
      }
      if (closed) {
        text += currentQuote;
        closed = pop(htmlStack);
        if (!closed[RAW_CHILDREN]) {
          closed.value = CHAR_BLANK;
        }
        popStack(closed.type);
      }
      return text;
    } else {
      var _match3 = content.match(openingTagPattern);
      if (_match3 && _match3.index) {
        content = slice(content, 0, _match3.index);
      }
      // 属性级别的空字符串是没有意义的
      // 比如 <div      class="xx">
      if (htmlStack[RAW_LENGTH] !== 1 || trim(content)) {
        addChild(new Text(content));
      }
      return content;
    }
  }];

  var delimiterParsers = [function (source, all) {
    if (startsWith(source, SYNTAX_EACH)) {
      source = slicePrefix(source, SYNTAX_EACH);
      var terms = source.replace(/\s+/g, CHAR_BLANK).split(CHAR_COLON);
      if (terms[0]) {
        return new Each(compile$1(trim(terms[0])), trim(terms[1]));
      }
      throwError('invalid each: ' + all);
    }
  }, function (source, all) {
    if (startsWith(source, SYNTAX_IMPORT)) {
      source = slicePrefix(source, SYNTAX_IMPORT);
      return source ? new Import(source) : throwError('invalid import: ' + all);
    }
  }, function (source, all) {
    if (startsWith(source, SYNTAX_PARTIAL)) {
      source = slicePrefix(source, SYNTAX_PARTIAL);
      return source ? new Partial(source) : throwError('invalid partial: ' + all);
    }
  }, function (source, all) {
    if (startsWith(source, SYNTAX_IF)) {
      source = slicePrefix(source, SYNTAX_IF);
      return source ? new If(compile$1(source)) : throwError('invalid if: ' + all);
    }
  }, function (source, all) {
    if (startsWith(source, SYNTAX_ELSE_IF)) {
      source = slicePrefix(source, SYNTAX_ELSE_IF);
      return source ? new ElseIf(compile$1(source)) : throwError('invalid else if: ' + all);
    }
  }, function (source) {
    if (startsWith(source, SYNTAX_ELSE)) {
      return new Else();
    }
  }, function (source, all) {
    if (startsWith(source, SYNTAX_SPREAD)) {
      source = slicePrefix(source, SYNTAX_SPREAD);
      return source ? new Spread(compile$1(source)) : throwError('invalid spread: ' + all);
    }
  }, function (source, all) {
    if (!SYNTAX_COMMENT.test(source)) {
      source = trim(source);
      return source ? new Expression(compile$1(source), !endsWith(all, '}}}')) : throwError('invalid expression: ' + all);
    }
  }];

  var parseHtml = function parseHtml(content) {
    if (content) {
      (function () {
        var tpl = content;
        while (tpl) {
          each(htmlParsers, function (parse, match) {
            match = parse(tpl);
            if (match) {
              tpl = slice(tpl, match[RAW_LENGTH]);
              return FALSE;
            }
          });
        }
        str = slice(str, content[RAW_LENGTH]);
      })();
    }
  };

  var parseDelimiter = function parseDelimiter(content, all) {
    if (content) {
      if (charAt(content) === CHAR_SLASH) {
        var name = slice(content, 1),
            type = name2Type[name];
        if (ifTypes[type]) {
          var node = pop(ifStack);
          if (node) {
            type = node.type;
          } else {
            throwError('if is not begined.');
          }
        }
        popStack(type);
      } else {
        each(delimiterParsers, function (parse, node) {
          node = parse(content, all);
          if (node) {
            addChild(node);
            return FALSE;
          }
        });
      }
    }
    str = slice(str, all[RAW_LENGTH]);
  };

  var str = content,
      match = void 0;

  // 干掉 html 注释
  str = str.replace(/<!--[\s\S]*?-->/g, function () {
    return CHAR_BLANK;
  });

  while (str) {
    match = str.match(delimiterPattern);
    if (match) {
      parseHtml(slice(str, 0, match.index));
      // 避免手误写成 {{{ name }}
      if (match[1][RAW_LENGTH] === match[3][RAW_LENGTH]) {
        parseDelimiter(match[2], match[0]);
      } else {
        throwError('invalid syntax: ' + match[0]);
      }
    } else {
      parseHtml(str);
    }
  }

  return compileCache[content] = nodeList;
}

/**
 * 把抽象语法树转成可执行的渲染函数
 *
 * @param {Array} ast
 * @return {Array}
 */
function convert(ast) {
  return ast.map(function (item) {
    return new Function('a', 'b', 'c', 'e', 'i', 'm', 'o', 'p', 's', 'x', 'y', 'z', 'return ' + item.stringify());
  });
}

/**
 * 渲染抽象语法树
 *
 * @param {Function} render 编译出来的渲染函数
 * @param {Function} getter 表达式求值函数
 * @param {Yox} instance 组件实例
 * @return {Object}
 */
function render(render, getter, instance) {

  /**
   *
   * 表达式求值，通常是从当前层级依次往上查找，如果到根层级还找不到，返回 undefined
   *
   * 层级只会因为 each 改变，其他语法不具有这个能力。
   *
   * 需要特殊处理的是，this 或 this.x 无需向上查找（由 getter 函数处理）
   *
   * 此外，如果表达式是单向绑定或双向绑定，无需收集到模板依赖中（由 getter 函数处理）
   *
   */

  var scope = {},
      keypath = CHAR_BLANK,
      keypathStack = [keypath, scope],
      values = void 0,
      currentElement = void 0,
      elementStack = [],
      pushElement = function pushElement(element) {
    currentElement = element;
    push(elementStack, element);
  },
      popElement = function popElement(lastElement) {
    currentElement = lastElement;
    pop(elementStack);
  },
      currentComponent = void 0,
      componentStack = [],
      pushComponent = function pushComponent(component) {
    currentComponent = component;
    push(componentStack, component);
  },
      popComponent = function popComponent(lastComponent) {
    currentComponent = lastComponent;
    pop(componentStack);
  },
      addAttr = function addAttr(name, value) {
    var attrs = currentElement.attrs || (currentElement.attrs = {});
    attrs[name] = value;
  },
      addDirective = function addDirective(name, modifier, value) {
    var directives = currentElement.directives || (currentElement.directives = {});
    return directives[join$1(name, modifier)] = {
      name: name,
      modifier: modifier,
      value: value,
      keypath: keypath,
      keypathStack: keypathStack
    };
  },
      addChild = function addChild(node) {
    var _currentElement = currentElement,
        lastChild = _currentElement.lastChild,
        children = _currentElement.children;


    if (isVnode(node)) {
      if (node.component) {
        node.parent = instance;
      }
      push(children, node);
      if (lastChild) {
        currentElement.lastChild = NULL;
      }
    } else if (isTextVnode(lastChild)) {
      lastChild.text += toString(node);
    } else {
      push(children, currentElement.lastChild = createTextVnode(node));
    }
  },
      addSlot = function addSlot(name, slot) {
    var slots = currentComponent.slots || (currentComponent.slots = {});
    if (slots[name]) {
      push(slots[name], slot);
    } else {
      slots[name] = slot;
    }
  },
      attrHandler = function attrHandler(node) {
    if (isDef(node)) {
      if (func(node)) {
        node();
      } else {
        var name = node.name,
            expr = node.expr;

        if (node.type === ATTRIBUTE) {
          var value = void 0;
          if (has$1(node, 'value')) {
            value = node.value;
          } else if (expr) {
            value = o(expr, expr.staticKeypath);
            if (expr.staticKeypath) {
              addDirective(DIRECTIVE_BINDING, name, expr.absoluteKeypath);
            }
          } else if (node[RAW_CHILDREN]) {
            value = getValue(node[RAW_CHILDREN]);
          } else {
            value = currentElement.component ? TRUE : name;
          }
          addAttr(name, value);
        } else {
          addDirective(name, node.modifier, name === DIRECTIVE_MODEL ? (o(expr), expr.absoluteKeypath) : node.value).expr = expr;
        }
      }
    }
  },
      childHandler = function childHandler(node) {
    if (isDef(node)) {
      if (func(node)) {
        node();
      } else if (values) {
        values[values[RAW_LENGTH]] = node;
      } else if (currentElement[RAW_CHILDREN]) {

        if (array(node)) {
          each(node, addChild);
        } else {
          addChild(node);
        }
      } else {
        attrHandler(node);
      }
    }
  },
      getValue = function getValue(generate) {
    values = [];
    generate();
    var value = values[RAW_LENGTH] > 1 ? join(values, '') : values[0];
    values = NULL;
    return value;
  },


  // 处理 children
  x = function x() {
    each(arguments, childHandler);
  },


  // 处理元素 attribute
  y = function y() {
    each(arguments, attrHandler);
  },


  // 处理 properties
  z = function z() {
    each(arguments, function (item) {
      var name = item.name,
          value = item.value;

      if (object(value)) {
        var expr = value;
        value = o(expr, expr.staticKeypath);
        if (expr.staticKeypath) {
          addDirective(DIRECTIVE_BINDING, name, expr.absoluteKeypath).prop = TRUE;
        }
      }
      var props = currentElement.props || (currentElement.props = {});
      props[name] = value;
    });
  },


  // template
  a = function a(name, childs) {

    if (currentComponent && (name = getValue(name))) {

      var lastElement = currentElement,
          children = [];

      pushElement({
        children: children
      });

      childs();

      addSlot(SLOT_DATA_PREFIX + name, children);

      popElement(lastElement);
    }
  },

  // slot
  b = function b(name) {
    name = getValue(name);
    if (name) {
      var result = getter(SLOT_DATA_PREFIX + name);
      return array(result) && result.length === 1 ? result[0] : result;
    }
  },


  // create
  c = function c(component, tag, childs, attrs, props, ref, transition, key) {

    var lastElement = currentElement,
        lastComponent = currentComponent;

    pushElement({
      component: component
    });

    if (component) {
      pushComponent(currentElement);
    }

    if (key) {
      key = getValue(key);
    }

    if (transition) {
      transition = getValue(transition);
    }

    if (ref) {
      ref = getValue(ref);
    }

    if (attrs) {
      attrs();
    }

    if (props) {
      props();
    }

    var children = void 0;
    if (childs) {
      children = currentElement[RAW_CHILDREN] = [];
      childs();
      if (component) {
        addSlot(SLOT_DATA_PREFIX + 'children', children);
        children = UNDEFINED;
      }
    }

    var result = snabbdom[component ? 'createComponentVnode' : 'createElementVnode'](tag, currentElement.attrs, currentElement.props, currentElement.directives, children, currentElement.slots, ref, key, instance, instance.transition(transition));

    popElement(lastElement);

    if (component) {
      popComponent(lastComponent);
    }

    return result;
  },

  // comment
  m = createCommentVnode,

  // each
  e = function e(expr, generate, index) {

    var value = o(expr),
        each$$1 = void 0;

    if (array(value)) {
      each$$1 = each;
    } else if (object(value)) {
      each$$1 = each$1;
    }

    if (each$$1) {

      var eachKeypath = expr.absoluteKeypath || join$1(keypath, expr.raw);

      each$$1(value, function (item, key) {

        var lastScope = scope,
            lastKeypath = keypath,
            lastKeypathStack = keypathStack;

        scope = {};
        keypath = join$1(eachKeypath, key);
        keypathStack = copy(keypathStack);
        push(keypathStack, keypath);
        push(keypathStack, scope);

        scope[SPECIAL_KEYPATH] = keypath;

        if (index) {
          scope[index] = key;
        }

        generate();

        scope = lastScope;
        keypath = lastKeypath;
        keypathStack = lastKeypathStack;
      });
    }
  },

  // output（e 被 each 占了..)
  o = function o(expr, binding) {
    return getter(expr, keypathStack, binding);
  },

  // spread
  s = function s(expr) {
    var staticKeypath = expr.staticKeypath,
        value = void 0;
    // 只能作用于 attribute 层级
    if (!currentElement[RAW_CHILDREN] && (value = o(expr, staticKeypath)) && object(value)) {
      var absoluteKeypath = expr.absoluteKeypath;

      each$1(value, function (value, key) {
        addAttr(key, value);
        if (isDef(staticKeypath)) {
          addDirective(DIRECTIVE_BINDING, key, absoluteKeypath ? absoluteKeypath + KEYPATH_SEPARATOR + key : key);
        }
      });
    }
  },
      localPartials = {},

  // partial
  p = function p(name, children) {
    localPartials[name] = children;
  },

  // import
  i = function i(name) {
    var lastElement = currentElement;
    pushElement({});
    if (localPartials[name]) {
      currentElement[RAW_CHILDREN] = [];
      localPartials[name]();
    } else {
      var partial = instance.importPartial(name);
      if (partial) {
        currentElement[RAW_CHILDREN] = partial.map(executeRender);
      }
    }
    if (currentElement[RAW_CHILDREN]) {
      var result = currentElement[RAW_CHILDREN];
      popElement(lastElement);
      return result;
    }
    fatal('"' + name + '" partial is not found.');
  },
      executeRender = function executeRender(render) {
    return render(a, b, c, e, i, m, o, p, s, x, y, z);
  };

  scope[SPECIAL_KEYPATH] = keypath;

  return executeRender(render);
}

var toNumber = function (str, defaultValue) {
  if (numeric(str)) {
    return +str;
  }
  return arguments[RAW_LENGTH] === 1 ? 0 : defaultValue;
};

var guid = 0;

/**
 * 对比新旧对象
 *
 * @param {?Object} newObject
 * @param {?Object} oldObject
 * @param {Function} callback
 */
function diffObject(newObject, oldObject, callback) {

  var keys$$1 = void 0;
  if (oldObject) {
    if (newObject) {
      keys$$1 = keys(extend({}, oldObject, newObject));
    } else {
      keys$$1 = keys(oldObject);
    }
  } else if (newObject) {
    keys$$1 = keys(newObject);
  }
  if (keys$$1) {
    each(keys$$1, function (key) {
      callback(newObject ? newObject[key] : UNDEFINED, oldObject ? oldObject[key] : UNDEFINED, key);
    });
  }
}

/**
 * 对比新旧数组
 *
 * @param {?Array} newArray
 * @param {?Array} oldArray
 * @param {Function} callback
 */
function diffArray(newArray, oldArray, callback) {

  if (newArray || oldArray) {

    var newLength = newArray ? newArray[RAW_LENGTH] : 0;
    var oldLength = oldArray ? oldArray[RAW_LENGTH] : 0;

    callback(newArray ? newLength : UNDEFINED, oldArray ? oldLength : UNDEFINED, RAW_LENGTH);

    for (var i = 0, length = Math.max(newLength, oldLength); i < length; i++) {
      callback(newArray ? newArray[i] : UNDEFINED, oldArray ? oldArray[i] : UNDEFINED, i);
    }
  }
}

var patternCache = {};

/**
 * 模糊匹配 Keypath
 *
 * @param {string} keypath
 * @param {string} pattern
 * @return {boolean}
 */
function matchKeypath(keypath, pattern) {
  var cache = patternCache[pattern];
  if (!cache) {
    cache = pattern.replace(/\./g, '\\.').replace(/\*\*/g, '([\.\\w]+?)').replace(/\*/g, '(\\w+)');
    cache = patternCache[pattern] = new RegExp('^' + cache + '$');
  }
  return cache.test(keypath);
}

/**
 * 是否模糊匹配
 *
 * @param {string} keypath
 * @return {boolean}
 */
function isFuzzyKeypath(keypath) {
  return has$2(keypath, '*');
}

/**
 * 从 getter 对象的所有 key 中，选择和 keypath 最匹配的那一个
 *
 * @param {Array.<string>} sorted
 * @param {string} keypath
 * @return {Object}
 */
function matchBest(sorted, keypath) {

  var result = {};

  each(sorted, function (prefix) {
    var length = startsWith$1(keypath, prefix);
    if (length !== FALSE) {
      result.name = prefix;
      result.prop = slice(keypath, length);
      return FALSE;
    }
  });

  return result;
}

var Computed = function () {
  function Computed(keypath, observer) {
    classCallCheck(this, Computed);


    var instance = this;

    instance.id = ++guid;
    instance.keypath = keypath;
    instance.observer = observer;
    instance.deps = [];

    instance.update = function (oldValue, key, addChange) {

      var value = instance.value,
          changes = instance.changes || (instance.changes = {});

      // 当前计算属性的依赖发生变化
      if (!has$1(changes, key)) {
        changes[key] = oldValue;
      }

      // 把依赖和计算属性自身注册到下次可能的变化中
      observer.onChange(oldValue, key);
      observer.onChange(value, keypath);

      // 当前计算属性是否是其他计算属性的依赖
      var diff = function diff() {
        var newValue = instance.get();
        if (newValue !== value) {
          addChange(newValue, value, keypath);
          return FALSE;
        }
      };

      each$1(observer.computed, function (computed) {
        if (computed.keypath !== keypath) {
          var deps = computed.deps;

          if (has(deps, keypath)) {
            return diff();
          } else {
            for (var i = 0, len = deps.length; i < len; i++) {
              if (startsWith$1(deps[i], keypath)) {
                return diff();
              }
            }
          }
        }
      });
    };
  }

  Computed.prototype.get = function get$$1(force) {
    var value = this.value,
        cache = this.cache;

    if (cache === FALSE) {
      value = this.value = this.getter();
    }
    // 减少取值频率，尤其是处理复杂的计算规则
    else if (force || this.isDirty()) {
        var lastComputed = Observer.computed;
        Observer.computed = this;
        value = this.value = this.getter();
        Observer.computed = lastComputed;
        this.changes = NULL;
      }
    return value;
  };

  Computed.prototype.hasDep = function hasDep(dep) {
    return has(this.deps, dep);
  };

  Computed.prototype.addDep = function addDep(dep) {
    if (!this.hasDep(dep)) {
      push(this.deps, dep);
      this.observer.watch(dep, this.update, FALSE, this);
    }
  };

  Computed.prototype.removeDep = function removeDep(dep) {
    if (this.hasDep(dep)) {
      remove(this.deps, dep);
      this.observer.unwatch(dep, this.update);
    }
  };

  Computed.prototype.clearDep = function clearDep() {
    var instance = this;
    each(instance.deps, function (dep) {
      instance.removeDep(dep);
    }, TRUE);
  };

  Computed.prototype.isDirty = function isDirty() {
    var observer = this.observer,
        changes = this.changes,
        result = void 0;

    if (changes) {
      for (var key in changes) {
        if (changes[key] !== observer.get(key)) {
          return TRUE;
        }
      }
    }
    // undefined 表示第一次执行，要返回 true
    return !isDef(changes);
  };

  return Computed;
}();

var Observer = function () {

  /**
   * @param {Object} options
   * @property {Object} options.data
   * @property {?Object} options.computed
   * @property {?*} options.context 执行 watcher 函数的 this 指向
   */
  function Observer(options) {
    classCallCheck(this, Observer);


    var instance = this;

    instance.data = options.data || {};
    instance.context = options.context || instance;
    instance.emitter = new Emitter();
    instance.asyncEmitter = new Emitter();

    if (options.computed) {
      each$1(options.computed, function (item, keypath) {
        instance.addComputed(keypath, item);
      });
    }
  }

  Observer.prototype.onChange = function onChange(oldValue, keypath) {

    var instance = this,
        changes = startsWith(keypath, '$') ? instance.$changes || (instance.$changes = {}) : instance.changes || (instance.changes = {});

    if (!has$1(changes, keypath)) {
      changes[keypath] = oldValue;
    }

    if (!instance.pending) {
      instance.pending = TRUE;
      instance.nextTick(function () {
        if (instance.pending) {
          var _changes = instance.changes,
              $changes = instance.$changes,
              asyncEmitter = instance.asyncEmitter;


          instance.pending = instance.changes = instance.$changes = NULL;

          var listenerKeys = keys(asyncEmitter.listeners);

          var eachChange = function eachChange(oldValue, keypath) {
            var newValue = instance.get(keypath);
            if (newValue !== oldValue) {
              var args = [newValue, oldValue, keypath];
              asyncEmitter.fire(keypath, args);
              each(listenerKeys, function (key) {
                if (isFuzzyKeypath(key) && matchKeypath(keypath, key)) {
                  asyncEmitter.fire(key, args);
                }
              });
            }
          };

          $changes && each$1($changes, eachChange);
          _changes && each$1(_changes, eachChange);
        }
      });
    }
  };

  /**
   * 获取数据
   *
   * @param {string} keypath
   * @param {?*} defaultValue
   * @return {?*}
   */


  Observer.prototype.get = function get$$1(keypath, defaultValue) {

    if (!string(keypath) || isFuzzyKeypath(keypath)) {
      return;
    }

    var instance = this,
        result = void 0;

    // 传入 '' 获取整个 data
    if (keypath === CHAR_BLANK) {
      return instance.data;
    }

    keypath = normalize(keypath);

    // 调用 get 时，外面想要获取依赖必须设置是谁在收集依赖
    // 如果没设置，则跳过依赖收集
    if (Observer.computed) {
      Observer.computed.addDep(keypath);
    }

    var computed = instance.computed,
        reversedComputedKeys = instance.reversedComputedKeys;

    if (computed) {
      var target = computed[keypath];
      if (target) {
        return target.get();
      }

      var _matchBest = matchBest(reversedComputedKeys, keypath),
          name = _matchBest.name,
          prop = _matchBest.prop;

      if (name && prop) {
        target = instance.computed[name].get();
        if (has$1(target, prop)) {
          return target[prop];
        } else if (target != NULL) {
          result = get$1(target, prop);
        }
      }
    }

    if (!result) {
      result = get$1(instance.data, keypath);
    }

    return result ? result.value : defaultValue;
  };

  /**
   * 更新数据
   *
   * @param {string|Object} keypath
   * @param {?*} value
   */


  Observer.prototype.set = function set$$1(keypath, value) {

    var instance = this;

    var emitter = instance.emitter;


    var listenKeys = keys(emitter.listeners);

    var changes = [];

    var addFuzzyChange = function addFuzzyChange(fuzzyKeypaths, newValue, oldValue, key) {
      if (newValue !== oldValue) {

        each(fuzzyKeypaths, function (fuzzyKeypath) {
          if (matchKeypath(key, fuzzyKeypath)) {
            changes.push(fuzzyKeypath, oldValue, key);
          }
        });

        // 我们认为 $ 开头的变量是不可递归的
        // 比如浏览器中常见的 $0 表示当前选中元素
        // DOM 元素是不能递归的
        if (startsWith(key, '$')) {
          return;
        }

        var newIs = string(newValue),
            oldIs = string(oldValue);
        if (newIs || oldIs) {
          addFuzzyChange(fuzzyKeypaths, newIs ? newValue[RAW_LENGTH] : UNDEFINED, oldIs ? oldValue[RAW_LENGTH] : UNDEFINED, join$1(key, RAW_LENGTH));
        } else {
          newIs = object(newValue), oldIs = object(oldValue);
          if (newIs || oldIs) {
            diffObject(newIs && newValue, oldIs && oldValue, function (newValue, oldValue, prop) {
              addFuzzyChange(fuzzyKeypaths, newValue, oldValue, join$1(key, prop));
            });
          } else {
            diffArray(array(newValue) && newValue, array(oldValue) && oldValue, function (newValue, oldValue, index) {
              addFuzzyChange(fuzzyKeypaths, newValue, oldValue, join$1(key, index));
            });
          }
        }
      }
    };

    var getValue = function getValue(value, key) {
      if (value == NULL) {
        return value;
      } else {
        var result = get$1(value, key);
        if (result) {
          return result.value;
        }
      }
    };

    var addChange = function addChange(newValue, oldValue, keypath) {

      var fuzzyKeypaths = [];

      each(listenKeys, function (listenKey) {
        if (isFuzzyKeypath(listenKey)) {
          if (matchKeypath(keypath, listenKey)) {
            changes.push(listenKey, oldValue, keypath);
          } else {
            push(fuzzyKeypaths, listenKey);
          }
        } else {
          var length = startsWith$1(listenKey, keypath);
          if (length) {

            var listenNewValue = void 0,
                listenOldValue = void 0;
            if (listenKey === keypath) {
              listenNewValue = newValue;
              listenOldValue = oldValue;
            } else {
              var propName = slice(listenKey, length);
              listenNewValue = getValue(newValue, propName);
              listenOldValue = getValue(oldValue, propName);
            }

            if (listenNewValue !== listenOldValue) {
              changes.push(listenKey, listenOldValue, listenKey);
            }
          }
        }
      });

      // 存在模糊匹配的需求
      // 必须对数据进行递归
      // 性能确实会慢一些，但是很好用啊，几乎可以监听所有的数据
      if (fuzzyKeypaths[RAW_LENGTH]) {
        addFuzzyChange(fuzzyKeypaths, newValue, oldValue, keypath);
      }
    };

    var setValue = function setValue(value, keypath) {

      keypath = normalize(keypath);

      var oldValue = instance.get(keypath);
      if (value === oldValue) {
        return;
      }

      addChange(value, oldValue, keypath);

      var computed = instance.computed,
          reversedComputedKeys = instance.reversedComputedKeys;

      if (computed) {
        var target = computed[keypath];
        if (target) {
          // 如果强制给没有 set 方法的计算属性设值，忽略
          if (target.set) {
            target.set(value);
          }
          return;
        }

        var _matchBest2 = matchBest(reversedComputedKeys, keypath),
            name = _matchBest2.name,
            prop = _matchBest2.prop;

        if (name && prop) {
          target = computed[name].get();
          if (!primitive(target)) {
            set$1(target, prop, value);
          }
          return;
        }
      }
      set$1(instance.data, keypath, value);
    };

    if (string(keypath)) {
      setValue(value, keypath);
    } else if (object(keypath)) {
      each$1(keypath, setValue);
    }

    for (var i = 0; i < changes[RAW_LENGTH]; i += 3) {
      emitter.fire(changes[i], [changes[i + 1], changes[i + 2], addChange]);
    }
  };

  /**
   * 添加计算属性
   *
   * @param {string} keypath
   * @param {Function|Object} computed
   */


  Observer.prototype.addComputed = function addComputed(keypath, computed) {

    var instance = this,
        cache = TRUE,
        get$$1 = void 0,
        set$$1 = void 0,
        deps = void 0;

    if (func(computed)) {
      get$$1 = computed;
    } else if (object(computed)) {
      if (boolean(computed.cache)) {
        cache = computed.cache;
      }
      if (func(computed.get)) {
        get$$1 = computed.get;
      }
      if (func(computed.set)) {
        set$$1 = computed.set;
      }
      if (computed.deps) {
        deps = computed.deps;
      }
    }

    if (get$$1 || set$$1) {

      var _computed = new Computed(keypath, instance);

      if (get$$1) {
        var hasDeps = array(deps) && deps[RAW_LENGTH] > 0;
        if (hasDeps) {
          each(deps, function (dep) {
            _computed.addDep(dep);
          });
        }
        _computed.cache = cache;
        _computed.getter = function () {
          if (cache) {
            if (hasDeps) {
              Observer.computed = NULL;
            } else {
              _computed.clearDep();
            }
          }
          return execute(get$$1, instance.context);
        };
      }

      if (set$$1) {
        _computed.set = function (value) {
          set$$1.call(instance.context, value);
        };
      }

      if (!instance.computed) {
        instance.computed = {};
      }

      instance.computed[keypath] = _computed;

      instance.reversedComputedKeys = sort(instance.computed, TRUE);

      return _computed;
    }
  };

  /**
   * 取反 keypath 对应的数据
   *
   * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
   *
   * @param {string} keypath
   * @return {boolean} 取反后的布尔值
   */


  Observer.prototype.toggle = function toggle(keypath) {
    var value = !this.get(keypath);
    this.set(keypath, value);
    return value;
  };

  /**
   * 递增 keypath 对应的数据
   *
   * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
   *
   * @param {string} keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
   * @param {?number} step 步进值，默认是 1
   * @param {?number} min 可以递增到的最小值，默认不限制
   * @return {number} 返回递增后的值
   */


  Observer.prototype.increase = function increase(keypath, step, max) {
    var value = toNumber(this.get(keypath), 0) + (numeric(step) ? step : 1);
    if (!numeric(max) || value <= max) {
      this.set(keypath, value);
    }
    return value;
  };

  /**
   * 递减 keypath 对应的数据
   *
   * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
   *
   * @param {string} keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
   * @param {?number} step 步进值，默认是 1
   * @param {?number} min 可以递减到的最小值，默认不限制
   * @return {number} 返回递减后的值
   */


  Observer.prototype.decrease = function decrease(keypath, step, min) {
    var value = toNumber(this.get(keypath), 0) - (numeric(step) ? step : 1);
    if (!numeric(min) || value >= min) {
      this.set(keypath, value);
    }
    return value;
  };

  /**
   * 在数组指定位置插入元素
   *
   * @param {string} keypath
   * @param {*} item
   * @param {number} index
   * @return {?boolean} 是否插入成功
   */


  Observer.prototype.insert = function insert(keypath, item, index) {

    var list = this.get(keypath);
    if (!array(list)) {
      list = [];
    } else {
      list = copy(list);
    }

    var length = list[RAW_LENGTH];
    if (index === TRUE || index === length) {
      list.push(item);
    } else if (index === FALSE || index === 0) {
      list.unshift(item);
    } else if (index > 0 && index < length) {
      list.splice(index, 0, item);
    } else {
      return;
    }

    this.set(keypath, list);

    return TRUE;
  };

  /**
   * 通过索引移除数组中的元素
   *
   * @param {string} keypath
   * @param {number} index
   * @return {?boolean} 是否移除成功
   */


  Observer.prototype.removeAt = function removeAt(keypath, index) {
    var list = this.get(keypath);
    if (array(list) && index >= 0 && index < list[RAW_LENGTH]) {
      list = copy(list);
      list.splice(index, 1);
      this.set(keypath, list);
      return TRUE;
    }
  };

  /**
   * 直接移除数组中的元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否移除成功
   */


  Observer.prototype.remove = function remove$$1(keypath, item) {
    var list = this.get(keypath);
    if (array(list)) {
      list = copy(list);
      if (remove(list, item)) {
        this.set(keypath, list);
        return TRUE;
      }
    }
  };

  Observer.prototype.nextTick = function nextTick(fn) {
    if (func(fn)) {
      var instance = this;
      append(function () {
        // 确保没销毁
        if (instance.data) {
          fn();
        }
      });
    }
  };

  Observer.prototype.nextRun = function nextRun() {
    run();
  };

  /**
   * 销毁
   */


  Observer.prototype.destroy = function destroy() {
    this.emitter.off();
    this.asyncEmitter.off();
    clear(this);
  };

  return Observer;
}();

extend(Observer.prototype, {

  /**
   * 监听数据变化
   *
   * @param {string|Object} keypath
   * @param {?Function} watcher
   * @param {?boolean} sync
   */
  watch: createWatch('on'),

  /**
   * 监听一次数据变化
   *
   * @param {string|Object} keypath
   * @param {?Function} watcher
   * @param {?boolean} sync
   */
  watchOnce: createWatch('once'),

  /**
   * 取消监听数据变化
   *
   * @param {string|Object} keypath
   * @param {Function} watcher
   */
  unwatch: function unwatch(keypath, watcher) {
    var emitter = this.emitter,
        asyncEmitter = this.asyncEmitter;

    if (string(keypath)) {
      emitter.off(keypath, watcher);
      asyncEmitter.off(keypath, watcher);
    } else if (object(keypath)) {
      each$1(keypath, function (watcher, keypath) {
        emitter.off(keypath, watcher);
        asyncEmitter.off(keypath, watcher);
      });
    }
  }

});

function createWatch(action) {

  var watch = function watch(instance, keypath, func$$1, sync, computed) {
    var context = instance.context;


    instance.emitter[action](keypath, {
      func: computed ? func$$1 : instance.onChange,
      context: computed ? computed : instance
    });

    if (!computed) {
      instance.asyncEmitter[action](keypath, {
        func: func$$1,
        context: context
      });
    }

    if (sync) {
      execute(func$$1, context, [instance.get(keypath), UNDEFINED, keypath]);
    }
  };

  return function (keypath, watcher, sync, computed) {

    var instance = this;

    if (string(keypath)) {
      watch(instance, keypath, watcher, sync, computed);
    } else {
      if (watcher === TRUE) {
        sync = watcher;
      }
      each$1(keypath, function (value, keypath) {
        var watcher = value,
            itemSync = sync;
        if (object(value)) {
          watcher = value.watcher;
          if (boolean(value.sync)) {
            itemSync = value.sync;
          }
        }
        watch(instance, keypath, watcher, itemSync, computed);
      });
    }
  };
}

/**
 * html 标签
 *
 * @type {RegExp}
 */
var tag = /<[^>]+>/;

/**
 * 选择器
 *
 * @type {RegExp}
 */
var selector = /^[#.][-\w+]+$/;

var attr2Prop = {};
attr2Prop['for'] = 'htmlFor';
attr2Prop['value'] = 'value';
attr2Prop['class'] = 'className';
attr2Prop['style'] = 'style.cssText';
attr2Prop['nohref'] = 'noHref';
attr2Prop['noshade'] = 'noShade';
attr2Prop['noresize'] = 'noResize';
attr2Prop['readonly'] = 'readOnly';
attr2Prop['defaultchecked'] = 'defaultChecked';
attr2Prop['defaultmuted'] = 'defaultMuted';
attr2Prop['defaultselected'] = 'defaultSelected';

var svgTags = toObject(('svg,g,defs,desc,metadata,symbol,use,' + 'image,path,rect,circle,line,ellipse,polyline,polygon,' + 'text,tspan,tref,textpath,' + 'marker,pattern,clippath,mask,filter,cursor,view,animate,' + 'font,font-face,glyph,missing-glyph').split(','));

var namespaces = {
  svg: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink'
};

function createElement(tagName) {
  return svgTags[tagName] ? doc.createElementNS(namespaces.svg, tagName) : doc.createElement(tagName);
}

function createText(text) {
  return doc.createTextNode(text || CHAR_BLANK);
}

function createComment(text) {
  return doc.createComment(text || CHAR_BLANK);
}

function createEvent(event) {
  return event;
}

function isElement(node) {
  return node.nodeType === 1;
}

function setProp(node, name, value) {
  set$1(node, name, value, FALSE);
}

function removeProp(node, name) {
  setProp(node, name, string(node[name]) ? CHAR_BLANK : NULL);
}

function setAttr(node, name, value) {
  var propName = attr2Prop[name];
  var isBoolean = boolean(node[propName || name]);
  if (isBoolean) {
    value = value === TRUE || value === RAW_TRUE || value === name;
  } else if (value == NULL) {
    value = CHAR_BLANK;
  }
  // 比如 readonly
  if (propName || isBoolean) {
    setProp(node, propName || name, value);
  } else {
    if (has$2(name, CHAR_COLON)) {
      var parts = name.split(CHAR_COLON),
          ns = namespaces[parts[0]];
      if (ns) {
        node.setAttributeNS(ns, parts[1], value);
        return;
      }
    }
    node.setAttribute(name, value);
  }
}

function removeAttr(node, name) {
  if (attr2Prop[name]) {
    removeProp(node, attr2Prop[name]);
  } else if (boolean(node[name])) {
    removeProp(node, name);
  } else {
    if (has$2(name, CHAR_COLON)) {
      var parts = name.split(CHAR_COLON),
          ns = namespaces[parts[0]];
      if (ns) {
        node.removeAttributeNS(ns, parts[1]);
        return;
      }
    }
    node.removeAttribute(name);
  }
}

function before(parentNode, newNode, referenceNode) {
  if (referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  } else {
    append$1(parentNode, newNode);
  }
}

function append$1(parentNode, child) {
  parentNode.appendChild(child);
}

function replace(parentNode, newNode, oldNode) {
  parentNode.replaceChild(newNode, oldNode);
}

function remove$1(parentNode, child) {
  parentNode.removeChild(child);
}

function parent(node) {
  return node.parentNode;
}

function next(node) {
  return node.nextSibling;
}

function tag$1(node) {
  var tagName = node.tagName;

  return falsy$1(tagName) ? CHAR_BLANK : tagName.toLowerCase();
}

function children(node) {
  return node.childNodes;
}

function text(node, content) {
  return content == NULL ? node.nodeValue : node.nodeValue = content;
}

function html(node, content) {
  return content == NULL ? node.innerHTML : node.innerHTML = content;
}

function component$1(element, component) {
  return isDef(component) ? element.component = component : element.component;
}

function find(selector, context) {
  return (context || doc).querySelector(selector);
}

function on$1(element, type, listener) {
  element.addEventListener(type, listener, FALSE);
}

function off(element, type, listener) {
  element.removeEventListener(type, listener, FALSE);
}

function addClass(element, className) {
  var classList = element.classList;

  if (classList) {
    classList.add(className);
  } else {
    classList = element.className.split(CHAR_WHITESPACE);
    if (!has(classList, className)) {
      push(classList, className);
      element.className = join(classList, CHAR_WHITESPACE);
    }
  }
}

function removeClass(element, className) {
  var classList = element.classList;

  if (classList) {
    classList.remove(className);
  } else {
    classList = element.className.split(CHAR_WHITESPACE);
    if (has(classList, className)) {
      remove(classList, className);
      element.className = join(classList, CHAR_WHITESPACE);
    }
  }
}

var domApi = Object.freeze({
    createElement: createElement,
    createText: createText,
    createComment: createComment,
    createEvent: createEvent,
    isElement: isElement,
    setProp: setProp,
    removeProp: removeProp,
    setAttr: setAttr,
    removeAttr: removeAttr,
    before: before,
    append: append$1,
    replace: replace,
    remove: remove$1,
    parent: parent,
    next: next,
    tag: tag$1,
    children: children,
    text: text,
    html: html,
    component: component$1,
    find: find,
    on: on$1,
    off: off,
    addClass: addClass,
    removeClass: removeClass
});

/**
 * tap 事件
 *
 * 非常有用的抽象事件，比如 pc 端是 click 事件，移动端是 touchend 事件
 *
 * 这样只需 on-tap="handler" 就可以完美兼容各端
 *
 * 框架未实现此事件，通过 Yox.dom.specialEvents 提供给外部扩展
 *
 * @type {string}
 */
var TAP = 'tap';

/**
 * 点击事件
 *
 * @type {string}
 */
var CLICK = 'click';

/**
 * 输入事件
 *
 * @type {string}
 */
var INPUT = 'input';

/**
 * 表单控件的修改事件
 *
 * @type {string}
 */
var CHANGE = 'change';

/**
 * 跟输入事件配套使用的事件
 *
 * @type {string}
 */
var COMPOSITION_START = 'compositionstart';

/**
 * 跟输入事件配套使用的事件
 *
 * @type {string}
 */
var COMPOSITION_END = 'compositionend';

/**
 * IE 模拟输入事件的特殊事件
 *
 * @type {string}
 */

var api = copy(domApi);

// import * as oldApi from './oldApi'
//
// if (env.doc && !env.doc.addEventListener) {
//   object.extend(api, oldApi)
// }

var _on = api.on;
var _off = api.off;

/**
 * 特殊事件，外部可扩展
 *
 * @type {Object}
 */

api.specialEvents = {
  input: {
    on: function on$$1(el, listener) {
      var locked = FALSE;
      api.on(el, COMPOSITION_START, listener[COMPOSITION_START] = function () {
        locked = TRUE;
      });
      api.on(el, COMPOSITION_END, listener[COMPOSITION_END] = function (e) {
        locked = FALSE;
        listener(e, INPUT);
      });
      _on(el, INPUT, listener[INPUT] = function (e) {
        if (!locked) {
          listener(e);
        }
      });
    },
    off: function off$$1(el, listener) {
      api.off(el, COMPOSITION_START, listener[COMPOSITION_START]);
      api.off(el, COMPOSITION_END, listener[COMPOSITION_END]);
      _off(el, INPUT, listener[INPUT]);
      listener[COMPOSITION_START] = listener[COMPOSITION_END] = listener[INPUT] = NULL;
    }
  }
};

var EMITTER_KEY = '_emitter';

/**
 * 绑定事件
 *
 * @param {HTMLElement} element
 * @param {string} type
 * @param {Function} listener
 * @param {?*} context
 */
api.on = function (element, type, listener, context) {
  var emitter = element[EMITTER_KEY] || (element[EMITTER_KEY] = new Emitter());
  if (!emitter.has(type)) {
    var nativeListener = function nativeListener(e, type) {
      if (!Event.is(e)) {
        e = new Event(api.createEvent(e, element));
      }
      if (type) {
        e.type = type;
      }
      emitter.fire(e.type, e, context);
    };
    emitter[type] = nativeListener;
    var special = api.specialEvents[type];
    if (special) {
      special.on(element, nativeListener);
    } else {
      _on(element, type, nativeListener);
    }
  }
  emitter.on(type, listener);
};

/**
 * 解绑事件
 *
 * @param {HTMLElement} element
 * @param {string} type
 * @param {Function} listener
 *
 */
api.off = function (element, type, listener) {
  var emitter = element[EMITTER_KEY];
  var types = keys(emitter.listeners);
  // emitter 会根据 type 和 listener 参数进行适当的删除
  emitter.off(type, listener);
  // 根据 emitter 的删除结果来操作这里的事件 listener
  each(types, function (type, index) {
    if (emitter[type] && !emitter.has(type)) {
      var nativeListener = emitter[type];
      var special = api.specialEvents[type];
      if (special) {
        special.off(element, nativeListener);
      } else {
        _off(element, type, nativeListener);
      }
      delete emitter[type];
      types.splice(index, 1);
    }
  }, TRUE);
  if (!types[RAW_LENGTH]) {
    api.removeProp(element, EMITTER_KEY);
  }
};

/**
 * 节流调用
 *
 * @param {Function} fn 需要节制调用的函数
 * @param {number} delay 调用的时间间隔
 * @param {?boolean} sync 是否立即触发
 * @return {Function}
 */
var debounce = function (fn, delay, sync) {

  var timer = void 0;

  return function () {

    if (!timer) {

      var args = toArray$1(arguments);
      if (sync) {
        execute(fn, NULL, args);
      }

      timer = setTimeout(function () {
        timer = NULL;
        if (!sync) {
          execute(fn, NULL, args);
        }
      }, delay);
    }
  };
};

// 避免连续多次点击，主要用于提交表单场景
// 移动端的 tap 事件可自行在业务层打补丁实现
var syncTypes = [CLICK, TAP];

var bindEvent = function (_ref) {
  var el = _ref.el,
      node = _ref.node,
      instance = _ref.instance,
      component = _ref.component,
      directives = _ref.directives,
      type = _ref.type,
      listener = _ref.listener;


  if (!type) {
    type = node.modifier;
  }

  if (!listener) {
    listener = instance.compileDirective(node);
  }

  if (type && listener) {
    var lazy = directives.lazy;

    if (lazy) {
      var value = lazy.value;

      if (numeric(value) && value >= 0) {
        listener = debounce(listener, value, has(syncTypes, type));
      } else if (type === INPUT) {
        type = CHANGE;
      }
    }

    if (component) {
      component.on(type, listener);
      return function () {
        component.off(type, listener);
      };
    } else {
      api.on(el, type, listener);
      return function () {
        api.off(el, type, listener);
      };
    }
  }
};

var VALUE = 'value';

var inputControl = {
  set: function set$$1(el, keypath, instance) {
    var value = toString(instance.get(keypath));
    if (value !== el.value) {
      el.value = value;
    }
  },
  sync: function sync(el, keypath, instance) {
    instance.set(keypath, el.value);
  },

  attr: VALUE
};

var selectControl = {
  set: function set$$1(el, keypath, instance) {
    var value = toString(instance.get(keypath));
    var options = el.options,
        selectedIndex = el.selectedIndex;

    if (selectedIndex >= 0) {
      var selectedOption = options[selectedIndex];
      if (selectedOption) {
        var newValue = isDef(selectedOption.value) ? selectedOption.value : selectedOption.text;
        if (value !== newValue) {
          each(options, function (option, index) {
            var optionValue = isDef(option.value) ? option.value : option.text;
            if (optionValue === newValue) {
              el.selectedIndex = index;
              return FALSE;
            }
          });
        }
      }
    }
  },
  sync: function sync(el, keypath, instance) {
    var selectedOption = el.options[el.selectedIndex];
    instance.set(keypath, isDef(selectedOption.value) ? selectedOption.value : selectedOption.text);
  }
};

var radioControl = {
  set: function set$$1(el, keypath, instance) {
    el.checked = el.value === toString(instance.get(keypath));
  },
  sync: function sync(el, keypath, instance) {
    if (el.checked) {
      instance.set(keypath, el.value);
    }
  },

  attr: 'checked'
};

var checkboxControl = {
  set: function set$$1(el, keypath, instance) {
    var value = instance.get(keypath);
    el.checked = array(value) ? has(value, el.value, FALSE) : boolean(value) ? value : !!value;
  },
  sync: function sync(el, keypath, instance) {
    var value = instance.get(keypath);
    if (array(value)) {
      if (el.checked) {
        instance.append(keypath, el.value);
      } else {
        instance.removeAt(keypath, indexOf(value, el.value, FALSE));
      }
    } else {
      instance.set(keypath, el.checked);
    }
  },

  attr: 'checked'
};

var componentControl = {
  set: function set$$1(component, keypath, instance) {
    component.set(component.$model, instance.get(keypath));
  },
  sync: function sync(component, keypath, instance) {
    instance.set(keypath, component.get(component.$model));
  }
};

var specialControls = {
  radio: radioControl,
  checkbox: checkboxControl,
  select: selectControl
};

var model = function (_ref) {
  var el = _ref.el,
      node = _ref.node,
      instance = _ref.instance,
      directives = _ref.directives,
      attrs = _ref.attrs,
      component = _ref.component;


  var keypath = node.value;
  if (keypath) {

    var set$$1 = function set$$1() {
      if (control) {
        control.set(target, keypath, instance);
      }
    };
    var sync = function sync() {
      control.sync(target, keypath, instance);
    };

    var target = void 0,
        control = void 0,
        unbindTarget = void 0,
        unbindInstance = void 0;
    if (component) {

      target = component;
      control = componentControl;

      var field = component.$model = component.$options.model || VALUE;

      if (!has$1(attrs, field)) {
        instance.nextTick(set$$1);
      }

      component.watch(field, sync);
      unbindTarget = function unbindTarget() {
        component.unwatch(field, sync);
        delete component.$model;
      };
    } else {

      target = el;
      control = specialControls[el.type] || specialControls[api.tag(el)];

      var type = CHANGE;
      if (!control) {
        control = inputControl;
        type = INPUT;
      }

      if (!control.attr || !has$1(attrs, control.attr)) {
        set$$1();
      }

      unbindTarget = bindEvent({
        el: el,
        node: node,
        instance: instance,
        directives: directives,
        type: type,
        listener: sync
      });
    }

    prepend(function () {
      if (set$$1) {
        instance.watch(keypath, set$$1);
        unbindInstance = function unbindInstance() {
          instance.unwatch(keypath, set$$1);
        };
      }
    });

    return function () {
      execute(unbindTarget);
      execute(unbindInstance);
      set$$1 = NULL;
    };
  }
};

var binding = function (_ref) {
  var el = _ref.el,
      node = _ref.node,
      instance = _ref.instance,
      component = _ref.component;


  var keypath = node.value;

  // 比如写了个 <div>{{name}}</div>
  // 删了数据却忘了删模板，无视之
  if (keypath) {
    var set = function set(value) {
      var name = node.modifier;
      if (component) {
        component.set(name, value);
      } else {
        api[node.prop ? 'setProp' : 'setAttr'](el, name, value);
      }
    };

    // 同批次的修改
    // 不应该响应 watch
    // 因为模板已经全量更新
    prepend(function () {
      if (set) {
        instance.watch(keypath, set);
      }
    });

    return function () {
      instance.unwatch(keypath, set);
      set = NULL;
    };
  }
};

// 组件是否存在某个 slot
var hasSlot = function (name) {
  return this.get(SLOT_DATA_PREFIX + name, UNDEFINED) !== UNDEFINED;
};

var patch = init(api);

var TEMPLATE = 'template';
var TEMPLATE_COMPUTED = '$' + TEMPLATE;

var Yox = function () {
  function Yox(options) {
    classCallCheck(this, Yox);


    var instance = this;

    if (!object(options)) {
      options = {};
    }

    // 如果不绑着，其他方法调不到钩子
    instance.$options = options;

    execute(options[HOOK_BEFORE_CREATE], instance, options);

    var _options = options,
        el = _options.el,
        data = _options.data,
        props = _options.props,
        parent = _options.parent,
        replace = _options.replace,
        computed = _options.computed,
        template = _options.template,
        transitions = _options.transitions,
        components = _options.components,
        directives = _options.directives,
        partials = _options.partials,
        filters = _options.filters,
        slots = _options.slots,
        events = _options.events,
        methods = _options.methods,
        watchers = _options.watchers,
        propTypes = _options.propTypes,
        extensions = _options.extensions;


    extensions && extend(instance, extensions);

    var source = void 0;
    if (object(propTypes)) {
      instance.$propTypes = propTypes;
      source = instance.validate(props || {}, propTypes);
    } else {
      source = props || {};
    }

    if (slots) {
      extend(source, slots);
    }

    // 如果传了 props，则 data 应该是个 function
    if (props && object(data)) {
      warn('"data" option expected to be a function.');
    }

    // 先放 props
    // 当 data 是函数时，可以通过 this.get() 获取到外部数据
    instance.$observer = new Observer({
      context: instance,
      data: source,
      computed: computed
    });

    // 后放 data
    var extend$$1 = func(data) ? execute(data, instance, options) : data;
    if (object(extend$$1)) {
      each$1(extend$$1, function (value, key) {
        if (has$1(source, key)) {
          warn('"' + key + '" is already defined as a prop. Use prop default value instead.');
        } else {
          source[key] = value;
        }
      });
    }

    // 监听各种事件
    // 支持命名空间
    instance.$emitter = new Emitter(TRUE);

    var templateError = '"' + TEMPLATE + '" option expected to have just one root element.';

    // 检查 template
    if (string(template)) {
      if (selector.test(template)) {
        template = api.html(api.find(template));
      }
      // 如果是根组件，必须有一个根元素
      // 如果是子组件，可以是 $children
      if (!tag.test(template) && !parent) {
        error$1(templateError);
      }
    } else {
      template = NULL;
    }

    // 检查 el
    if (string(el)) {
      if (selector.test(el)) {
        el = api.find(el);
      }
    }
    if (el) {
      if (api.isElement(el)) {
        if (!replace) {
          api.html(el, '<div></div>');
          el = api.children(el)[0];
        }
      } else {
        error$1('"el" option expected to be a html element.');
      }
    }

    if (parent) {
      instance.$parent = parent;
    }

    if (methods) {
      each$1(methods, function (fn, name) {
        if (has$1(prototype, name)) {
          fatal('"' + name + '" method is conflicted with built-in methods.');
        }
        instance[name] = fn;
      });
    }

    // 聪明的 set...
    var smartSet = function smartSet(key, value) {
      if (func(value)) {
        instance[key](execute(value, instance));
      } else if (object(value)) {
        instance[key](value);
      }
    };

    smartSet('transition', transitions);
    smartSet('component', components);
    smartSet('directive', directives);
    smartSet('partial', partials);
    smartSet('filter', filters);

    execute(options[HOOK_AFTER_CREATE], instance);

    if (template) {

      // 确保组件根元素有且只有一个
      template = Yox.compile(template);
      if (template[RAW_LENGTH] > 1) {
        fatal(templateError);
      }
      instance.$template = template[0];

      instance.$observer.addComputed(TEMPLATE_COMPUTED, function () {
        return instance.render();
      });
      if (watchers) {
        watchers = copy(watchers);
      } else {
        watchers = {};
      }
      watchers[TEMPLATE_COMPUTED] = function (newNode) {
        instance.updateView(newNode, instance.$node);
      };

      instance.updateView(instance.get(TEMPLATE_COMPUTED), el || api.createElement('div'));
    }

    // 确保早于 AFTER_MOUNT 执行
    if (watchers || events) {
      prepend(function () {
        if (watchers && instance.$observer) {
          instance.watch(watchers);
        }
        if (events && instance.$emitter) {
          instance.on(events);
        }
      });
    }
  }

  Yox.prototype.validate = function validate(props) {
    var $propTypes = this.$propTypes;

    return $propTypes ? Yox.validate(props, $propTypes) : props;
  };

  /**
   * 添加计算属性
   *
   * @param {string} keypath
   * @param {Function|Object} computed
   */


  Yox.prototype.addComputed = function addComputed(keypath, computed) {
    return this.$observer.addComputed(keypath, computed);
  };

  /**
   * 取值
   *
   * @param {string} keypath
   * @param {*} defaultValue
   * @return {?*}
   */


  Yox.prototype.get = function get$$1(keypath, defaultValue) {
    return this.$observer.get(keypath, defaultValue);
  };

  /**
   * 设值
   *
   * @param {string|Object} keypath
   * @param {?*} value
   */


  Yox.prototype.set = function set$$1(keypath, value) {
    this.$observer.set(keypath, value);
  };

  /**
   * 监听事件
   *
   * @param {string|Object} type
   * @param {?Function} listener
   * @return {Yox} 支持链式
   */


  Yox.prototype.on = function on(type, listener) {
    this.$emitter.on(type, listener);
    return this;
  };

  /**
   * 监听一次事件
   *
   * @param {string|Object} type
   * @param {?Function} listener
   * @return {Yox} 支持链式
   */


  Yox.prototype.once = function once(type, listener) {
    this.$emitter.once(type, listener);
    return this;
  };

  /**
   * 取消监听事件
   *
   * @param {string|Object} type
   * @param {?Function} listener
   * @return {Yox} 支持链式
   */


  Yox.prototype.off = function off(type, listener) {
    this.$emitter.off(type, listener);
    return this;
  };

  /**
   * 触发事件
   *
   * @param {string} type
   * @param {?*} data 事件数据
   * @param {?boolean} downward 向下发事件
   * @return {boolean} 是否正常结束
   */


  Yox.prototype.fire = function fire(type, data, downward) {

    // 外部为了使用方便，fire(type) 或 fire(type, data) 就行了
    // 内部为了保持格式统一
    // 需要转成 Event，这样还能知道 target 是哪个组件
    var event = type;
    if (string(type)) {
      event = new Event(type);
    }

    var instance = this;
    if (!event.target) {
      event.target = instance;
    }

    var args = [event];
    if (object(data)) {
      push(args, data);
    }

    var $parent = instance.$parent,
        $children = instance.$children,
        $emitter = instance.$emitter;

    var isComplete = $emitter.fire(event.type, args, instance);
    if (isComplete) {
      if (downward) {
        if ($children) {
          each($children, function (child) {
            return isComplete = child.fire(event, data, TRUE);
          });
        }
      } else if ($parent) {
        isComplete = $parent.fire(event, data);
      }
    }

    return isComplete;
  };

  /**
   * 监听数据变化
   *
   * @param {string|Object} keypath
   * @param {?Function} watcher
   * @param {?boolean} sync
   * @return {Yox} 支持链式
   */


  Yox.prototype.watch = function watch(keypath, watcher, sync) {
    this.$observer.watch(keypath, watcher, sync);
    return this;
  };

  /**
   * 监听一次数据变化
   *
   * @param {string|Object} keypath
   * @param {?Function} watcher
   * @param {?boolean} sync
   * @return {Yox} 支持链式
   */


  Yox.prototype.watchOnce = function watchOnce(keypath, watcher, sync) {
    this.$observer.watchOnce(keypath, watcher, sync);
    return this;
  };

  /**
   * 取消监听数据变化
   *
   * @param {string|Object} keypath
   * @param {?Function} watcher
   * @return {Yox} 支持链式
   */


  Yox.prototype.unwatch = function unwatch(keypath, watcher) {
    this.$observer.unwatch(keypath, watcher);
    return this;
  };

  /**
   * 对于某些特殊场景，修改了数据，但是模板的依赖中并没有这一项
   * 而你非常确定需要更新模板，强制刷新正是你需要的
   */


  Yox.prototype.forceUpdate = function forceUpdate() {

    if (this.$node) {
      var computed = this.$observer.computed[TEMPLATE_COMPUTED];
      if (computed.isDirty()) {
        this.$observer.nextRun();
      } else {
        this.updateView(computed.get(TRUE), this.$node);
      }
    }
  };

  /**
   * 把模板抽象语法树渲染成 virtual dom
   *
   * @return {Object}
   */


  Yox.prototype.render = function render$$1() {

    var instance = this;

    var $template = instance.$template,
        $getter = instance.$getter;


    if (!$getter) {

      var filters = extend({}, registry.filter, instance.$filters);

      var getValue = function getValue(key, expr, keypathStack) {

        if (keypathStack) {

          var value = void 0,
              absoluteKeypath = void 0,
              lookup = expr.lookup !== FALSE,

          // keypathStack 的结构是 keypath, scope 作为一组
          index = keypathStack[RAW_LENGTH] - 2,
              getKeypath = function getKeypath() {

            var keypathIndex = index;

            if (!lookup) {
              var keys$$1 = [];
              each$2(key, function (key) {
                if (key === KEYPATH_PRIVATE_PARENT) {
                  keypathIndex -= 2;
                } else if (key !== KEYPATH_PRIVATE_CURRENT) {
                  push(keys$$1, key);
                }
              });
              key = join(keys$$1, KEYPATH_SEPARATOR);
            }

            var keypath = join$1(keypathStack[keypathIndex], key);
            if (!absoluteKeypath) {
              absoluteKeypath = keypath;
            }
            var scope = keypathStack[keypathIndex + 1];
            if (has$1(scope, key)) {
              value = scope[key];
              return keypath;
            }
            value = instance.get(keypath, getKeypath);
            if (value === getKeypath) {
              if (lookup && index > 0) {
                index--;
                return getKeypath();
              }
            } else {
              return keypath;
            }
          },
              keypath = getKeypath();

          if (isDef(keypath)) {
            absoluteKeypath = keypath;
          } else {
            value = UNDEFINED;
            if (filters) {
              var result = get$1(filters, key);
              if (result) {
                value = result.value;
              }
            }
          }

          expr.absoluteKeypath = absoluteKeypath;

          return value;
        } else {
          return instance.get(key);
        }
      };

      $getter = instance.$getter = function (expr, keypathStack, binding$$1) {
        var lastComputed = Observer.computed,
            value = void 0;
        if (binding$$1) {
          Observer.computed = NULL;
        }
        if (string(expr)) {
          value = getValue(expr);
        } else {
          value = execute$1(expr, function (key, node) {
            return getValue(key, node, keypathStack);
          }, instance);
        }
        if (binding$$1) {
          Observer.computed = lastComputed;
        }
        return value;
      };
    }

    return render($template, $getter, instance);
  };

  /**
   * 更新 virtual dom
   *
   * @param {Vnode} newNode
   * @param {HTMLElement|Vnode} oldNode
   */


  Yox.prototype.updateView = function updateView(newNode, oldNode) {

    var instance = this,
        afterHook = void 0;

    var $node = instance.$node,
        $options = instance.$options;


    instance.$flags = {};

    if ($node) {
      execute($options[HOOK_BEFORE_UPDATE], instance);
      instance.$node = patch(oldNode, newNode);
      afterHook = HOOK_AFTER_UPDATE;
    } else {
      execute($options[HOOK_BEFORE_MOUNT], instance);
      $node = patch(oldNode, newNode);
      instance.$el = $node.el;
      instance.$node = $node;
      afterHook = HOOK_AFTER_MOUNT;
    }

    // 跟 nextTask 保持一个节奏
    // 这样可以预留一些优化的余地
    append(function () {
      if (instance.$node) {
        execute($options[afterHook], instance);
      }
    });
  };

  /**
   * 创建子组件
   *
   * @param {Object} options 组件配置
   * @param {?Object} extra 添加进组件配置，但不修改配置的数据，比如 el、props 等
   * @return {Yox} 子组件实例
   */


  Yox.prototype.create = function create(options, extra) {
    options = extend({}, options, extra);
    options.parent = this;
    var child = new Yox(options);
    push(this.$children || (this.$children = []), child);
    return child;
  };

  /**
   * 导入编译后的子模板
   *
   * @param {string} name
   * @return {Array}
   */


  Yox.prototype.importPartial = function importPartial(name) {
    return Yox.compile(this.partial(name));
  };

  /**
   * 把指令中的表达式编译成函数
   *
   * @param {Directive} directive
   * @return {Function}
   */


  Yox.prototype.compileDirective = function compileDirective(directive) {

    var instance = this;
    var value = directive.value,
        expr = directive.expr,
        keypath = directive.keypath,
        keypathStack = directive.keypathStack;


    if (expr && expr.type === CALL) {
      var callee = expr.callee,
          args = expr.args,
          method = instance[callee.name];

      if (method) {
        var getValue = function getValue(node) {
          return instance.$getter(node, keypathStack);
        };
        return function (event) {
          var isEvent = Event.is(event),
              result = void 0;
          if (args && args[RAW_LENGTH]) {
            if (isEvent) {
              last(keypathStack)[SPECIAL_EVENT] = event;
            }
            result = execute(method, instance, args.map(getValue));
          } else {
            if (isEvent) {
              result = execute(method, instance, event);
            }
          }
          if (result === FALSE && isEvent) {
            event.prevent().stop();
          }
        };
      }
    } else if (value) {
      return function (event, data) {
        if (event.type !== value) {
          event = new Event(event);
          event.type = value;
        }
        instance.fire(event, data);
      };
    }
  };

  /**
   * 销毁组件
   */


  Yox.prototype.destroy = function destroy() {

    var instance = this;

    var $options = instance.$options,
        $node = instance.$node,
        $parent = instance.$parent,
        $emitter = instance.$emitter,
        $observer = instance.$observer;


    execute($options[HOOK_BEFORE_DESTROY], instance);

    if ($parent && $parent.$children) {
      remove($parent.$children, instance);
    }

    if ($node) {
      patch($node, createTextVnode(CHAR_BLANK));
    }

    $emitter.off();
    $observer.destroy();

    clear(instance);

    execute($options[HOOK_AFTER_DESTROY], instance);
  };

  /**
   * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
   *
   * @param {Function} fn
   */


  Yox.prototype.nextTick = function nextTick(fn) {
    this.$observer.nextTick(fn);
  };

  /**
   * 取反 keypath 对应的数据
   *
   * 不管 keypath 对应的数据是什么类型，操作后都是布尔型
   *
   * @param {string} keypath
   * @return {boolean} 取反后的布尔值
   */


  Yox.prototype.toggle = function toggle(keypath) {
    return this.$observer.toggle(keypath);
  };

  /**
   * 递增 keypath 对应的数据
   *
   * 注意，最好是整型的加法，如果涉及浮点型，不保证计算正确
   *
   * @param {string} keypath 值必须能转型成数字，如果不能，则默认从 0 开始递增
   * @param {?number} step 步进值，默认是 1
   * @param {?number} min 可以递增到的最小值，默认不限制
   * @return {number} 返回递增后的值
   */


  Yox.prototype.increase = function increase(keypath, step, max) {
    return this.$observer.increase(keypath, step, max);
  };

  /**
   * 递减 keypath 对应的数据
   *
   * 注意，最好是整型的减法，如果涉及浮点型，不保证计算正确
   *
   * @param {string} keypath 值必须能转型成数字，如果不能，则默认从 0 开始递减
   * @param {?number} step 步进值，默认是 1
   * @param {?number} min 可以递减到的最小值，默认不限制
   * @return {number} 返回递减后的值
   */


  Yox.prototype.decrease = function decrease(keypath, step, min) {
    return this.$observer.decrease(keypath, step, min);
  };

  /**
   * 拷贝任意数据，支持深拷贝
   *
   * @param {*} data
   * @param {?boolean} deep 是否深拷贝
   * @return {*}
   */


  Yox.prototype.copy = function copy$$1(data, deep) {
    return copy(data, deep);
  };

  /**
   * 在数组指定位置插入元素
   *
   * @param {string} keypath
   * @param {*} item
   * @param {number} index
   * @return {?boolean} 是否插入成功
   */


  Yox.prototype.insert = function insert(keypath, item, index) {
    return this.$observer.insert(keypath, item, index);
  };

  /**
   * 在数组尾部添加元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否添加成功
   */


  Yox.prototype.append = function append$$1(keypath, item) {
    return this.$observer.insert(keypath, item, TRUE);
  };

  /**
   * 在数组首部添加元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否添加成功
   */


  Yox.prototype.prepend = function prepend$$1(keypath, item) {
    return this.$observer.insert(keypath, item, FALSE);
  };

  /**
   * 通过索引移除数组中的元素
   *
   * @param {string} keypath
   * @param {number} index
   * @return {?boolean} 是否移除成功
   */


  Yox.prototype.removeAt = function removeAt(keypath, index) {
    return this.$observer.removeAt(keypath, index);
  };

  /**
   * 直接移除数组中的元素
   *
   * @param {string} keypath
   * @param {*} item
   * @return {?boolean} 是否移除成功
   */


  Yox.prototype.remove = function remove$$1(keypath, item) {
    return this.$observer.remove(keypath, item);
  };

  return Yox;
}();

Yox.version = '0.59.3';

/**
 * 工具，便于扩展、插件使用
 */
Yox.is = is$1;
Yox.dom = api;
Yox.array = array$1;
Yox.object = object$1;
Yox.string = string$1;
Yox.logger = logger;
Yox.Event = Event;
Yox.Emitter = Emitter;

var prototype = Yox.prototype;

// 全局注册

var registry = {};

var COMPONENT = 'component';

function getResourceAsync(data, name, callback) {
  var value = data[name];
  if (func(value)) {
    var $pending = value.$pending;

    if (!$pending) {
      $pending = value.$pending = [callback];
      value(function (replacement) {
        delete value.$pending;
        data[name] = replacement;
        each($pending, function (callback) {
          callback(replacement);
        });
      });
    } else {
      push($pending, callback);
    }
  } else {
    callback(value);
  }
}

function setResource(data, name, value) {
  if (object(name)) {
    each$1(name, function (value, key) {
      data[key] = value;
    });
  } else {
    data[name] = value;
  }
}

/**
 * 全局/本地注册
 *
 * @param {Object|string} name
 * @param {?Object} value
 */
each([COMPONENT, 'transition', 'directive', 'partial', 'filter'], function (type) {
  prototype[type] = function (name, value) {
    var instance = this,
        prop = '$' + type + 's',
        data = instance[prop];
    if (string(name)) {
      var length = arguments[RAW_LENGTH],
          hasValue = data && has$1(data, name);
      if (length === 1) {
        return hasValue ? data[name] : Yox[type](name);
      } else if (length === 2 && type === COMPONENT && func(value)) {
        return hasValue ? getResourceAsync(data, name, value) : Yox[type](name, value);
      }
    }
    setResource(data || (instance[prop] = {}), name, value);
  };
  Yox[type] = function (name, value) {
    var data = registry[type];
    if (string(name)) {
      var length = arguments[RAW_LENGTH],
          hasValue = data && has$1(data, name);
      if (length === 1) {
        return hasValue ? data[name] : UNDEFINED;
      } else if (length === 2 && type === COMPONENT && func(value)) {
        return hasValue ? getResourceAsync(data, name, value) : value();
      }
    }
    setResource(data || (registry[type] = {}), name, value);
  };
});

/**
 * 因为组件采用的是异步更新机制，为了在更新之后进行一些操作，可使用 nextTick
 *
 * @param {Function} fn
 */
Yox.nextTick = append;

/**
 * 编译模板，暴露出来是为了打包阶段的模板预编译
 *
 * @param {string} template
 * @return {Array}
 */
Yox.compile = function (template) {
  return string(template) ? convert(compile$$1(template)) : template;
};

/**
 * 验证 props，无爱请重写
 *
 * @param {Object} props 传递的数据
 * @param {Object} propTypes 数据格式
 * @return {Object} 验证通过的数据
 */
Yox.validate = function (props, propTypes) {
  var result = {};
  each$1(propTypes, function (rule, key) {
    var type = rule.type,
        value = rule.value,
        required = rule.required;


    required = required === TRUE || func(required) && required(props);

    if (isDef(props[key])) {
      var target = props[key];
      if (func(rule)) {
        result[key] = rule(target);
      }
      // 如果不写 type 或 type 不是 字符串 或 数组
      // 就当做此规则无效，和没写一样
      else if (type) {
          var matched = void 0;
          // 比较类型
          if (!falsy$1(type)) {
            matched = is(target, type);
          } else if (!falsy(type)) {
            each(type, function (t) {
              if (is(target, t)) {
                matched = TRUE;
                return FALSE;
              }
            });
          } else if (func(type)) {
            // 有时候做判断需要参考其他数据
            // 比如当 a 有值时，b 可以为空之类的
            matched = type(target, props);
          }
          if (matched === TRUE) {
            result[key] = target;
          } else {
            warn('"' + key + '" prop\'s type is not matched.');
          }
        }
    } else if (required) {
      warn('"' + key + '" prop is not found.');
    } else if (has$1(rule, 'value')) {
      if (type === RAW_FUNCTION) {
        result[key] = value;
      } else {
        result[key] = func(value) ? value(props) : value;
      }
    }
  });
  return result;
};

/**
 * 安装插件
 *
 * 插件必须暴露 install 方法
 *
 * @param {Object} plugin
 */
Yox.use = function (plugin) {
  plugin.install(Yox);
};

// 全局注册内置指令
Yox.directive({ event: bindEvent, model: model, binding: binding });

// 全局注册内置过滤器
Yox.filter({ hasSlot: hasSlot });

return Yox;

})));
