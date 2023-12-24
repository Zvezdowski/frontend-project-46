import {
  getProps, getCondition, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const getMainSpecialChar = (condition) => {
  let specialChar;
  if (condition === 'added') {
    specialChar = '+';
  } else if (condition === 'removed' || condition === 'modified') {
    specialChar = '-';
  } else if (condition === 'unchanged' || condition === 'nested') {
    specialChar = ' ';
  }
  return specialChar;
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
      const newAcc = acc;
      const condition = getCondition(prop);
      const key = getKey(prop);
      const specialChar = getMainSpecialChar(condition);
      const indent = makeIndent(depth, specialChar);
      const mainValue = getMainValue(prop);
      if (condition === 'added' || condition === 'removed' || condition === 'unchanged') {
        newAcc.push(`${indent}${key}: ${printValue(mainValue, depth + 1)}`);
      } else if (condition === 'modified') {
        newAcc.push(`${indent}${key}: ${printValue(mainValue, depth + 1)}`);
        newAcc.push(`${makeIndent(depth, getAdditionalSpecialChar())}${key}: ${printValue(getAdditionalValue(prop), depth + 1)}`);
      } else if (condition === 'nested') {
        newAcc.push(`${indent}${key}: ${iter(mainValue, depth + 1)}`);
      }
      return newAcc;
    }, []);
    return `{\n${lines.join('\n')}\n${'    '.repeat(depth - 1)}}`;
  };
  return iter(diffStructure, 1);
};

export default formatByStylish;
