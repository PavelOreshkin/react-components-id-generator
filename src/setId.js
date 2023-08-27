const deleteId = ({ attributes, attributeIndex }) => {
  attributes.splice(attributeIndex, 1);
}

const createId = ({ attributes, attributeIndex, newAttr }) => {
  if (attributeIndex === -1) attributes.push(newAttr);
}

const updateId = ({ attributes, attributeIndex, newAttr }) => {
  attributes.splice(attributeIndex, 1, newAttr);
}

const createAndUpdate = ({ attributes, attributeIndex, newAttr }) => {
  createId({ attributes, attributeIndex, newAttr });
  updateId({ attributes, attributeIndex, newAttr });
}

function setId({ action, attributes, idName, newId }) {
  const attributeIndex = attributes.findIndex((attr) => attr?.name?.name === idName);

  if (action === 'delete') {
    return deleteId({ attributes, attributeIndex });
  }

  const newAttr = {
    type: 'JSXAttribute',
    name: {
      type: 'JSXIdentifier',
      name: idName,
    },
    value: {
      type: 'StringLiteral',
      value: newId,
    },
  }

  if (action === 'onlyCreate') {
    return createId({ attributes, attributeIndex, newAttr });
  }
  if (action === 'onlyUpdate') {
    return updateId({ attributes, attributeIndex, newAttr });
  }
  if (action === 'createAndUpdate') {
    return createAndUpdate({ attributes, attributeIndex, newAttr });
  }
  return createAndUpdate({ attributes, attributeIndex, newAttr });
}

module.exports = { setId };
