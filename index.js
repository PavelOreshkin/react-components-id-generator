const fs = require('fs');
const path = require('path');
const generator = require('@babel/generator').default;
const babel = require('@babel/core');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const findComponentNameByAst = (ast) => {
  let componentName = null;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.get('declaration');
      if (declaration.isIdentifier()) {
        componentName = declaration.node.name;
      } else if (declaration.isFunctionDeclaration()) {
        componentName = declaration.node.id.name;
      } else if (declaration.isClassDeclaration()) {
        componentName = declaration.node.id.name;
      }
    },
    ExportNamedDeclaration(path) {
      const declaration = path.get('declaration');
      if (declaration.isFunctionDeclaration()) {
        componentName = declaration.node.id.name;
      } else if (declaration.isClassDeclaration()) {
        componentName = declaration.node.id.name;
      }
    },
  });
  
  return componentName
}


function addIdsToFile(filePath) {
  const code = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parse(code, { sourceType: "module", retainLines: true, comments: true, plugins: ['jsx'] });

  // get component name
  const componentName = findComponentNameByAst(ast);
  
  // add ids to tags
  traverse(ast, {
    JSXOpeningElement(path) {
      const { attributes } = path.node || {};
      const tagName = path.node.name.name;

      if ((tagName === 'button' || tagName === 'input' || tagName === 'CustomButton') && !attributes.find(attr => attr.name.name === 'test-id')) {
        const onClickAttr = attributes.find(attr => attr.name.name === 'onClick');
        let methodName = '';
        if (onClickAttr) {
          const { value } = onClickAttr;
          if (value.type === 'JSXExpressionContainer' && value.expression.type === 'Identifier') {
            methodName = value.expression.name;
          }
        }

        const idValue = `${componentName}_${tagName}_${methodName}`;
        path.node.attributes.push({
          type: 'JSXAttribute',
          name: {
            type: 'JSXIdentifier',
            name: 'test-id',
          },
          value: {
            type: 'StringLiteral',
            value: idValue,
          },
        });
      }
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