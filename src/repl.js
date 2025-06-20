const {prompt} = require('inquirer');
const chalk = require('chalk');
const {tokenize, parse, evaluate} = require('./core');
const {traverse} = require('./traversal');

const pipe = (...funcs) => value =>
  funcs.reduce((value, func) => func(value), value);

const transform = node => {
  traverse(node, {
    CallExpression: {
      enter({ node }) {
        if (specialForms[node.name]) {
          specialForms[node.name](node);
        }
      },
    },
  });
  return node;
};

// CallExpression
//    - name (define)
//    - arguments (identifier, assignment)

// VariableDeclaration

const specialForms = {
  define(node) {
    const [identifier, assignment] = node.arguments;
    node.type = 'VariableDeclaration';
    node.identifier = identifier;
    node.assignment = assignment;
    delete node.name;
    delete node.arguments;
  },
};

module.exports = { specialForms, transform };

const parseProgram = () => {};

const parseThenEvaluate = pipe(
  tokenize,
  parse,
  transform,
  evaluate,
);

const tokenizeThenParse = pipe(
  tokenize,
  parse,
);

const parseThenEvaluateProgram = pipe(
  tokenize,
  parseProgram,
  evaluate,
);


const askQuestions = () => {
  const questions = [
    { name: 'COMMAND', 
      type: 'input', 
      message: chalk.blue('>') },
  ];

  return prompt(questions);
};

const repl = async () => {
 try {
    const answers = await askQuestions();
    const { COMMAND } = answers;

    if (COMMAND.trim()) {
      console.log(chalk.yellow(parseThenEvaluate(COMMAND)));
    }
  } catch (error) {
    console.error(error);
  }

  repl();
};

if (require.main === module) {
  console.log(
    chalk.red(
      `The Small LISP ${chalk.bgYellow('DelMitoBoni')} Programming Language`,
    ),
  )
  repl();
}

module.exports = {
  repl, 
  parseThenEvaluate
};
