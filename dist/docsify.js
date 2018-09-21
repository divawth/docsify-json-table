(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fs'], factory) :
  (factory((global['Bell-doc'] = {}),global.fs));
}(this, (function (exports,fs) { 'use strict';

  fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;

  // import jsonTotable from './jsonTotable'

  let jsonTotable = function (code) {
    return function (hook, vm) {
      window.$docsify.markdown = {
        renderer: {
          code: function (code, lang) {
            if (!/jsonTotable/.test(lang)) {
              return code;
            } else {
              var path = lang.split(':')[1];
              console.log(path, fs.existsSync(path));
            }
          }
        }
      };
    };
  };

  window.jsonTotable = jsonTotable;

  exports.jsonTotable = jsonTotable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
