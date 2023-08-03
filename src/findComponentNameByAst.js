const traverse = require('@babel/traverse').default;

const findComponentNameByAst = (ast) => {
  let componentName = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.get('declaration');
      if (declaration.isIdentifier()) {
        componentName = declaration?.node?.name;
      } else if (declaration.isFunctionDeclaration()) {
        componentName = declaration?.node?.id?.name;
      } else if (declaration.isClassDeclaration()) {
        componentName = declaration?.node?.id?.name;
      }
    },
    ExportNamedDeclaration(path) {
      const declaration = path.get('declaration');
      if (declaration.isFunctionDeclaration()) {
        componentName = declaration?.node?.id?.name;
      } else if (declaration.isClassDeclaration()) {
        componentName = declaration?.node?.id?.name;
      }
    },
  });

  return componentName
}

module.exports = { findComponentNameByAst };
