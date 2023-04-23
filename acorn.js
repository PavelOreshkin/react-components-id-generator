var acorn = require("acorn");
var jsx = require("acorn-jsx");

function parseJSX(code) {

  const options = {
    ecmaVersion: 'latest',
    sourceType: "module",
    plugins: {
      jsx: true,
      typescript: true 
    },
  };

  return acorn.Parser.extend(jsx()).parse(code, options);
}

module.exports = { parseJSX };