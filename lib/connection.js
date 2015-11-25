var tls = require('tls');
var fs = require('fs');
var Q = require('q');
var XML = require('xml2json');
var util = require('./util');

function ProtocolConnection(config) {
    this.config = config;
    this._runqueue = {};
    this.lastRequestFinished = true;
    this.setStream(false);
}

ProtocolConnection.prototype.runqueue_exec = function(id, data, err) {
  var exec = this._runqueue[id];
  if (!exec) return;
  if (err) exec.reject(err);
  exec.resolve(data);
  delete this._runqueue[id];
}

ProtocolConnection.prototype.runqueue_add = function(id, deffer) {
  this._runqueue[id] = deffer;
}

ProtocolConnection.prototype.clientResponse = function() {
};

ProtocolConnection.prototype.setStream = function(newStream) {
    this.stream = newStream;
};

ProtocolConnection.prototype.getStream = function() {
    return this.stream;
};

ProtocolConnection.prototype.initStream = function() {
    var self = this;
    var deferred = Q.defer();
    var config = this.config;

    if (! self.getStream()) {
        try {
            var newStream, pem;
            var options = {
                "host": config.host || "beta.registro.br",
                "port": config.port || 700,
                "ssl": config.ssl == null ? true : config.ssl,
                "rejectUnauthorized": false
            };

            if (!( config.key && config.cert && config.ca )) {
              pem = fs.readFileSync(__dirname.replace('/lib', '') + '/cert/client.pem');
              options.key = pem;
              options.cert = pem;
              options.ca = [pem];
            }

            if (config.key) options.key = config.key;
            if (config.cert) options.cert = config.cert;
            if (config.ca) options.ca = config.ca;

            newStream = tls.connect(options, function() {
                deferred.resolve('Established a secure connection.');
            });
            newStream.on('readable', function () {
                self.readStream();
            });
            newStream.on('clientError', function(exception, securePair) {
                deferred.reject(exception);
            });
            newStream.on('end', function() {
                // console.log("%s :Got an end event", new Date());
                self.setStream(false);
            });
            self.setStream(newStream);
        } catch(e) {
            deferred.reject(e);
        }
    } else {
        deferred.resolve();
    }
    return deferred.promise;
};

ProtocolConnection.prototype.getStatus = function (buffer) {
  var resJSON = JSON.parse(XML.toJson(this.checkEndianLength(buffer).toString()));
  var res = resJSON.epp.response;
  if (res) {
    return res.result.code;
  }
  return 0;
};

ProtocolConnection.prototype.getStatusMessage = function (buffer) {
  var resJSON = JSON.parse(XML.toJson(this.checkEndianLength(buffer).toString()));
  var res = resJSON.epp.response;
  if (res) {
    return res.result.msg.$t;
  }
  return '';
};

ProtocolConnection.prototype.getResData = function (buffer) {
  var resJSON = JSON.parse(XML.toJson(this.checkEndianLength(buffer).toString()));
  var res = resJSON.epp.response;
  if (res) {
    return res.resData;
  }
  return {};
};

ProtocolConnection.prototype.getReason = function (buffer) {
  var resJSON = JSON.parse(XML.toJson(this.checkEndianLength(buffer).toString()));
  var res = resJSON.epp.response;
  if (res) {
    return util.eval(res, 'result.extValue.reason.$t');
  }
  return 0;
};

ProtocolConnection.prototype.getReqId = function (buffer) {
  var resJSON = JSON.parse(XML.toJson(this.checkEndianLength(buffer).toString()));
  var res = resJSON.epp.response;
  if (res) {
    return res.trID.clTRID;
  }
  return {};
};

ProtocolConnection.prototype.getReqIdXML = function (xml) {
  return JSON.parse(XML.toJson(xml)).epp.command.clTRID;
};


ProtocolConnection.prototype.readStream = function () {
    var stream = this.getStream();
    var streamBuffer = stream.read();
    var streamBufferLength, status;

    if ( streamBuffer == null ) return;

    streamBufferLength = streamBuffer.length;
    status = this.getStatus(streamBuffer);

    if ( this.helloCallback ) {
      return this.helloCallback(this.checkEndianLength(streamBuffer).toString());
    }

    if (  !~['1000', '1500', '1001', '1301', '1300'].indexOf(status) ) {
      return this.runqueue_exec(this.getReqId(streamBuffer), null, {
        code: status, 
        message: this.getStatusMessage(streamBuffer),
        reason: this.getReason(streamBuffer)
      });
    }

    if (streamBufferLength > 4) {
        var buffer = this.checkEndianLength(streamBuffer);
        this.runqueue_exec(this.getReqId(buffer), JSON.parse(XML.toJson(buffer.toString())));
    }
};

ProtocolConnection.prototype.checkEndianLength = function checkEndianLength(buffer) {
    var bigEndian = buffer.slice(0, 4);
    var restOfBuffer = buffer.slice(4);
    var totalLength = bigEndian.readUInt32BE(0);
    var lengthWithoutEndian = totalLength - 4;
    if (buffer.length === totalLength || restOfBuffer.length === totalLength) {
        return restOfBuffer;
    }
    return buffer;
};

ProtocolConnection.prototype.processBigEndian = function(xml) {
    var xmlBuffer = new Buffer(xml);

    var xmlLength = xmlBuffer.length;
    var endianLength = xmlLength + 4;
    var b = new Buffer(4);
    b.writeUInt32BE(endianLength, 0);
    var preppedXML = Buffer.concat([b, xmlBuffer]);
    return preppedXML;
};

ProtocolConnection.prototype.send = function(xml, def) {
    var deferred = def || Q.defer();

    this.runqueue_add(this.getReqIdXML(xml), deferred);
    var preparedXML = this.processBigEndian(xml);
    this.getStream().write(preparedXML, "utf8");

    return deferred.promise;
};

ProtocolConnection.prototype.hello = function(xml) {
    var deferred = Q.defer();
    var preparedXML = this.processBigEndian(xml);

    this.getStream().write(preparedXML, "utf8", () => {
      this.helloCallback = (data) => {
        this.helloCallback = null;
        deferred.resolve(data);
      }
    });


    return deferred.promise;
};

module.exports = ProtocolConnection;

