const createReplacer = ({ componentName, tagName, parsedAttr }) => ({ pattern }) => {
  const regex = /\$\{([^}]+)\}/g;
  return pattern.replace(regex, (match, capture) => {

    if (capture.startsWith("attr:")) {
      const attrName = capture.slice(5);
      return parsedAttr[attrName];
    }

    switch (capture) {
      case 'componentName':
        return componentName;
      case 'tagName':
        return tagName;
      default:
        return capture;
    }
  });
}

module.exports = { createReplacer };
