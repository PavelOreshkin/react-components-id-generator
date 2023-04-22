const fs = require('fs');
const path = require('path');
const { parse } = require('./acorn');

function addIdsToElement(node, componentName) {
  const elementType = node.openingElement.name.name;

  if (elementType === 'div') {
    return;
  }

  const elementId = `${componentName}_${elementType}`;
  const idAttribute = node.openingElement.attributes.find((attr) => attr.name.name === 'id');

  if (idAttribute) {
    idAttribute.value.value = elementId;
  } else {
    node.openingElement.attributes.push({
      type: 'JSXAttribute',
      name: {
        type: 'JSXIdentifier',
        name: 'id',
      },
      value: {
        type: 'Literal',
        value: elementId,
      },
    });
  }
}

function addIdsToComponent(componentNode) {
  const componentName = componentNode.id.name;
  const elements = [];

  function traverse(node) {
    if (node.type === 'JSXElement') {
      addIdsToElement(node, componentName);
      elements.push(node);
    }
    node.children.forEach(traverse);
  }

  traverse(componentNode);

  return elements;
}

function addIdsToFile(filePath) {
  const code = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const ast = parse(code, { sourceType: 'module', ecmaVersion: 2021 });
  const components = ast.body.filter((node) => node.type === 'FunctionDeclaration');

  components.forEach((componentNode) => {
    const elements = addIdsToComponent(componentNode);
    const newCode = elements.reduce((acc, element) => {
      const start = element.start;
      const end = element.end;
      const elementCode = code.substring(start, end);
      const newElementCode = elementCode.replace('<', `<${componentNode.id.name}_`);
      return acc.replace(elementCode, newElementCode);
    }, code);

    fs.writeFileSync(filePath, newCode, { encoding: 'utf-8' });
  });

  console.log(`Added ids to ${components.length} components in ${filePath}`);
}

module.exports = { addIdsToFile };