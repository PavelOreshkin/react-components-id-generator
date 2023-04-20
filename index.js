const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function addIdToElements(idPrefix, elements) {
  traverse(elements, {
    JSXOpeningElement(path) {
      const attrs = path.node.attributes;
      const onClickAttr = attrs.find(attr => attr.name.name === 'onClick');
      if (onClickAttr) {
        const onClickValue = onClickAttr.value;
        if (t.isStringLiteral(onClickValue)) {
          const id = `${idPrefix}_${onClickValue.value}`;
          attrs.push(t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(id)));
          onClickAttr.name = t.jsxIdentifier('data-onClick');
        }
      }
    }
  });

  return elements;
}

module.exports = {
  addIdToElements
};