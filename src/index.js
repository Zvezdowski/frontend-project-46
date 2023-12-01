import _ from 'lodash';
import { __dirname } from './utils.js';
import parseFile from './parsers.js';

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  return uniqueKeys.sort();
};

const genDiff = (filepath1, filepath2) => {
  const obj1 = parseFile(filepath1);
  const obj2 = parseFile(filepath2);
  const uniqueKeys = getUniqueKeys(obj1, obj2);
  const changes = uniqueKeys.reduce((acc, key) => {
    const newAcc = acc;
    if (!Object.hasOwn(obj2, key)) {
      newAcc.push(`  - ${key}: ${obj1[key]}`);
    } else if (!Object.hasOwn(obj1, key)) {
      newAcc.push(`  + ${key}: ${obj2[key]}`);
    } else if (obj1[key] === obj2[key]) {
      newAcc.push(`    ${key}: ${obj1[key]}`);
    } else if (obj1[key] !== obj2[key]) {
      newAcc.push(`  - ${key}: ${obj1[key]}`);
      newAcc.push(`  + ${key}: ${obj2[key]}`);
    }
    return newAcc;
  }, []);
  const diff = (`{\n${changes.join('\n')}\n}`);
  return diff;
};

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

export { genDiff, getFixturePath };
