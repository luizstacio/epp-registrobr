function sumNumbers (numbers) {
  return numbers.slice().reverse().reduce(function (a, b, i) {
    return a + (b * (i + 2));
  }, 0);
}

module.exports = sumNumbers;
