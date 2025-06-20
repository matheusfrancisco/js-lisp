const generate = require('@babel/generator').default;
const traverseNode = ({ node, parent, visitor }) => {
  const methods = visitor[node.type];

  if (methods && methods.enter) {
    methods.enter({ node, parent });
  }

  if (node.arguments) {
    traverseArray({ array: node.arguments, parent: node, visitor });
  }

  if (methods && methods.exit) {
    methods.exit({ node, parent });
  }
};

const traverseArray = ({ array, parent, visitor }) => {
  array.forEach(node => {
    traverseNode({ node, parent, visitor });
  });
};

const traverse = (node, visitor) => {
  traverseNode({ node, visitor });
};

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
