const fs = require('fs');
const generator = require('@babel/generator').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { findComponentNameByAst } = require('../src/findComponentNameByAst');
const { createReplacer } = require('../src/createReplacer');
const { parseAttributes } = require('../src/parseAttributes');
const { setId } = require('../src/setId');

function addIdsToFile({ filePath, config }) {
  const code = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parse(code, { sourceType: "module", plugins: ['jsx', 'typescript'] });

  // get component name
  const componentName = findComponentNameByAst(ast);

  // add ids to tags
  traverse(ast, {
    JSXOpeningElement(path) {
      const { attributes } = path.node || {};
      const fileName = filePath.match(/[\\\/]+([^\\\/]+)\.\w+$/)[1]
      const tagName = path.node.name.name;
      const parsedAttr = parseAttributes(attributes)
      const repacerByPattern = createReplacer({ fileName, componentName, tagName, parsedAttr });

      config.rules.forEach((rule) => {
        if (rule.tag && typeof rule.tag === 'string') {
          if (tagName === rule.tag) {
            const newId = repacerByPattern({ pattern: rule.pattern });
            setId({ action: config.action, attributes, idName: config.id_name, newId })
          }
        }
        if (rule.tag && Array.isArray(rule.tag) && rule.tag.length !== 0) {
          rule.tag.forEach((tag) => {
            if (tagName === tag) {
              const newId = repacerByPattern({ pattern: rule.pattern });
              setId({ action: config.action, attributes, idName: config.id_name, newId })
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
    /**
     * the next line is needed to fix the compilation of non-Latin characters
     * without it, "你好" will be compiled into "\u4F60\u597D"
     */
    jsescOption: { minimal: true }
  };
  const output = generator(ast, options, code).code;

  // write new JSX to file
  fs.writeFileSync(filePath, output, 'utf8');
}

module.exports = { addIdsToFile };