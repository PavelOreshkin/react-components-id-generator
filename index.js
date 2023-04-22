const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function addIdToElements(idPrefix, elements) {
  console.log('addIdToElements');
  console.log('idPrefix: ', idPrefix);
  console.log('elements: ', elements);
  traverse(elements, {
    JSXOpeningElement(path) {
      console.log('path: ', path);
      const attrs = path.node.attributes;
      console.log('attrs: ', attrs);
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