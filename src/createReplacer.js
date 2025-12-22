const { v4: uuidv4 } = require("uuid");

const checkIsStringInsideQuotes = (string) => {
  if (
    (string.startsWith('"') && string.endsWith('"')) ||
    (string.startsWith("'") && string.endsWith("'"))
  ) {
    return true;
  }
  return false;
};

const createReplacer =
  ({ fileName, componentName, tagName, parsedAttr }) =>
  ({ pattern }) => {
    const regex = /\$\{([^}]+)\}/g;
    return pattern.replace(regex, (_match, string) => {
      const parameters = string.replace(/\s/g, "").split("|");

      const transformedParameters = parameters.map((item) => {
        if (checkIsStringInsideQuotes(item)) {
          return item.slice(1, -1);
        }

        if (item.startsWith("attr:")) {
          const attrName = item.slice(5);
          return parsedAttr[attrName];
        }

        switch (item) {
          case "fileName":
            return fileName;
          case "componentName":
            return componentName;
          case "tagName":
            return tagName;
          case "uuid":
            return uuidv4();
          default:
            return undefined;
        }
      });

      return transformedParameters.find((item) => item);
    });
  };

module.exports = { createReplacer };
