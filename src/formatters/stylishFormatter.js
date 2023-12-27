import {
  getProps, getCondition, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const getMainSpecialChar = (condition) => {
  if (condition === 'added') {
    return '+';
  }
  if (condition === 'removed' || condition === 'modified') {
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
    const props = getProps(structure);
    const lines = props.reduce((acc, prop) => {
      const condition = getCondition(prop);
      const key = getKey(prop);
      const specialChar = getMainSpecialChar(condition);
      const indent = makeIndent(depth, specialChar);
      const mainValue = getMainValue(prop);
      if (condition === 'added' || condition === 'removed' || condition === 'unchanged') {
        const line = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
        return [...acc, line];
      }
      if (condition === 'modified') {
        const lineOfBefore = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
        const lineOfAfter = `${makeIndent(depth, getAdditionalSpecialChar())}${key}: ${printValue(getAdditionalValue(prop), depth + 1)}`;
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
