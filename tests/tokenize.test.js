import { tokenize } from '../src/core.js';

describe(tokenize, () => {
  it('should return an array', () => {
    expect(Array.isArray(tokenize(''))).toBe(true);
  });

  it('should be able to tokenize a pair of parentheses', () => {
    const input = '()';
    const result = [
      { type: 'Parenthesis', value: '(', start: 0, end: 1 },
      { type: 'Parenthesis', value: ')', start: 1, end: 2 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should ignore whitespace completely', () => {
    const input = '                  ';
    const result = [];

    expect(tokenize(input)).toEqual(result);
  });

  it('should correctly tokenize a single digit', () => {
    const input = '2';
    const result = [{ type: 'Number', value: 2, start: 0, end: 1 }];

    expect(tokenize(input)).toEqual(result);
  });

  it('should be able to handle single numbers in expressions', () => {
    const input = '(1 2)';

    const result = [
      { type: 'Parenthesis', value: '(', start: 0, end: 1 },
      { type: 'Number', value: 1, start: 1, end: 2 },
      { type: 'Number', value: 2, start: 3, end: 4 },
      { type: 'Parenthesis', value: ')', start: 4 , end: 5 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should be able to handle single letters in expressions', () => {
    const input = '(a b)';

    const result = [
      { type: 'Parenthesis', value: '(', start: 0, end: 1 },
      { type: 'Name', value: 'a', end: 2, start: 1 },
      { type: 'Name', value: 'b', end: 4, start: 3 },
      { type: 'Parenthesis', value: ')', end:5, start:4 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should be able to handle multiple-digit numbers', () => {
    const input = '(11 22)';

    const result = [
      { type: 'Parenthesis', value: '(', start: 0, end: 1 },
      { type: 'Number', value: 11 , end:3 , start:1},
      { type: 'Number', value: 22, end: 6, start: 4 },
      { type: 'Parenthesis', value: ')', end:7, start: 6 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should correctly tokenize a simple expression', () => {
    const input = '(add 2 3)';
    const result = [
      { type: 'Parenthesis', value: '(', end: 1, start:0 },
      { type: 'Name', value: 'add', end:4, start: 1 },
      { type: 'Number', value: 2 , end:6, start:5},
      { type: 'Number', value: 3, end:8 , start: 7 },
      { type: 'Parenthesis', value: ')', end: 9, start: 8 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should ignore whitespace', () => {
    const input = '   (add    2 3)';
    const result = [
      { type: 'Parenthesis', value: '(', start:3, end: 4 },
      { type: 'Name', value: 'add', start: 4, end: 7 },
      { type: 'Number', value: 2, start: 11, end: 12 },
      { type: 'Number', value: 3, start: 13, end: 14 },
      { type: 'Parenthesis', value: ')', start: 14, end: 15 },
    ];

    expect(tokenize(input)).toEqual(result);
  });

  it('should know about strings', () => {
    const input = '(log "hello" "world")';
    const result = [
      { type: 'Parenthesis', value: '(', start: 0, end: 1 },
      { type: 'Name', value: 'log', start: 1, end: 4 },
      { type: 'String', value: 'hello', start: 5, end: 12 },
      { type: 'String', value: 'world', start: 13, end: 20 },
      { type: 'Parenthesis', value: ')', start: 20, end: 21 },
    ];

    expect(tokenize(input)).toEqual(result);
  });
});
