import { dirname } from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import parseFile from './parsers.js';
import getFormatterByStyle from './formatters/index.js';
import { isObject } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  const sortedKeys = _.sortBy(uniqueKeys);
  return sortedKeys;
};

const makeStructureOfDiff = (props) => ({ props });

const makeProp = (key, condition, mainValue, additionalValue = undefined) => {
  if (additionalValue !== undefined) {
    return {
      key, condition, mainValue, additionalValue,
    };
  }
  return { key, condition, mainValue };
};

const genStructureOfDiff = (obj1, obj2) => {
  const uniqueKeys = getUniqueKeys(obj1, obj2);
  const props = uniqueKeys.reduce((acc, key) => {
    if (!Object.hasOwn(obj1, key)) {
      const prop = makeProp(key, 'added', obj2[key]);
      return [...acc, prop];
    }
    if (!Object.hasOwn(obj2, key)) {
      const prop = makeProp(key, 'removed', obj1[key]);
      return [...acc, prop];
    }
    if (obj1[key] === obj2[key]) {
      const prop = makeProp(key, 'unchanged', obj1[key]);
      return [...acc, prop];
    }
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      const prop = makeProp(key, 'nested', genStructureOfDiff(obj1[key], obj2[key]));
      return [...acc, prop];
    }
    const prop = makeProp(key, 'modified', obj1[key], obj2[key]);
    return [...acc, prop];
  }, []);
  const structureOfDiff = makeStructureOfDiff(props);
  return structureOfDiff;
};

const genDiff = (filepath1, filepath2, style = 'stylish') => {
  const obj1 = parseFile(filepath1);
  const obj2 = parseFile(filepath2);
  const diffStructure = genStructureOfDiff(obj1, obj2);
  const formatByStyle = getFormatterByStyle(style);
  return formatByStyle(diffStructure);
};

export {
  getFixturePath, genStructureOfDiff, getFormatterByStyle,
};

export default genDiff;
