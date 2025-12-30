const findTagName = (path) => {
  const getNameParts = (node) => {
    // single tag like <button>
    if (node.type === "JSXIdentifier") {
      return [node.name];
    }

    // compound tag like <Modal.Button> or <Modal.Button.SuperButton>
    if (node.type === "JSXMemberExpression") {
      const objectParts = getNameParts(node.object);
      const propertyName = node.property?.name;
      if (propertyName) {
        return [...objectParts, propertyName];
      }
      return objectParts;
    }

    return [];
  };

  const parts = getNameParts(path.node.name);
  return parts.length > 0 ? parts.join(".") : undefined;
};

module.exports = { findTagName };
