'use strict';

class Util {
  eval(scope, path) {
    let paths = path.split('.');
    let current = scope;

    for (let key of  paths) {
      current = current[key];
      if (current == null) break;
    }

    return current;
  }

  replace(text, object) {
    let keys = Object.keys(object);

    text = text.replace(/\$\([A-z,0-9,_-]+\)\$/g, function (match, index, text) {
      var key = match.replace('$(', '').replace(')$', '');
      return object[key] === undefined ? '' : object[key];
    });

    return text;
  }

  templateCompile(template) {
    var _return = '';

    function compile(tpml) {
      var initIf = tpml.search(/<!--.*@if/);
      var tpmlSlice = tpml.slice(initIf);
      var endIf = initIf  + tpmlSlice.indexOf('-->') + 3;
      var expression = tpml.slice(initIf, endIf).replace(/<!--.*@if|-->/g, '');
      var initEndIf = initIf + tpmlSlice.search(/<!--*.@endif/);
      var endEndIf = initEndIf + tpml.slice(initEndIf).indexOf('-->') + 3;
      var content = tpml.slice(endIf, initEndIf);


      if (eval(expression)) {
        tpml = `${tpml.slice(0,initIf)}${content}${tpml.slice(endEndIf)}`;
      } else {
        tpml = `${tpml.slice(0,initIf)}${tpml.slice(endEndIf)}`;
      }

      return tpml;
    }
    
    template.replace(/@if/ig, (match, index, tpml) => {
      _return = compile(_return || tpml, index);
    });

    return _return;
  }
}

module.exports = new Util();