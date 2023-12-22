import _ from 'lodash';
import { __dirname } from './utils.js';
import parseFile from './parsers.js';

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  return uniqueKeys.sort();
};

const makeStructureOfDiff = (props) => ({ props });

const getCondition = (prop) => (prop.condition);

const getKey = (prop) => (prop.key);

const isObject = (value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

const makeIndent = (depth, specialChar) => {
  const space = ' ';
  const indent = `${space.repeat(4 * depth - 2)}${specialChar}${space}`;
  return indent;
};

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

const makeProp = (key, condition, mainValue, additionalValue = undefined) => ({
  key, condition, mainValue, additionalValue,
});

const getProps = (diffStructure) => (diffStructure.props);

const compareObjects = (obj1, obj2) => {
  const uniqueKeys = getUniqueKeys(obj1, obj2);
  const props = uniqueKeys.reduce((acc, key) => {
    const newAcc = acc;
    if (!Object.hasOwn(obj1, key)) {
      newAcc.push(makeProp(key, 'added', obj2[key]));
    } else if (!Object.hasOwn(obj2, key)) {
      newAcc.push(makeProp(key, 'removed', obj1[key]));
    } else if (obj1[key] === obj2[key]) {
      newAcc.push(makeProp(key, 'unchanged', obj1[key]));
    } else if (isObject(obj1[key]) && isObject(obj2[key])) {
      newAcc.push(makeProp(key, 'nested', compareObjects(obj1[key], obj2[key])));
    } else {
      newAcc.push(makeProp(key, 'modified', obj1[key], obj2[key]));
    }
    return newAcc;
  }, []);
  const structureOfDiff = makeStructureOfDiff(props);
  return structureOfDiff;
};

const getMainValue = (prop) => (prop.mainValue);

const getAdditionalValue = (prop) => (prop.additionalValue);

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

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = parseFile(filepath1);
  const obj2 = parseFile(filepath2);
  const diffStructure = compareObjects(obj1, obj2);
  switch (format) {
    case 'stylish':
      return formatByStylish(diffStructure);
    default:
      throw new Error('Unknown format');
  }
};

export {
  genDiff, getFixturePath, compareObjects, formatByStylish,
};
