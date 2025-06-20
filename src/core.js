const tap = require('lodash/tap');
const {environment} = require('./std');

//utils.js
const pipe = (...funcs) => value =>
  funcs.reduce((value, func) => func(value), value);

const log = value => tap(value, console.log);

const peek = array => array[0];
const pop = array => array.shift();
//end utils


//tokens
const LETTER = /[a-zA-Z]/;
const NUMBER = /[0-9]/;
const WHITESPACE = /\s/;
const OPERATORS = ['+', '-', '*', '/', '%'];

const isLetter = (char) => LETTER.test(char);
const isNumber = (char) => NUMBER.test(char);
const isWhitespace = (char) => WHITESPACE.test(char);
const isOperator = (char) => OPERATORS.includes(char);
const isOpeningBracket = (char) => char === '(';
const isClosingBracket = (char) => char === ')';
const isParenthesis = (char) => isOpeningBracket(char) || isClosingBracket(char);
const isQuote = char => char === '"';


const tokenize = (input) => {
  const tokens = [];
  let cursor = 0;
  while (cursor < input.length) {
    const char = input[cursor];

    if (isWhitespace(char)) {
      cursor++;
      continue;
    }

    if (isParenthesis(char)) {
      tokens.push({
        type: "Parenthesis",
        start: cursor,
        end: cursor + 1,
        value : char
      });
      cursor++;
      continue;
    }

    
    if (isNumber(char)) {
      let number = char;
      while(isNumber(input[++cursor])) {
        number += input[cursor];
      }
      tokens.push({
        type: "Number",
        start: cursor - number.length,
        end: cursor,
        value: parseInt(number, 10)
      });
      continue;
    }

    if( isLetter(char)) {
      let letters = char;
      while(isLetter(input[++cursor])) {
        letters += input[cursor];
      }

      tokens.push({
        type: "Name",
        start: cursor - letters.length,
        end: cursor,
        value: letters
      });
      continue;
    }

    if (isQuote(char)) {
      let string = '';

      while (!isQuote(input[++cursor])) {
        string += input[cursor];
      }

      tokens.push({
        type: 'String',
        start: cursor - string.length - 1,
        end: cursor + 1,
        value: string,
      });

      cursor++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }
  return tokens
};
//end tokens


const specialForms = (token) => {} 


const parenthesize = tokens => {
  const token = pop(tokens);

  if (isOpeningBracket(token.value)) {
    const expression = [];

    while (!isClosingBracket(peek(tokens).value)) {
      expression.push(parenthesize(tokens));
    }

    pop(tokens);
    return expression;
  }

  return token;
};

const parse = tokens => {
  if (Array.isArray(tokens)) {
    const [first, ...rest] = tokens;
    return {
      type: 'CallExpression',
      name: first.value,
      arguments: rest.map(parse),
    };
  }

  const token = tokens;

  if (token.type === 'Number') {
    return {
      type: 'NumericLiteral',
      value: token.value,
    };
  }

  if (token.type === 'String') {
    return {
      type: 'StringLiteral',
      value: token.value,
    };
  }

  if (token.type === 'Name') {
    return {
      type: 'Identifier',
      name: token.value,
    };
  }
};

// evaluate the ast tree
const apply = node => {
  const fn = environment[node.name];
  const args = node.arguments.map(evaluate);
  if (typeof fn !== 'function') {
    throw new TypeError(`Function ${node.name} is not defined`);
  }

  return fn(...args);
}

const getId = node => {
  const id = environment[node.name];
  if (typeof id === 'undefined') {
    throw new ReferenceError(`Identifier ${node.name} is not defined`);
  }
  return id;
};

const evaluate = (node) => {
  if (node.type === 'CallExpression') {
    return apply(node)
  }
  if (node.type === 'Identifier') return getId(node);
  if(node.type === 'NumericLiteral') return node.value;
  if (node.value) return node.value;
}

module.exports = {
  tokenize,
  evaluate,
  parse: tokens => parse(parenthesize(tokens))
};
