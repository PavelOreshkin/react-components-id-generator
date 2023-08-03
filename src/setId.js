function setId({ attributes, idName, newId }) {
  const hasId = attributes.some((attr) => attr?.name?.name === idName)
  
  if (!hasId) {
    return attributes.push({
      type: 'JSXAttribute',
      name: {
        type: 'JSXIdentifier',
        name: idName,
      },
      value: {
        type: 'StringLiteral',
        value: newId,
      },
    });
  }
}

module.exports = { setId };
