function parseAttributes(attributes, spaceReplacer) {
  return attributes.reduce((result, attr) => {
    const name = attr?.name?.name;
    let value = "";

    if (
      attr?.value?.type === "JSXExpressionContainer" &&
      attr?.value?.expression?.type === "Identifier"
    ) {
      value = attr?.value?.expression?.name;
    }

    if (attr?.value?.type === "StringLiteral") {
      value = attr?.value?.value;
    }

    if (spaceReplacer && typeof spaceReplacer === "string") {
      value = value.replace(/\s+/g, spaceReplacer);
    }

    return { ...result, [name]: value };
  }, {});
}

module.exports = { parseAttributes };
