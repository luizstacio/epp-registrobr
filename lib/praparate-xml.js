'use strict';

let _ = require('lodash');
let fs = require('fs');
let util = require('./util');

class PreparateXml {
  constructor(config) {
    this.config = config;
    this.cacheXML = {};
  }

  applyAuth(object) {
    return _.merge(object, {
      clTRID: Date.now(),
      password: this.config.password
    });
  }

  openXML(xmlPath) {
    if (this.cacheXML[xmlPath]) {
      return this.cacheXML[xmlPath];
    } else {
      return this.cacheXML[xmlPath] = fs.readFileSync(__dirname + xmlPath).toString();
    }
  }

  parse(xmlPath, object) {
    let xml = this.openXML(xmlPath);

    return util.replace(xml, this.applyAuth(object || {}));
  }
}

module.exports = PreparateXml;