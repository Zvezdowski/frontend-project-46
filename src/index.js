import * as fs from 'node:fs';
import path from 'path';
import _ from 'lodash';

const getAbsolutePath = (pathToFile) => path.resolve(process.cwd(), pathToFile);
const readFile = (pathToFile) => fs.readFileSync(pathToFile);
const parseJson = (json) => JSON.parse(json);
const parseJsonFromPath = (pathToFile) => parseJson(readFile(getAbsolutePath(pathToFile)));

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  return uniqueKeys.sort();
};

const genDiff = (obj1, obj2) => {
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

export { parseJsonFromPath, genDiff };