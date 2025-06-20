const generate = require('@babel/generator').default;
const {traverse} = require('./traversal');

const babelVisitor = {
  CallExpression: {
    enter({ node }) {
      node.callee = { type: 'Identifier', name: node.name };
    },
  },
  VariableDeclaration: {
    enter({ node }) {
      node.kind = 'let';
      node.declarations = [
        {
          type: 'VariableDeclarator',
          id: node.identifier,
          init: node.assignment,
        },
      ];
    },
  },
};

const transpileToJs = ast => {
  traverse(ast, babelVisitor);
  return generate(ast).code;
};

module.exports = {
  transpileToJs,
};
