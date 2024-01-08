import _ from 'lodash';

const space = ' ';
const spacesCountPerDepth = 4;
const indentPerDepth = space.repeat(spacesCountPerDepth);

const getSpecialChar = (type) => {
  switch (type) {
    case 'added':
      return '+';
    case 'removed':
    case 'modified':
      return '-';
    case 'unchanged':
    case 'parent':
      return space;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

const printValue = (object, depth) => {
  if (!_.isPlainObject(object)) {
    return object;
  }
  const keys = Object.keys(object);
  const lines = keys.map((key) => (`${indentPerDepth.repeat(depth)}${key}: ${printValue(object[key], depth + 1)}`));
  const result = `{\n${lines.join('\n')}\n${indentPerDepth.repeat(depth - 1)}}`;
  return result;
};

const makeIndent = (depth, specialChar) => {
  const finalCharsCount = 2;
  const indent = `${space.repeat(spacesCountPerDepth * depth - finalCharsCount)}${specialChar}${space}`;
  return indent;
};

const formatByStylish = (diffTree) => {
  const iter = (tree, depth) => {
    const lines = tree.reduce((acc, child) => {
      const { type, key, mainValue } = child;
      const specialChar = getSpecialChar(type);
      const indent = makeIndent(depth, specialChar);
      const mainLine = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
      switch (type) {
        case 'added':
        case 'removed':
        case 'unchanged':
          return [...acc, mainLine];
        case 'modified':
          return [...acc, mainLine, `${makeIndent(depth, '+')}${key}: ${printValue(child.additionalValue, depth + 1)}`];
        case 'parent':
          return [...acc, `${indent}${key}: ${iter(mainValue, depth + 1)}`];
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }, []);
    return `{\n${lines.join('\n')}\n${space.repeat(spacesCountPerDepth).repeat(depth - 1)}}`;
  };
  return iter(diffTree, 1);
};

export default formatByStylish;
