const fs = require('fs');
const path = require('path');
const generator = require('@babel/generator').default;
const babel = require('@babel/core');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { findComponentNameByAst } = require('../src/findComponentNameByAst');
const { createReplacer } = require('../src/createReplacer');
const { parseAttributes } = require('../src/parseAttributes');
const { setId } = require('../src/setId');

function addIdsToFile({ filePath, config }) {
  const code = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parse(code, { sourceType: "module", presets: ['@babel/preset-typescript'], plugins: ['jsx'] });

  // get component name
  const componentName = findComponentNameByAst(ast);

  // add ids to tags
  traverse(ast, {
    JSXOpeningElement(path) {
      const { attributes } = path.node || {};
      const parsedAttr = parseAttributes(attributes)
      const tagName = path.node.name.name;
      const repacerByPattern = createReplacer({ componentName, tagName, parsedAttr });

      config.rules.forEach((rule) => {
        if (rule.tag && typeof rule.tag === 'string') {
          if (tagName === rule.tag) {
            const newId = repacerByPattern({ pattern: rule.pattern });
            setId({ attributes, idName: config.id_name, newId })
          }
        }
        if (rule.tag && Array.isArray(rule.tag) && rule.tag.length !== 0) {
          rule.tag.forEach((tag) => {
            if (tagName === tag) {
              const newId = repacerByPattern({ pattern: rule.pattern });
              setId({ attributes, idName: config.id_name, newId })
            }
          })
        }
      })
    },
  }, { scope: {} });

  // generate new ast back in JSX
  const options = {
    retainLines: true,
    comments: true,
    sourceType: 'module',
    concise: false,
    plugins: ['jsx'],
  }
  const output = generator(ast, options, code).code;

  // write new JSX to file
  fs.writeFileSync(filePath, output, 'utf8');
}

module.exports = { addIdsToFile };