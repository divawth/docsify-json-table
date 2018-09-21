(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function createTables(json) {
    try {
      json = JSON.parse(json);
    }
    catch(err) {
      return;
    }
    var html = '<table>';
    if (json.title) {
      html += '<thead><tr>';
      for(var row in json.title) {
        var item = json.title[ row ];
        html += '<th>' 
             +    item.title 
             +  '</th>';
      }
      html += '</tr></thead>';
    }

    if (json.data) {
      html += '<tbody>';
      for(var col in json.data) {
        var item = json.data[ col ];
        html += '<tr>' 
        for(var row in json.title) {
          var name = json.title[ row ].key;
          html += '<td>' 
                + item[ name ];
          html +='</td>';
        }
        html +='</tr>';
      }
      html += '</tbody>';
    }

    html += '</table>';
    console.log(html);
    return html;
  }

  function obj2str(data) {

    if (!data) return '';

    let result = [];
    for (let key in data) {
      let item = data[key];
      if (item && typeof item == 'object') {
        result.push(key + "=" + JSON.stringify(item));
      } else {
        result.push(key + "=" + item);
      }
    }
    return result.join('&');
  }
  function ajax(obj) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      if (obj.data) {
        obj.data = obj2str(obj.data);
      }

      if (obj.type && obj.type.toLowerCase() == "post") {
        obj.type = "post";
      } else {
        obj.type = "get";
        obj.url += "?" + obj.data;
      }

      xhr.open(obj.type, obj.url, true);

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      if (obj.type == "post") {
        xhr.send(obj.data);
      } else {
        xhr.send();
      }

      xhr.onreadystatechange = function () {
        // onReadyStateChange 事件
        if (xhr.readyState == 4) {
          // 4 为完成
          if (xhr.status == 200) {
            // 200 为成功
            resolve && resolve(xhr.responseText);
          } else {
            reject && reject(xhr.responseText);
          }
        }
      };
    });
  }
  let json2table = function (code) {
    return function (hook, vm) {

      hook.afterEach(function (html, next) {
        var promise = new Promise(function (resolve, reject) {
          var arr = [];
          html.replace(/\<json_begin\>([\w|\/|\.]+)\<\/json_end\>/g, function ($0, $1) {
            arr.push(ajax({
              url: $1
            }).then(function (json) {
              return json;
            }));
          });

          Promise.all(arr).then(function (values) {
            html = html.replace(/\<json_begin\>([\w|\/|\.]+)\<\/json_end\>/g, function ($0, $1) {
              let json = values.pop();
              return createTables(json);
            });
            resolve(html);
          });
        });
        promise.then(function (html) {
          next(html);
        });
      });

      window.$docsify.markdown = {
        renderer: {
          code: function (code, lang) {
            if (!/json2table/.test(lang)) {
              return code;
            } else {
              var path = `${vm.route.path}json/${lang.split(':')[1]}.json`;
              return '<json_begin>' + path + '</json_end>';
            }
          }
        }
      };
    };
  };

  window.json2table = json2table;

})));
