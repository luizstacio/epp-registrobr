var assert = require('assert');
var validarCpf = require('validar-cpf');
var gerarCpf = require('../');

describe('gerar-cpf', function () {
  var i = -1;
  var cpfs = [];

  while (++i < 99) {
    cpfs[i] = gerarCpf();
  }

  cpfs.forEach(function (cpf) {
    it('should generate valid cpf', function () {
      assert(validarCpf(cpf));
    });
  });

  describe('mask argument', function () {
    it('should output a masked cpf if true is passed', function () {
      assert(/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(gerarCpf(true)));
    });

    it('should accept a mask argument', function () {
      assert(/\d{4}\.\d{4}\.\d{3}/.test(gerarCpf('xxxx.xxxx.xxx')));
    });

    it('should throw an error if the mask contains less than 11 placeholders', function () {
      assert.throws(gerarCpf.bind(null, 'xxxxxxxxxx'));
    });

    it('should accept a placeholder argument', function () {
      assert(/\d{3}x\d{3}x\d{3}x\d{2}/.test(gerarCpf('kkkxkkkxkkkxkk', 'k')));
      assert(/\d{3}x\d{3}x\d{3}x\d{2}/.test(gerarCpf('___x___x___x__', '_')));
      assert(/\d{3} \d{3} \d{3} \d{2}/.test(gerarCpf('kkk kkk kkk kk', 'k')));
      assert(/\d{3} \d{3} \d{3} \d{2}/.test(gerarCpf('kkk kkk kkk kk', 'k')));
      assert(/\d{3} \d{3} \d{3} \d{2}/.test(gerarCpf('<><><> <><><> <><><> <><>', '<>')));
    });
  });
});
