import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';

const parseFile = (filepath) => {
  const extention = _.last(filepath.toString().split('.'));
  const absolutePath = path.resolve(process.cwd(), filepath);
  const fileData = fs.readFileSync(absolutePath);
  switch (extention) {
    case 'yaml':
    case 'yml':
      return yaml.load(fileData);
    case 'json':
      return JSON.parse(fileData);
    default:
      throw new Error(`Unknown extention: ${extention}`);
  }
};

export default parseFile;
