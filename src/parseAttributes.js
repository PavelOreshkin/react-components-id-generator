function parseAttributes(attributes) {
  return attributes.reduce((result, attr) => {
    const name = attr.name.name;
    let value = '';
    if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'Identifier') {
      value = attr.value.expression.name;
    }
    if (attr.value.type === 'StringLiteral') {
      value = attr.value.value;
    }
    return { ...result, [name]: value }
  }, {})
}

module.exports = { parseAttributes };
