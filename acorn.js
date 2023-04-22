const acorn = require('acorn-jsx');

function parse(code) {
  return acorn.parse(code, { sourceType: 'module', plugins: { jsx: true } });
}

module.exports = { parse };