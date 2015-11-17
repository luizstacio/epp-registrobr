function mod (dividend, divisor) {
  return Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
}

module.exports = mod;
