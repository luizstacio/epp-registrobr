var random = require('./random');
var mod = require('./mod');
var sumNumbers = require('./sumNumbers');

var defaultMask = 'xxx.xxx.xxx-xx';
var defaultPlaceholder = 'x';

function gerarCPF (mask, placeholder) {
  'use strict';
  var numbers = [];
  var last;
  var result;

  while (numbers.length < 9) {
    numbers[numbers.length] = random(9);
  }

  while (numbers.length < 11) {
    last = 11 - mod(sumNumbers(numbers), 11);

    if (last >= 10) {
      last = 0;
    }

    numbers[numbers.length] = last;
  }

  result = numbers.join('');

  if (typeof mask === 'boolean' && mask) {
    mask = defaultMask;
  }

  if (mask && mask.length) {
    if (typeof placeholder === 'undefined') {
      placeholder = defaultPlaceholder;
    }

    if (mask.match(new RegExp(placeholder, 'g')).length < 11) {
      throw new Error('The CPF mask should contain 11 placeholders');
    }

    var placeholderRegex = new RegExp(placeholder);
    var i = -1;

    while (++i < 11) {
      mask = mask.replace(placeholderRegex, result[i]);
    }

    result = mask;
  }

  return result;
}

module.exports = gerarCPF;
