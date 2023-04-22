const acorn = require("acorn");
const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

function parseCode(code) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  const elements = [];

  traverse(ast, {
    JSXOpeningElement(path) {
      const elementName = path.node.name.name;
      const elementType = path.node.name.type;

      elements.push({
        name: elementName,
        type: elementType,
        loc: path.node.loc,
      });
    },
  });

  return elements;
}

function generateIds(elements) {
  const ids = {};

  elements.forEach((element) => {
    const componentName = element.loc.filename.split("/").pop().replace(/\.[^/.]+$/, "");
    const elementId = `${componentName}_${element.name}`;

    ids[element.loc.start.line] = {
      name: element.name,
      type: element.type,
      id: elementId,
    };
  });

  return ids;
}

function addIdsToCode(code, ids) {
  const ast = babel.transform(code, {
    presets: ["@babel/preset-react"],
  }).ast;

  traverse(ast, {
    JSXOpeningElement(path) {
      const loc = path.node.loc;
      if (loc && loc.start && loc.start.line in ids) {
        const id = ids[loc.start.line].id;
        const attributes = [
          babel.types.JSXAttribute(
            babel.types.JSXIdentifier("id"),
            babel.types.StringLiteral(id)
          ),
        ];

        path.node.attributes = attributes.concat(path.node.attributes || []);
      }
    },
  });

  return babel.transformFromAst(ast, code, {
    presets: ["@babel/preset-react"],
  }).code;
}

function addIdsToFile(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const elements = parseCode(code);
  const ids = generateIds(elements);
  const newCode = addIdsToCode(code, ids);

  fs.writeFileSync(filePath, newCode, "utf-8");
}
