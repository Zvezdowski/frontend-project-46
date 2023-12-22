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

const makeStructureOfDiff = (lines) => ({ lines });

const getLines = (structureOfDiff) => (structureOfDiff.lines);

const getType = (line) => (line.type);

const getKey = (line) => (line.key);

const getValue = (line) => (line.value);

const getSpecialChar = (type) => {
  let specialChar;
  if (type === 'neutral') {
    specialChar = ' ';
  } else if (type === 'added') {
    specialChar = '+';
  } else if (type === 'deleted') {
    specialChar = '-';
  }
  return specialChar;
};

const isObject = (value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

const isDiffStructure = (object) => {
  if (isObject(object) && Object.hasOwn(object, 'lines')) {
    return true;
  }
  return false;
};

const makeLine = (key, type, value) => {
  const line = {
    key, type, value,
  };
  return line;
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
  const strings = keys.map((key) => (`${indent.repeat(depth)}${key}: ${printValue(object[key], depth + 1)}`));
  const result = `{\n${strings.join('\n')}\n${indent.repeat(depth - 1)}}`;
  return result;
};

export const compareObjects = (obj1, obj2) => {
  const uniqueKeys = getUniqueKeys(obj1, obj2);
  const lines = uniqueKeys.reduce((acc, key) => {
    const newAcc = acc;
    if (!Object.hasOwn(obj1, key)) {
      newAcc.push(makeLine(key, 'added', obj2[key]));
    } else if (!Object.hasOwn(obj2, key)) {
      newAcc.push(makeLine(key, 'deleted', obj1[key]));
    } else if (obj1[key] === obj2[key]) {
      newAcc.push(makeLine(key, 'neutral', obj1[key]));
    } else if ((isObject(obj1[key]) && isObject(obj2[key]))) {
      newAcc.push(makeLine(key, 'neutral', compareObjects(obj1[key], obj2[key])));
    } else {
      newAcc.push(makeLine(key, 'deleted', obj1[key]));
      newAcc.push(makeLine(key, 'added', obj2[key]));
    }
    return newAcc;
  }, []);
  const structureOfDiff = makeStructureOfDiff(lines);
  return structureOfDiff;
};

const formatByStylish = (diffStructure) => {
  const iter = (structure, depth) => {
    const lines = getLines(structure);
    const strings = lines.map((line) => {
      const type = getType(line);
      const specialChar = getSpecialChar(type);
      const key = getKey(line);
      const value = getValue(line);
      if (isDiffStructure(value)) {
        return `${makeIndent(depth, specialChar)}${key}: ${iter(value, depth + 1)}`;
      }
      return `${makeIndent(depth, specialChar)}${key}: ${printValue(value, depth + 1)}`;
    });
    return `{\n${strings.join('\n')}\n${'    '.repeat(depth - 1)}}`;
  };
  const result = iter(diffStructure, 1);
  return result;
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

export { genDiff, getFixturePath, formatByStylish };
