const babel = require('@babel/core');

function babelParseJSX(code) {

  const isTSX = code.includes('tsx');

  const plugins = [
    '@babel/plugin-transform-react-jsx'
  ];

  if (isTSX) {
    plugins.push('@babel/plugin-transform-typescript');
  }

  const { ast } = babel.transformSync(code, {
    ast: true,
    plugins
  });

  return ast
}

module.exports = { babelParseJSX };