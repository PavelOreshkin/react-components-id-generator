const checkIsStringInsideQuotes = (string) => {
  if ((string.startsWith('"') && string.endsWith('"')) ||
      (string.startsWith("'") && string.endsWith("'"))) {
    return true;
  }
  return false;
};

const createReplacer = ({ fileName, componentName, tagName, parsedAttr }) => ({ pattern }) => {
  const regex = /\$\{([^}]+)\}/g;
  return pattern.replace(regex, (match, string) => {
    const parameters = string.replace(/\s/g, '').split('|')

    const transformedParametrs = parameters.map((item) => {
      if (checkIsStringInsideQuotes(item)) {
        return item.slice(1, -1)
      }

      if (item.startsWith("attr:")) {
        const attrName = item.slice(5);
        return parsedAttr[attrName];
      }

      switch (item) {
        case 'fileName':
          return fileName;
        case 'componentName':
          return componentName;
        case 'tagName':
          return tagName;
        default:
          return undefined;
      }
    })

    return transformedParametrs.filter((item) => item)[0];
  });
}

module.exports = { createReplacer };
