import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';

const getExtention = (filepath) => {
  const extention = _.last(filepath.toString().split('.'));
  if (extention === 'yaml') {
    return 'yml';
  }
  return extention;
};

const parseJson = (fileData) => {
  const obj = JSON.parse(fileData);
  return obj;
};

const parseYaml = (fileData) => {
  const obj = yaml.load(fileData);
  return obj;
};

const parseFile = (pathToFile) => {
  const extention = getExtention(pathToFile);
  const absolutePath = path.resolve(process.cwd(), pathToFile);
  const fileData = fs.readFileSync(absolutePath);
  if (extention === 'json') {
    return parseJson(fileData);
  }
  return parseYaml(fileData);
};

export default parseFile;
