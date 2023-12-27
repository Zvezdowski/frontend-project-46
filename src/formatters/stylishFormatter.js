import {
  getChildren, getType, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const getMainSpecialChar = (type) => {
  if (type === 'added') {
    return '+';
  }
  if (type === 'removed' || type === 'modified') {
    return '-';
  }
  return ' ';
};

const getAdditionalSpecialChar = () => ('+');

const printValue = (object, depth) => {
  if (!isObject(object)) {
    return object;
  }
  const keys = Object.keys(object);
  const indent = '    ';
  const lines = keys.map((key) => (`${indent.repeat(depth)}${key}: ${printValue(object[key], depth + 1)}`));
  const result = `{\n${lines.join('\n')}\n${indent.repeat(depth - 1)}}`;
  return result;
};

const makeIndent = (depth, specialChar) => {
  const space = ' ';
  const indent = `${space.repeat(4 * depth - 2)}${specialChar}${space}`;
  return indent;
};

const formatByStylish = (diffStructure) => {
  const iter = (structure, depth) => {
    const children = getChildren(structure);
    const lines = children.reduce((acc, child) => {
      const type = getType(child);
      const key = getKey(child);
      const specialChar = getMainSpecialChar(type);
      const indent = makeIndent(depth, specialChar);
      const mainValue = getMainValue(child);
      if (type === 'added' || type === 'removed' || type === 'unchanged') {
        const line = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
        return [...acc, line];
      }
      if (type === 'modified') {
        const lineOfBefore = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
        const lineOfAfter = `${makeIndent(depth, getAdditionalSpecialChar())}${key}: ${printValue(getAdditionalValue(child), depth + 1)}`;
        return [...acc, lineOfBefore, lineOfAfter];
      }

      const line = `${indent}${key}: ${iter(mainValue, depth + 1)}`;
      return [...acc, line];
    }, []);
    return `{\n${lines.join('\n')}\n${'    '.repeat(depth - 1)}}`;
  };
  return iter(diffStructure, 1);
};

export default formatByStylish;
